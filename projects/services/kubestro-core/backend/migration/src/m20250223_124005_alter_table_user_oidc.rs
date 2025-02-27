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
                    .values([UserProvider::Local, UserProvider::Oidc])
                    .to_owned(),
            )
            .await?;

        manager
            .alter_table(
                Table::alter()
                    .table(User::Table)
                    .add_column(
                        ColumnDef::new(User::Provider)
                            .custom(UserProvider::Enum)
                            .null()
                            .default(SimpleExpr::Custom("'local'::user_provider".to_owned())),
                    )
                    .to_owned(),
            )
            .await?;

        // Update the provider field for the existing users
        manager.exec_stmt(
            Query::update()
            .table(User::Table)
                .value(
                    User::Provider,
                    Expr::cust(r#"CASE
                        WHEN "user".password IS NOT NULL THEN 'local'::user_provider
                        WHEN EXISTS (SELECT 1 FROM "user_oidc" WHERE "user_oidc".user_id = "user".id) THEN 'oidc'::user_provider
                        END"#)
                ).to_owned()
        ).await?;

        // Finally, make the provider field non-nullable
        manager
            .alter_table(
                Table::alter()
                    .table(User::Table)
                    .modify_column(
                        ColumnDef::new(User::Provider)
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
                    .drop_column(User::Provider)
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
    Provider,
}

#[derive(DeriveIden)]
pub enum UserProvider {
    #[sea_orm(iden = "user_provider")]
    Enum,

    #[sea_orm(iden = "local")]
    Local,

    #[sea_orm(iden = "oidc")]
    Oidc,
}
