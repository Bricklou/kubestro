use chrono::{DateTime, Utc};
use deserr::Deserr;
use kubestro_core_domain::models::{
    pagination::{SortingFieldError, SortingFieldTrait},
    user::{User, UserProvider, UserStatus, UsersSortField},
    Entity, EntityId,
};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Clone, Debug, Serialize, Deserialize, ToSchema)]
pub struct UserDto {
    pub id: String,
    pub username: String,
    pub email: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub provider: UserProviderDto,
    pub status: UserStatusDto,
}

#[derive(Clone, Debug, Serialize, Deserialize, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum UserProviderDto {
    Local,
    Oidc,
}

impl From<UserProvider> for UserProviderDto {
    fn from(provider: UserProvider) -> Self {
        match provider {
            UserProvider::Local => UserProviderDto::Local,
            UserProvider::Oidc => UserProviderDto::Oidc,
        }
    }
}

impl From<UserProviderDto> for UserProvider {
    fn from(provider: UserProviderDto) -> Self {
        match provider {
            UserProviderDto::Local => UserProvider::Local,
            UserProviderDto::Oidc => UserProvider::Oidc,
        }
    }
}

impl From<&UserProvider> for UserProviderDto {
    fn from(provider: &UserProvider) -> Self {
        match provider {
            UserProvider::Local => UserProviderDto::Local,
            UserProvider::Oidc => UserProviderDto::Oidc,
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, Deserr, ToSchema)]
#[serde(rename_all = "snake_case")]
pub enum UserStatusDto {
    Active,
    Inactive,
    Invited,
    Suspended,
}

impl From<UserStatusDto> for UserStatus {
    fn from(status: UserStatusDto) -> Self {
        match status {
            UserStatusDto::Active => UserStatus::Active,
            UserStatusDto::Inactive => UserStatus::Inactive,
            UserStatusDto::Invited => UserStatus::Invited,
            UserStatusDto::Suspended => UserStatus::Suspended,
        }
    }
}

impl From<UserStatus> for UserStatusDto {
    fn from(status: UserStatus) -> Self {
        match status {
            UserStatus::Active => UserStatusDto::Active,
            UserStatus::Inactive => UserStatusDto::Inactive,
            UserStatus::Invited => UserStatusDto::Invited,
            UserStatus::Suspended => UserStatusDto::Suspended,
        }
    }
}

impl From<&UserStatus> for UserStatusDto {
    fn from(status: &UserStatus) -> Self {
        match status {
            UserStatus::Active => UserStatusDto::Active,
            UserStatus::Inactive => UserStatusDto::Inactive,
            UserStatus::Invited => UserStatusDto::Invited,
            UserStatus::Suspended => UserStatusDto::Suspended,
        }
    }
}

impl From<User> for UserDto {
    fn from(user: User) -> Self {
        Self {
            id: user.id().value().into(),
            username: user.username.to_string(),
            email: user.email.to_string(),
            created_at: user.created_at,
            updated_at: user.updated_at,
            provider: user.provider.into(),
            status: user.status.into(),
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
            provider: UserProviderDto::from(&user.provider),
            status: UserStatusDto::from(&user.status),
        }
    }
}

/// Users pagination sort fields
#[derive(Debug, Clone, PartialEq, Deserialize, ToSchema)]
pub enum UsersSortFieldDto {
    /// Sort by username
    Username,
    /// Sort by email
    Email,
    /// Sort by created_at
    CreatedAt,
    /// Sort by updated_at
    UpdatedAt,
    /// Sort by status
    Status,
    /// Sort by provider
    Provider,
}

impl From<UsersSortFieldDto> for UsersSortField {
    fn from(sort_field: UsersSortFieldDto) -> Self {
        match sort_field {
            UsersSortFieldDto::Username => UsersSortField::Username,
            UsersSortFieldDto::Email => UsersSortField::Email,
            UsersSortFieldDto::CreatedAt => UsersSortField::CreatedAt,
            UsersSortFieldDto::UpdatedAt => UsersSortField::UpdatedAt,
            UsersSortFieldDto::Status => UsersSortField::Status,
            UsersSortFieldDto::Provider => UsersSortField::Provider,
        }
    }
}

impl SortingFieldTrait for UsersSortFieldDto {
    fn from_str(field: &str) -> Result<Self, SortingFieldError>
    where
        Self: Sized,
    {
        match field {
            "username" => Ok(UsersSortFieldDto::Username),
            "email" => Ok(UsersSortFieldDto::Email),
            "created_at" => Ok(UsersSortFieldDto::CreatedAt),
            "updated_at" => Ok(UsersSortFieldDto::UpdatedAt),
            "status" => Ok(UsersSortFieldDto::Status),
            "provider" => Ok(UsersSortFieldDto::Provider),
            e => Err(SortingFieldError::InvalidSortingField(e.to_string())),
        }
    }
}
