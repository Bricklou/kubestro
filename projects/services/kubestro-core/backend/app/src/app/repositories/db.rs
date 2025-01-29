use std::time::Duration;

use sea_orm::{ConnectOptions, Database, DatabaseConnection};

pub struct DbProvider {
    db: DatabaseConnection,
}

impl DbProvider {
    pub async fn new(database_url: &str) -> Result<Self, sea_orm::DbErr> {
        let mut opt = ConnectOptions::new(database_url);
        opt.max_connections(100)
            .min_connections(5)
            .connect_timeout(Duration::from_secs(5))
            .sqlx_logging(true);

        let db: DatabaseConnection = Database::connect(opt).await?;

        Ok(Self { db })
    }

    pub fn get_db(&self) -> &DatabaseConnection {
        &self.db
    }
}
