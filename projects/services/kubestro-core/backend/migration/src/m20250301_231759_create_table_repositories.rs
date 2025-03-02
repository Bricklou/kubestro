use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Repository::Table)
                    .if_not_exists()
                    .col(pk_uuid(Repository::Id))
                    .col(string(Repository::Name))
                    .col(string(Repository::Url))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Repository::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Repository {
    Table,
    Id,
    Name,
    Url,
}
