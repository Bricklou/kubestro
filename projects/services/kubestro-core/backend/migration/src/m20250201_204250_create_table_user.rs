use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(User::Table)
                    .if_not_exists()
                    .col(pk_auto(User::Id))
                    .col(string(User::Username).unique_key())
                    .col(string(User::Email).unique_key())
                    .col(string(User::Password))
                    .col(
                        timestamp_with_time_zone(User::CreatedAt)
                            .extra("DEFAULT CURRENT_TIMESTAMP"),
                    )
                    .col(
                        timestamp_with_time_zone(User::UpdatedAt)
                            .extra("DEFAULT CURRENT_TIMESTAMP"),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(User::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum User {
    Table,
    Id,
    Username,
    Email,
    Password,
    CreatedAt,
    UpdatedAt,
}
