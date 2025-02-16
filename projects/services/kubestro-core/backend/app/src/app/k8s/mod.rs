use tokio_util::sync::CancellationToken;

use super::context::AppContext;

pub async fn start_k8s_loop(
    shutdown_token: CancellationToken,
    _app_context: AppContext,
) -> anyhow::Result<()> {
    // Wait for shutdown signal
    tokio::select! {
        _ = shutdown_token.cancelled() => {
            trace!("K8S loop shutdown signal received");
        }
    };

    Ok(())
}
