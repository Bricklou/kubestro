use anyhow::Context;
use kubestro_core_infra::repositories::db::{create_db_connection, DbProvider};
use redis_pool::{RedisPool, SingleRedisPool};

/// Initialize the database connection
pub async fn init_database() -> anyhow::Result<DbProvider> {
    let db_url = std::env::var("DATABASE_URL").context("DATABASE_URL is not set")?;
    let db = create_db_connection(&db_url).await?;
    Ok(db)
}

/// Initialize the cache connection (Redis)
pub async fn init_cache() -> anyhow::Result<SingleRedisPool> {
    let redis_url = std::env::var("REDIS_URL").context("REDIS_URL is not set")?;
    let client = redis::Client::open(redis_url)?;
    let pool = RedisPool::from(client);
    Ok(pool)
}
