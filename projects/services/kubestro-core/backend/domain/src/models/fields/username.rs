use std::ops::Deref;

use serde::{Deserialize, Serialize};
use validator::ValidateLength;

/// The [`Username`] field represent a username object
/// When created, it will validate the username
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Username(String);

impl Username {
    /// Return the username value
    #[inline]
    pub fn value(&self) -> &String {
        &self.0
    }
}

/// Implement the TryFrom trait to convert a string into an [`Username`] object
/// If the conversion fails, it will return an [`UsernameError`]
impl TryFrom<String> for Username {
    type Error = UsernameError;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        if value.is_empty() {
            return Err(UsernameError::Empty);
        }

        if !value.validate_length(Some(3), Some(20), None) {
            return Err(UsernameError::InvalidLength);
        }

        Ok(Self(value))
    }
}

impl TryFrom<&str> for Username {
    type Error = UsernameError;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        Self::try_from(value.to_string())
    }
}

impl Deref for Username {
    type Target = String;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

#[derive(Debug, thiserror::Error, PartialEq)]
pub enum UsernameError {
    /// A username must not be empty
    #[error("A username must not be empty")]
    Empty,

    /// A username must have between 3 and 20 characters
    #[error("A username must have between 3 and 20 characters")]
    InvalidLength,
}

#[cfg(test)]
mod tests {
    use super::*;

    const VALID_USERNAME: &str = "username";

    #[test]
    fn empty_username_should_throw_an_error() {
        let username = Username::try_from("");
        assert!(username.is_err());
        assert_eq!(username.unwrap_err(), UsernameError::Empty);
    }

    #[test]
    fn too_small_username_should_throw_an_error() {
        let username = Username::try_from("a");
        assert!(username.is_err());
        assert_eq!(username.unwrap_err(), UsernameError::InvalidLength);
    }

    #[test]
    fn too_big_username_should_throw_an_error() {
        let username = Username::try_from("a".repeat(21));
        assert!(username.is_err());
        assert_eq!(username.unwrap_err(), UsernameError::InvalidLength);
    }

    #[test]
    fn valid_username_should_return_an_username() {
        let username = Username::try_from(VALID_USERNAME);
        assert!(username.is_ok());
        assert_eq!(username.unwrap().value(), VALID_USERNAME);
    }
}
