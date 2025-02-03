#[cfg(test)]
use mockall::automock;

#[cfg_attr(test, automock)]
pub trait PasswordValidator: Send + Sync {
    fn validate(&self, password: &str) -> Result<(), validator::ValidationError>;
}
