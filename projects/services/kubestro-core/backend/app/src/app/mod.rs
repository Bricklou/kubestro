use init::create_app_context;
use tokio::{signal, sync::mpsc};
use tokio_util::sync::CancellationToken;

mod http;
mod init;
mod k8s;

/// Start the Kubestro Core application
pub async fn start() -> anyhow::Result<()> {
    info!("Welcome to Kubestro Core!");

    // Create a new CancellationToken, which will be used to signal the shutdown
    let shutdown_token = CancellationToken::new();
    // Clone the token for use in tasks
    let http_shutdown_token = shutdown_token.clone();
    let k8s_shutdown_token = shutdown_token.clone();

    // Create a mpsc channel to send shutdown signal
    let (_shutdown_send, mut shutdown_recv) = mpsc::unbounded_channel::<()>();

    // Initialize the application context
    let app_context = create_app_context().await?;

    // Spawn the HTTP server tasks
    let http_handle =
        tokio::spawn(
            async move { http::start_http_server(http_shutdown_token, app_context).await },
        );
    let k8s_handle =
        tokio::spawn(async move { k8s::start_k8s_loop(k8s_shutdown_token.cancelled()).await });

    // Handle shutdown signal
    tokio::select! {
        _ = signal::ctrl_c() => {
            info!("Received ctrl-c signal, shutting down...");
        },
        _ = shutdown_recv.recv() => {
            info!("Received shutdown signal, shutting down...");
        }
    }

    // Signal all tasks to shut down
    shutdown_token.cancel();

    // Wait for all tasks to complete
    http_handle.await??;
    k8s_handle.await??;

    info!("All tasks have completed, shutting down...");
    Ok(())
}
