use sea_orm_migration::{prelude::*, schema::*};

use crate::m20250201_204250_create_table_user::User;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(UserOidc::Table)
                    .if_not_exists()
                    .col(pk_uuid(UserOidc::Id))
                    .col(uuid(UserOidc::UserId).unique_key())
                    .col(string(UserOidc::OidcSubject).unique_key())
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_user-oidc_user_id")
                            .from(UserOidc::Table, UserOidc::UserId)
                            .to(User::Table, User::Id),
                    )
                    .index(
                        Index::create()
                            .name("idx_user-oidc_oidc_subject")
                            .table(UserOidc::Table)
                            .col(UserOidc::OidcSubject)
                            .col(UserOidc::UserId)
                            .unique(),
                    )
                    .to_owned(),
            )
            .await?;

        // Update the user table to make the password field nullable
        manager
            .alter_table(
                Table::alter()
                    .table(User::Table)
                    .modify_column(string_null(User::Password))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(UserOidc::Table).to_owned())
            .await?;

        // Revert the user table to make the password field non-nullable
        manager
            .alter_table(
                Table::alter()
                    .table(User::Table)
                    .modify_column(string(User::Password).default(""))
                    .to_owned(),
            )
            .await
    }
}

#[derive(DeriveIden)]
enum UserOidc {
    Table,
    Id,
    UserId,
    OidcSubject,
}
