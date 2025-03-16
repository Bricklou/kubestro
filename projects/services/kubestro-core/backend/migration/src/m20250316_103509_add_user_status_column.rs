use sea_orm_migration::prelude::{extension::postgres::Type, *};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_type(
                Type::create()
                    .as_enum(UserProvider::Enum)
                    .values([
                        UserProvider::Active,
                        UserProvider::Inactive,
                        UserProvider::Invited,
                        UserProvider::Suspended,
                    ])
                    .to_owned(),
            )
            .await?;

        manager
            .alter_table(
                Table::alter()
                    .table(User::Table)
                    .add_column(
                        ColumnDef::new(User::Status)
                            .custom(UserProvider::Enum)
                            .null()
                            .default(SimpleExpr::Custom("'inactive'::user_status".to_owned())),
                    )
                    .to_owned(),
            )
            .await?;

        // Update the status field for the existing users
        manager
            .exec_stmt(
                Query::update()
                    .table(User::Table)
                    .value(
                        User::Status,
                        Expr::cust(
                            r#"CASE
                            WHEN "user".password IS NOT NULL THEN 'active'::user_status
                            ELSE 'inactive'::user_status
                            END"#,
                        ),
                    )
                    .to_owned(),
            )
            .await?;

        // Finally, make the status field non-nullable
        manager
            .alter_table(
                Table::alter()
                    .table(User::Table)
                    .modify_column(
                        ColumnDef::new(User::Status)
                            .custom(UserProvider::Enum)
                            .not_null(),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(User::Table)
                    .drop_column(User::Status)
                    .to_owned(),
            )
            .await?;

        manager
            .drop_type(Type::drop().name(UserProvider::Enum).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum User {
    Table,
    Status,
}

#[derive(DeriveIden)]
pub enum UserProvider {
    #[sea_orm(iden = "user_status")]
    Enum,

    #[sea_orm(iden = "active")]
    Active,

    #[sea_orm(iden = "inactive")]
    Inactive,

    #[sea_orm(iden = "invited")]
    Invited,

    #[sea_orm(iden = "suspended")]
    Suspended,
}
