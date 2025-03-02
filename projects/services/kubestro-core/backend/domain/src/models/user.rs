use std::fmt::Display;

use chrono::{DateTime, Utc};

use crate::impl_entity_id;

use super::{
    fields::{email::Email, password::Password, username::Username},
    Entity,
};

impl_entity_id!(
    /// User Id
    UserId
);

/// This model represents the user provider
#[derive(Debug, Clone, PartialEq, Default)]
pub enum UserProvider {
    /// The user is a local user
    #[default]
    Local,
    /// The user is a OIDC user
    Oidc,
}

impl Display for UserProvider {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            UserProvider::Local => write!(f, "local"),
            UserProvider::Oidc => write!(f, "oidc"),
        }
    }
}

/// This model represents a user entity inside the system
#[derive(Debug, Clone, PartialEq)]
pub struct User {
    /// The id of the user
    id: UserId,
    /// The username of the user
    pub username: Username,
    /// The email of the user.
    pub email: Email,
    /// The password of the user.
    pub password: Option<Password>,
    /// The date and time the user was created.
    pub created_at: DateTime<Utc>,
    /// The date and time the user was last updated.
    pub updated_at: DateTime<Utc>,

    /// Provider of the user
    pub provider: UserProvider,
}

impl User {
    /// Create a new user.
    pub fn new(
        id: UserId,
        username: Username,
        email: Email,
        password: Option<Password>,
        created_at: DateTime<Utc>,
    ) -> Self {
        Self {
            id,
            username,
            email,
            password,
            created_at,
            updated_at: created_at,
            provider: UserProvider::default(),
        }
    }

    pub fn set_provider(&mut self, provider: UserProvider) -> &Self {
        self.provider = provider;
        self
    }
}

impl Entity<UserId> for User {
    fn id(&self) -> UserId {
        self.id.clone()
    }
}

#[cfg(test)]
mod tests {
    use crate::models::EntityId;

    use super::*;

    #[test]
    fn test_user_id() {
        let id = UserId::new();
        assert_eq!(id.value().to_string().len(), 36);
    }

    #[test]
    fn test_user() {
        let id = UserId::new();
        let username = Username::try_from("username").unwrap();
        let email = Email::try_from("toto@example.com").unwrap();
        let password: Password = "password".into();

        let user = User::new(
            id.clone(),
            username.clone(),
            email.clone(),
            Some(password.clone()),
            Utc::now(),
        );

        assert_eq!(user.id(), id);
        assert_eq!(user.username, username);
        assert_eq!(user.email, email);
        assert_eq!(user.password, Some(password));
    }
}

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
