use std::{net::Ipv4Addr, sync::Arc};

use anyhow::Context;
use kubestro_core_domain::{
    ports::{hasher::Hasher, repositories::user_repository::UserRepository},
    services::auth::local_auth::LocalAuthService,
};
use kubestro_core_infra::{
    repositories::{db::create_db_connection, user_repo::UserPgRepo},
    services::{argon_hasher::Argon2Hasher, password_validator::InfraPasswordValidator},
};
use redis_pool::{RedisPool, SingleRedisPool};
use tokio::{net::TcpListener, signal};

mod dto;
mod middlewares;
mod routes;
mod utils;

#[derive(Clone)]
struct ApiContext {
    // Repositories
    user_repo: Arc<dyn UserRepository>,

    // Services
    hasher: Arc<dyn Hasher>,
    local_auth: Arc<LocalAuthService>,

    // Redis pool
    pool: SingleRedisPool,
}

/// Start the Kubestro Core application
pub async fn start() -> anyhow::Result<()> {
    info!("Welcome to Kubestro Core!");

    // Initialize database connection
    let db_url = std::env::var("DATABASE_URL").context("DATABASE_URL is not set")?;
    let db = Arc::new(create_db_connection(&db_url).await?);

    // === INFRASTRUCTURE ===
    // Services
    let hasher = Arc::new(Argon2Hasher::default());
    let password_validator = Arc::new(InfraPasswordValidator::default());

    // Repositories

    // === DOMAIN ===
    // Repositories
    let user_repo = Arc::new(UserPgRepo::new(db.clone()));
    let local_auth = Arc::new(LocalAuthService::new(
        user_repo.clone(),
        hasher.clone(),
        password_validator.clone(),
    ));

    // === API ===
    // Redis pool
    let redis_url = std::env::var("REDIS_URL").context("REDIS_URL is not set")?;
    let client = redis::Client::open(redis_url)?;
    let pool = RedisPool::from(client);

    // Create context
    let context = ApiContext {
        user_repo,
        hasher,
        local_auth,
        pool,
    };

    // Create router
    let router = routes::get_routes(context).await?;

    // Run Axum HTTP server
    let listener = TcpListener::bind((Ipv4Addr::UNSPECIFIED, 8001)).await?;
    info!("Listening on: {}", listener.local_addr()?);
    axum::serve(listener, router)
        .with_graceful_shutdown(shutdown_signal())
        .await?;

    Ok(())
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install CTRL+C signal handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _=  terminate => {},
    }
}
