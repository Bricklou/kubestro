use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use utoipa::{PartialSchema, ToSchema};
use uuid::Uuid;

use super::{
    fields::{email::Email, password::Password, username::Username},
    Entity, EntityId,
};

/// User Id
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct UserId(Uuid);

impl EntityId for UserId {
    fn new() -> Self {
        Self(Uuid::new_v4())
    }

    fn value(&self) -> Uuid {
        self.0
    }
}

impl From<Uuid> for UserId {
    fn from(id: Uuid) -> Self {
        Self(id)
    }
}

impl PartialSchema for UserId {
    fn schema() -> utoipa::openapi::RefOr<utoipa::openapi::schema::Schema> {
        utoipa::schema!(
            #[inline]
            String
        )
        .into()
    }
}

impl ToSchema for UserId {
    fn name() -> std::borrow::Cow<'static, str> {
        "UserId".into()
    }
}

/// This model represents a user entity inside the system
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize, ToSchema)]
pub struct User {
    /// The id of the user
    id: UserId,
    /// The username of the user
    pub username: Username,
    /// The email of the user.
    pub email: Email,
    /// The password of the user.
    #[serde(skip_serializing)]
    pub password: Password,
    /// The date and time the user was created.
    pub created_at: DateTime<Utc>,
    /// The date and time the user was last updated.
    pub updated_at: DateTime<Utc>,
}

impl User {
    /// Create a new user.
    pub fn new(
        id: UserId,
        username: Username,
        email: Email,
        password: Password,
        created_at: DateTime<Utc>,
    ) -> Self {
        Self {
            id,
            username,
            email,
            password,
            created_at,
            updated_at: created_at,
        }
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
            password.clone(),
            Utc::now(),
        );

        assert_eq!(user.id(), id);
        assert_eq!(user.username, username);
        assert_eq!(user.email, email);
        assert_eq!(user.password, password);
    }
}
