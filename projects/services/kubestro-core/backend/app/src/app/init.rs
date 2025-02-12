use std::sync::Arc;

use anyhow::Context;
use kubestro_core_domain::{
    ports::{hasher::Hasher, repositories::user_repository::UserRepository},
    services::auth::local_auth::LocalAuthService,
};
use kubestro_core_infra::{
    repositories::{
        db::{create_db_connection, DbProvider},
        user_repo::UserPgRepo,
    },
    services::{argon_hasher::Argon2Hasher, password_validator::InfraPasswordValidator},
};
use redis_pool::{RedisPool, SingleRedisPool};

async fn init_database() -> anyhow::Result<DbProvider> {
    let db_url = std::env::var("DATABASE_URL").context("DATABASE_URL is not set")?;
    let db = create_db_connection(&db_url).await?;
    Ok(db)
}

async fn init_cache() -> anyhow::Result<SingleRedisPool> {
    let redis_url = std::env::var("REDIS_URL").context("REDIS_URL is not set")?;
    let client = redis::Client::open(redis_url)?;
    let pool = RedisPool::from(client);
    Ok(pool)
}

#[derive(Clone)]
pub struct AppContext {
    // Repositories
    pub(crate) user_repo: Arc<dyn UserRepository>,

    // Services
    pub(crate) hasher: Arc<dyn Hasher>,
    pub(crate) local_auth: Arc<LocalAuthService>,

    // Redis pool
    pub(crate) pool: SingleRedisPool,
}

pub async fn create_app_context() -> anyhow::Result<AppContext> {
    // Initialize database connection
    let db = Arc::new(init_database().await?);

    // Initialize cache connection
    let pool = init_cache().await?;

    // Infrastructure Services
    let hasher = Arc::new(Argon2Hasher::default());
    let password_validator = Arc::new(InfraPasswordValidator::default());

    // Repositories
    let user_repo = Arc::new(UserPgRepo::new(db.clone()));
    let local_auth = Arc::new(LocalAuthService::new(
        user_repo.clone(),
        hasher.clone(),
        password_validator.clone(),
    ));

    let api_context = AppContext {
        pool,
        local_auth,
        hasher,
        user_repo,
    };

    Ok(api_context)
}
