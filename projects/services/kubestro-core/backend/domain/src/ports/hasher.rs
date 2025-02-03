use mockall::automock;

use crate::models::fields::password::Password;

#[automock]
pub trait Hasher: Send + Sync {
    fn hash(&self, value: &str) -> Result<String, HasherError>;
    fn verify(&self, value: &str, hash: &Password) -> Result<(), HasherError>;
}

#[derive(Debug, thiserror::Error, PartialEq)]
pub enum HasherError {
    #[error("An error occurred while hashing the value: {0}")]
    HashError(String),
    #[error("An error occurred while verifying the value: {0}")]
    VerifyError(String),
}
