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
    services::{
        argon_hasher::Argon2Hasher, k8s_client::K8sClient,
        password_validator::InfraPasswordValidator,
    },
};
use redis_pool::{RedisPool, SingleRedisPool};
use serde::Serialize;
use tokio::sync::RwLock;
use utoipa::ToSchema;

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

#[derive(Debug, Clone, Serialize, ToSchema, Eq, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum ServiceStatus {
    Installed,
    NotInstalled,
    NotReady,
}

#[derive(Clone, Debug)]
pub struct SharedState {
    // Service status
    pub(crate) status: ServiceStatus,
}

#[derive(Clone)]
pub struct AppContext {
    // Shared states
    pub(crate) shared_state: Arc<RwLock<SharedState>>,

    // Repositories
    pub(crate) user_repo: Arc<dyn UserRepository>,

    // Services
    pub(crate) hasher: Arc<dyn Hasher>,
    pub(crate) local_auth: Arc<LocalAuthService>,
    pub(crate) k8s_client: Arc<K8sClient>,

    // Redis pool
    pub(crate) pool: SingleRedisPool,
}

pub async fn create_app_context() -> anyhow::Result<AppContext> {
    // Initialize K8S client (needs to be initialized first since everything else depends on it)
    let k8s_client = Arc::new(K8sClient::try_new().await?);

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

    // Shared states
    let shared_state = Arc::new(RwLock::new(SharedState {
        status: ServiceStatus::NotReady,
    }));

    let api_context = AppContext {
        shared_state,
        pool,
        local_auth,
        hasher,
        user_repo,
        k8s_client,
    };

    Ok(api_context)
}
