use std::net::Ipv4Addr;

use anyhow::Context;
use migration::{Migrator, MigratorTrait};
use repositories::db::create_db_connection;
use sea_orm::DatabaseConnection;
use tokio::{net::TcpListener, signal};

mod middlewares;
mod repositories;
mod routes;
mod utils;

#[derive(Clone)]
struct ApiContext {
    db: DatabaseConnection,
}

/// Start the Kubestro Core application
pub async fn start() -> anyhow::Result<()> {
    info!("Welcome to Kubestro Core!");

    // Initialize database connection
    let db_url = std::env::var("DATABASE_URL").expect("DATABASE_URL is not set");
    let db = create_db_connection(&db_url).await?;

    // Run database migrations
    Migrator::up(&db, None)
        .await
        .context("Failed to run migrations")?;

    // Create context
    let context = ApiContext { db };

    // Create router
    let router = routes::get_routes(context);

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
