use std::{borrow::Cow, collections::HashMap};

use axum::http::StatusCode;
use kubestro_core_domain::{
    models::fields::{email::EmailError, password::PasswordError, username::UsernameError},
    ports::{
        repositories::{
            repositories_repositories::RepositoryRepoError, user_repository::UserRepoError,
        },
        services::repositories_service::RepositoriesServiceError,
    },
    services::auth::local_auth::LocalAuthServiceError,
};
use serde::{Serialize, Serializer};

use crate::app::services::oidc_auth::OidcAuthServiceError;

use super::ApiError;

pub fn map_status_code<S: Serializer>(
    status: &StatusCode,
    serializer: S,
) -> Result<S::Ok, S::Error> {
    status.as_u16().serialize(serializer)
}

impl ApiError {
    pub fn unexpected_error(detail: impl ToString) -> Self {
        Self {
            status: StatusCode::INTERNAL_SERVER_ERROR,
            title: "Internal Server Error".into(),
            detail: Some(format!("Unexpected error: {}", detail.to_string()).into()),
            code: "internal_server_error".into(),
            ..Default::default()
        }
    }

    pub fn database_error(detail: impl ToString) -> Self {
        Self {
            status: StatusCode::INTERNAL_SERVER_ERROR,
            title: "Internal Server Error".into(),
            detail: Some(format!("Database error: {}", detail.to_string()).into()),
            code: "internal_server_error".into(),
            ..Default::default()
        }
    }

    pub fn unauthorized() -> Self {
        Self {
            status: StatusCode::UNAUTHORIZED,
            title: "Unauthorized".into(),
            detail: Some("Unauthorized".into()),
            code: "unauthorized".into(),
            ..Default::default()
        }
    }

    pub fn forbidden(detail: impl ToString) -> Self {
        Self {
            status: StatusCode::FORBIDDEN,
            title: "Forbidden".into(),
            detail: Some(detail.to_string().into()),
            code: "forbidden".into(),
            ..Default::default()
        }
    }

    #[allow(dead_code)]
    pub fn not_implemented(detail: impl ToString) -> Self {
        Self {
            status: StatusCode::NOT_IMPLEMENTED,
            title: "Not Implemented".into(),
            detail: Some(detail.to_string().into()),
            code: "not_implemented".into(),
            ..Default::default()
        }
    }

    pub fn not_found(detail: impl ToString) -> Self {
        Self {
            status: StatusCode::NOT_FOUND,
            title: "Not Found".into(),
            detail: Some(detail.to_string().into()),
            code: "not_found".into(),
            ..Default::default()
        }
    }

    pub fn conflict(
        detail: impl ToString,
        code: impl ToString,
        fields: HashMap<String, serde_json::Value>,
    ) -> Self {
        // Convert the fields into a { fields: {} } object
        let mut extensions = HashMap::new();
        extensions.insert(
            Cow::Borrowed("fields"),
            serde_json::Value::Object(fields.into_iter().collect()),
        );

        Self {
            status: StatusCode::CONFLICT,
            title: "Conflict".into(),
            detail: Some(detail.to_string().into()),
            code: code.to_string().into(),
            extensions,
            ..Default::default()
        }
    }
}

impl From<EmailError> for ApiError {
    fn from(value: EmailError) -> Self {
        ApiError {
            status: StatusCode::BAD_REQUEST,
            title: "Invalid email address".into(),
            detail: Some(value.to_string().into()),
            code: "INVALID_EMAIL".into(),
            ..Default::default()
        }
    }
}

impl From<UsernameError> for ApiError {
    fn from(value: UsernameError) -> Self {
        ApiError {
            status: StatusCode::BAD_REQUEST,
            title: "Invalid username".into(),
            detail: Some(value.to_string().into()),
            code: "INVALID_USERNAME".into(),
            ..Default::default()
        }
    }
}

impl From<LocalAuthServiceError> for ApiError {
    fn from(value: LocalAuthServiceError) -> Self {
        match value {
            LocalAuthServiceError::InvalidCredentials => ApiError {
                status: StatusCode::UNAUTHORIZED,
                title: "Invalid login/password".into(),
                detail: Some("Invalid login/password".into()),
                code: "UNAUTHORIZED".into(),
                ..Default::default()
            },
            LocalAuthServiceError::PasswordAuthNotAvailable => ApiError {
                detail: Some(value.to_string().into()),
                ..ApiError::unauthorized()
            },
            LocalAuthServiceError::PasswordError(e) => ApiError::forbidden(e),
            e => ApiError::unexpected_error(e),
        }
    }
}

impl From<PasswordError> for ApiError {
    fn from(value: PasswordError) -> Self {
        match value {
            PasswordError::Empty | PasswordError::InvalidPassword => ApiError {
                status: StatusCode::FORBIDDEN,
                title: "Invalid password".into(),
                detail: Some("Invalid password".into()),
                code: "INVALID_PASSWORD".into(),
                ..Default::default()
            },
            PasswordError::Hashing(e) => ApiError::unexpected_error(e.to_string()),
            PasswordError::Validation(e) => {
                let mut extensions = HashMap::<Cow<'static, str>, serde_json::Value>::new();
                extensions.insert("errors".into(), e.to_string().into());
                ApiError {
                    status: StatusCode::BAD_REQUEST,
                    title: "Invalid password".into(),
                    detail: Some("Password does not meet the requirements".into()),
                    code: "INVALID_PASSWORD".into(),
                    extensions,
                    ..Default::default()
                }
            }
        }
    }
}

impl From<UserRepoError> for ApiError {
    fn from(value: UserRepoError) -> Self {
        match value {
            UserRepoError::NotFound => ApiError::not_found("User not found"),
            UserRepoError::AlreadyExists => {
                ApiError::conflict("User already exists", "USER_ALREADY_EXISTS", HashMap::new())
            }
            UserRepoError::InvalidUser(e) => ApiError::unexpected_error(e),
            UserRepoError::DatabaseError(e) => ApiError::database_error(e),
            UserRepoError::UnexpectedError(e) => ApiError::unexpected_error(e),
        }
    }
}

impl From<OidcAuthServiceError> for ApiError {
    fn from(value: OidcAuthServiceError) -> Self {
        match value {
            OidcAuthServiceError::LoginFailed => ApiError::unauthorized(),
            OidcAuthServiceError::OidcClientError(e) => ApiError::unexpected_error(e.to_string()),
            e => e.into(),
        }
    }
}

impl From<RepositoryRepoError> for ApiError {
    fn from(value: RepositoryRepoError) -> Self {
        match value {
            RepositoryRepoError::DatabaseError(e) => ApiError::database_error(e),
            RepositoryRepoError::UnexpectedError(e) => ApiError::unexpected_error(e),
            RepositoryRepoError::AlreadyExists => ApiError::conflict(
                "This repository already exists",
                "REPO_ALREADY_EXISTS",
                HashMap::new(),
            ),
            RepositoryRepoError::NotFound => ApiError::not_found(value.to_string()),
        }
    }
}

impl From<RepositoriesServiceError> for ApiError {
    fn from(value: RepositoriesServiceError) -> Self {
        match value {
            RepositoriesServiceError::RepositoryError(e) => e.into(),
            // TODO: return the proper error code instead of internal server error
            RepositoriesServiceError::RemoteDataError(e) => ApiError::unexpected_error(e),
            RepositoriesServiceError::UnexpectedError(e) => ApiError::unexpected_error(e),
            RepositoriesServiceError::CachingError(e) => ApiError::unexpected_error(e),
        }
    }
}
