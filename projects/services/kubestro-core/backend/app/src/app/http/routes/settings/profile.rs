use std::collections::HashMap;

use axum::{Extension, Json};
use axum_session::Session;
use axum_session_redispool::SessionRedisPool;
use deserr::Deserr;
use kubestro_core_domain::models::{
    fields::{email::Email, username::Username},
    user::UserProvider,
};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use validator::Validate;

use crate::app::{
    context::AppContext,
    http::{
        dto::user_dto::UserDto,
        helpers::{errors::ApiError, validation::ValidatedJson},
        middlewares::auth::RequireAuth,
    },
};

use super::SETTINGS_TAG;

/// Profile update payload
#[derive(Deserialize, Deserr, ToSchema, Validate, Debug)]
pub(super) struct ProfileUpdatePayload {
    #[validate(length(min = 3, message = "Username must be at least 3 characters long"))]
    pub username: String,
    #[validate(email(message = "Invalid email address"))]
    pub email: String,
}

/// Profile update response
#[derive(Serialize, ToSchema)]
pub(super) struct ProfileUpdateResponse {
    user: UserDto,
}

#[utoipa::path(
    method(put),
    path = "/api/v1.0/settings/profile",
    summary = "Update profile",
    description = "Update the user profile",
    tag = SETTINGS_TAG,

    request_body(content = ProfileUpdatePayload, content_type = "application/json"),
    responses(
        (status = OK, description = "Profile updated", body = ProfileUpdateResponse, example = json!({
            "user": {
                "id": "1",
                "username": "user",
                "email": "admin@example.com",
                "created_at": "2021-08-01T00:00:00Z",
                "updated_at": "2021-08-01T00:00:00Z",
                "provider": "local"
            }
        })),
        (status = BAD_REQUEST, description = "Invalid input data", body = ApiError, example = json!({
            "status": 400,
            "title": "Validation error",
            "detail": "The request body is invalid",
            "code": "VALIDATION_ERROR",
            "error": "Failed to parse the request body as JSON: trailing comma at line 4 column 1"
        })),
        (status = UNAUTHORIZED, description = "User is not authenticated", body = ApiError, example = json!({
            "status": 401,
            "title": "Unauthorized",
            "detail": "User is not authenticated",
            "code": "UNAUTHORIZED",
            "error": "User is not authenticated"
        })),
        (status = FORBIDDEN, description = "User is not authenticated", body = ApiError, example = json!({
            "status": 403,
            "title": "Forbidden",
            "detail": "User is not authenticated",
            "code": "FORBIDDEN",
            "error": "User is not authenticated"
        })),
    )
)]
pub async fn handler_update_profile(
    Extension(ctx): Extension<AppContext>,
    session: Session<SessionRedisPool>,
    RequireAuth(user): RequireAuth,
    ValidatedJson(input): ValidatedJson<ProfileUpdatePayload>,
) -> Result<Json<ProfileUpdateResponse>, ApiError> {
    // Ensure the user isn't logged in through a provider
    if user.provider != UserProvider::Local {
        return Err(ApiError::forbidden(
            "External users cannot update their profile",
        ));
    }

    // Now that the user is properly authenticated, update the profile
    let new_username: Username = input.username.try_into()?;
    let new_email: Email = input.email.try_into()?;
    // Collect the errors
    let mut errors = HashMap::<String, serde_json::Value>::new();

    if user.username != new_username
        && ctx
            .user_repo
            .find_by_username(&new_username)
            .await?
            .is_some()
    {
        errors.insert(
            "username".to_string(),
            serde_json::Value::String("A user with the same username already exists".to_string()),
        );
    }

    if user.email != new_email && ctx.user_repo.find_by_email(&new_email).await?.is_some() {
        errors.insert(
            "email".to_string(),
            serde_json::Value::String("A user with the same email already exists".to_string()),
        );
    }

    // If there is any errors, return a validation error
    if !errors.is_empty() {
        return Err(ApiError::conflict(
            "A user with the same data already exists",
            "USER_DATA_ALREADY_EXISTS",
            errors,
        ));
    }

    let mut current_user = user;
    current_user.username = new_username;
    current_user.email = new_email;

    let user: UserDto = ctx.user_repo.update(current_user).await?.into();

    session.set("user", &user);

    Ok(Json(ProfileUpdateResponse { user }))
}
