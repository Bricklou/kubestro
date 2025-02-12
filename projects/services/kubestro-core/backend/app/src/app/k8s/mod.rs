use std::future::Future;

pub async fn start_k8s_loop<F>(shutdown_signal: F) -> anyhow::Result<()>
where
    F: Future<Output = ()> + Send + Sync,
{
    Ok(())
}
