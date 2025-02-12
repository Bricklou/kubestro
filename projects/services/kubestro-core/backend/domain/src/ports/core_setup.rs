#[async_trait::async_trait]
pub trait CoreSetup: Send + Sync {
    async fn is_setup(&self) -> Result<bool, CoreSetupError>;

    async fn setup(&self) -> Result<(), CoreSetupError>;
}

#[derive(Debug, thiserror::Error, PartialEq)]
pub enum CoreSetupError {
    #[error("An error occurred while checking the installation state: {0}")]
    SetupError(String),
}
