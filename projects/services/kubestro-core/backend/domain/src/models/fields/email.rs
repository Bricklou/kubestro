use std::ops::Deref;

use serde::{Deserialize, Serialize};
use validator::ValidateEmail;

/// The [`Email`] field represent an email address object.
/// When created, it will validate the email address.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Email(String);

impl Email {
    /// Return the email address value.
    #[inline]
    pub fn value(&self) -> &str {
        &self.0
    }
}

/// Implement the [`TryFrom`] trait to convert a string into an [`Email`] object.
/// If the conversion fails, it will return an [`EmailError`].
impl TryFrom<String> for Email {
    type Error = EmailError;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        if value.is_empty() {
            return Err(EmailError::Empty);
        }

        if !value.validate_email() {
            return Err(EmailError::Invalid);
        }

        Ok(Email(value))
    }
}

impl TryFrom<&str> for Email {
    type Error = EmailError;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        Self::try_from(value.to_string())
    }
}

impl Deref for Email {
    type Target = String;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[derive(Debug, thiserror::Error, PartialEq)]
pub enum EmailError {
    /// An email must not be empty.
    #[error("An email must not be empty")]
    Empty,
    /// An email must be valid.
    #[error("An email must be valid")]
    Invalid,
}

#[cfg(test)]
mod tests {
    use super::*;

    const VALID_EMAIL: &str = "toto@example.com";

    #[test]
    fn empty_email_should_throw_an_error() {
        let email = Email::try_from("");

        assert!(email.is_err());
        assert_eq!(email.unwrap_err(), EmailError::Empty);
    }

    #[test]
    fn invalid_email_should_throw_an_error() {
        let email = Email::try_from("invalid-email");

        assert!(email.is_err());
        assert_eq!(email.unwrap_err(), EmailError::Invalid);
    }

    #[test]
    fn valid_email_should_return_an_email() {
        let email = Email::try_from(VALID_EMAIL);

        assert!(email.is_ok());
        assert_eq!(email.unwrap().value(), VALID_EMAIL);
    }
}
