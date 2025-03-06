pub use sea_orm_migration::prelude::*;

mod m20250201_204250_create_table_user;
mod m20250220_082156_create_table_user_oidc;
mod m20250223_124005_alter_table_user_oidc;
mod m20250301_231759_create_table_repositories;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20250201_204250_create_table_user::Migration),
            Box::new(m20250220_082156_create_table_user_oidc::Migration),
            Box::new(m20250223_124005_alter_table_user_oidc::Migration),
            Box::new(m20250301_231759_create_table_repositories::Migration),
        ]
    }
}
