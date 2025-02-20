pub use sea_orm_migration::prelude::*;

mod m20250201_204250_create_table_user;
mod m20250220_082156_create_table_user_oidc;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20250201_204250_create_table_user::Migration),
            Box::new(m20250220_082156_create_table_user_oidc::Migration),
        ]
    }
}
