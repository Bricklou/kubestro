use std::fmt::Display;

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::{
    fields::{email::Email, password::Password, username::Username},
    Entity, EntityId,
};

/// User Id
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub struct UserId(Uuid);

impl EntityId for UserId {
    fn new() -> Self {
        Self(Uuid::new_v4())
    }

    fn value(&self) -> Uuid {
        self.0
    }
}

impl Default for UserId {
    fn default() -> Self {
        Self::new()
    }
}

impl Display for UserId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl From<Uuid> for UserId {
    fn from(id: Uuid) -> Self {
        Self(id)
    }
}

impl TryFrom<String> for UserId {
    type Error = uuid::Error;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        Uuid::parse_str(value.as_str()).map(Self)
    }
}

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
