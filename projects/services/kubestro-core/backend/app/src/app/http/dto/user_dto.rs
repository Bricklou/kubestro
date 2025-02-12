use chrono::{DateTime, Utc};
use kubestro_core_domain::models::{user::User, Entity, EntityId};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Clone, Debug, Serialize, Deserialize, ToSchema)]
pub struct UserDto {
    pub id: String,
    pub username: String,
    pub email: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl From<User> for UserDto {
    fn from(user: User) -> Self {
        Self {
            id: user.id().value().into(),
            username: user.username.to_string(),
            email: user.email.to_string(),
            created_at: user.created_at,
            updated_at: user.updated_at,
        }
    }
}

impl From<&User> for UserDto {
    fn from(user: &User) -> Self {
        Self {
            id: user.id().value().into(),
            username: user.username.to_string(),
            email: user.email.to_string(),
            created_at: user.created_at,
            updated_at: user.updated_at,
        }
    }
}
