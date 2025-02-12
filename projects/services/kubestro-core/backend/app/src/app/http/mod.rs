use std::net::Ipv4Addr;

use tokio::net::TcpListener;
use tokio_util::sync::CancellationToken;

use super::init::AppContext;

pub mod dto;
pub mod helpers;
pub mod middlewares;
pub mod routes;

pub async fn start_http_server(
    cancel: CancellationToken,
    app_context: AppContext,
) -> anyhow::Result<()> {
    info!("Starting HTTP server");

    // Create router
    let router = routes::get_routes(app_context).await?;

    // Run Axum HTTP server
    let listener = TcpListener::bind((Ipv4Addr::UNSPECIFIED, 8001)).await?;
    info!("Listening on http://{}", listener.local_addr()?);
    axum::serve(listener, router)
        .with_graceful_shutdown(async move { cancel.cancelled().await })
        .await?;

    Ok(())
}
