use std::{ops::Deref, sync::Arc};

use crate::ports::{
    hasher::{Hasher, HasherError},
    validators::PasswordValidator,
};
use serde::{Deserialize, Serialize};

/// [`Password`] field represent a password object.
/// When created, it will validate the password.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Password(Box<str>);

impl Password {
    /// Return the password value.
    #[inline]
    pub fn value(&self) -> &str {
        &self.0
    }
}

impl Password {
    /// Generate a new password hash from a [`String`]. Also apply the validation on it.
    pub fn from_string(
        value: &str,
        hasher: Arc<dyn Hasher>,
        password_validator: Arc<dyn PasswordValidator>,
    ) -> Result<Password, PasswordError> {
        if value.is_empty() {
            return Err(PasswordError::Empty);
        }

        password_validator
            .validate(value)
            .map_err(PasswordError::Validation)?;

        let hashed_pass = hasher.hash(value)?;
        let hashed_pass = Self(hashed_pass.into_boxed_str());
        Ok(hashed_pass)
    }

    pub fn from_hash(value: String) -> Password {
        Self(value.into_boxed_str())
    }

    pub fn verify(&self, password: &str, hasher: Arc<dyn Hasher>) -> Result<(), PasswordError> {
        hasher.verify(password, self).map_err(|e| match e {
            HasherError::InvalidPassword => PasswordError::InvalidPassword,
            e => PasswordError::Hashing(e),
        })
    }
}

impl From<String> for Password {
    fn from(value: String) -> Self {
        Self(value.into_boxed_str())
    }
}

impl From<&str> for Password {
    fn from(value: &str) -> Self {
        Self(value.into())
    }
}

impl Deref for Password {
    type Target = str;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[derive(Debug, thiserror::Error, PartialEq)]
pub enum PasswordError {
    /// A password must not be empty.
    #[error("A password must not be empty")]
    Empty,

    /// An error occurred while hashing the password.
    #[error("An error occurred while hashing the password: {0}")]
    Hashing(#[from] HasherError),

    /// Invalid password.
    #[error("Invalid password")]
    InvalidPassword,

    /// An error occurred while validating the password.
    #[error("An error occurred while validating the password: {0}")]
    Validation(#[from] validator::ValidationError),
}

#[cfg(test)]
mod tests {
    use mockall::predicate::*;

    use crate::ports::hasher::MockHasher;
    use crate::ports::validators::MockPasswordValidator;

    use super::*;

    const VALID_PASSWORD: &str = "password";
    const EMPTY_PASSWORD: &str = "";
    const INVALID_PASSWORD: &str = "invalid";
    const HASHED_PASSWORD: &str = "hashed";

    #[test]
    fn empty_password_should_throw_an_error() {
        // Arrange
        let hasher = MockHasher::new();
        let password_validator = MockPasswordValidator::new();

        // Act
        let password = Password::from_string(
            EMPTY_PASSWORD,
            Arc::new(hasher),
            Arc::new(password_validator),
        );

        // Assert
        assert!(password.is_err());
        assert_eq!(password.unwrap_err(), PasswordError::Empty);
    }

    #[test]
    fn invalid_password_should_throw_an_error() {
        // Arrange
        let hasher = MockHasher::new();
        let mut password_validator = MockPasswordValidator::new();
        password_validator
            .expect_validate()
            .with(eq(INVALID_PASSWORD))
            .once()
            .returning(|_| Err(validator::ValidationError::new("invalid password")));

        // Act
        let password = Password::from_string(
            INVALID_PASSWORD,
            Arc::new(hasher),
            Arc::new(password_validator),
        );

        // Assert
        assert!(password.is_err());
        assert_eq!(
            password.unwrap_err(),
            PasswordError::Validation(validator::ValidationError::new("invalid password"))
        );
    }

    #[test]
    fn valid_password_should_return_a_password() {
        // Arrange
        let mut hasher = MockHasher::new();
        hasher
            .expect_hash()
            .with(eq(VALID_PASSWORD))
            .once()
            .returning(|_| Ok(String::from(HASHED_PASSWORD)));

        // Arrange
        let mut password_validator = MockPasswordValidator::new();
        password_validator
            .expect_validate()
            .with(eq(VALID_PASSWORD))
            .once()
            .returning(|_| Ok(()));

        // Act
        let password = Password::from_string(
            VALID_PASSWORD,
            Arc::new(hasher),
            Arc::new(password_validator),
        );

        // Assert
        assert!(password.is_ok());
        assert_eq!(password.unwrap().value(), HASHED_PASSWORD);
    }
}
