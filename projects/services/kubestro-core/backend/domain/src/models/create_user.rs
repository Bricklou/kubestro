use crate::models::fields::{email::Email, password::Password, username::Username};

use super::user::UserProvider;

/// Create User model
#[derive(Debug, Clone, PartialEq)]
pub struct CreateUser {
    /// The username of the user
    pub username: Username,
    /// The email of the user
    pub email: Email,
    /// The password of the user
    pub password: Option<Password>,
    /// Provider
    pub provider: UserProvider,
}
