use kube::Client;

#[derive(Clone)]
pub struct K8sClient {
    client: Client,
}

impl K8sClient {
    pub async fn try_new() -> Result<Self, K8sClientError> {
        Ok(Self {
            client: Client::try_default().await?,
        })
    }

    pub fn client(&self) -> Client {
        self.client.clone()
    }
}

#[derive(Debug, thiserror::Error)]
pub enum K8sClientError {
    #[error("An error occurred while creating the Kubernetes client: {0}")]
    ClientError(#[from] kube::error::Error),
}
