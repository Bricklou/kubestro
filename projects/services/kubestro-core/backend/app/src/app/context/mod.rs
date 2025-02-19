use std::sync::Arc;

use kubestro_core_domain::{
    ports::repositories::user_repository::UserRepository,
    services::auth::local_auth::LocalAuthService,
};
use kubestro_core_infra::{
    repositories::user_repo::UserPgRepo,
    services::{argon_hasher::Argon2Hasher, password_validator::InfraPasswordValidator},
};
use redis_pool::SingleRedisPool;
use serde::Serialize;
use std::sync::RwLock;
use utoipa::ToSchema;

mod db;
mod oidc;

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
    pub(crate) local_auth: Arc<LocalAuthService>,

    // Redis pool
    pub(crate) pool: SingleRedisPool,

    // OIDC configuration
    pub(crate) oidc_config: Option<oidc::OidcConfig>,
}

pub async fn create_app_context() -> anyhow::Result<AppContext> {
    // Initialize database connection
    let db = Arc::new(db::init_database().await?);

    // Initialize cache connection
    let pool = db::init_cache().await?;

    // Initialize OIDC configuration
    let oidc_config = oidc::init_oidc_config().await;

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
        user_repo,
        oidc_config,
    };

    Ok(api_context)
}
