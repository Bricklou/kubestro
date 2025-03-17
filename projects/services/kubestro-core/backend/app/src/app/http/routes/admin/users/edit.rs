use std::collections::HashMap;

use axum::extract::Path;
use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Extension;
use deserr::Deserr;
use kubestro_core_domain::models::fields::email::Email;
use kubestro_core_domain::models::fields::username::Username;
use kubestro_core_domain::models::user::{UserId, UserProvider, UserStatus};
use serde::Deserialize;
use utoipa::ToSchema;
use validator::Validate;

use crate::app::http::dto::user_dto::UserStatusDto;
use crate::app::http::helpers::validation::ValidatedJson;
use crate::app::http::routes::admin::ADMIN_TAG;

use crate::app::context::AppContext;
use crate::app::http::helpers::errors::ApiError;

/// Create user payload
#[derive(Deserialize, Deserr, ToSchema, Validate, Debug)]
pub(crate) struct UpdateUserPayload {
    #[validate(email(message = "Invalid email address"))]
    pub email: String,

    #[validate(length(min = 8, message = "Password must be at least 8 characters long"))]
    pub password: String,

    #[validate(length(min = 3, message = "Username must be at least 3 characters long"))]
    pub username: String,

    pub status: UserStatusDto,
}

#[utoipa::path(
  method(put),
  path = "/api/v1.0/admin/users/{id}",
  summary = "Create user",
  tag = ADMIN_TAG,

  request_body(content = UpdateUserPayload, content_type = "application/json"),

  responses(
      (status = NO_CONTENT, description = "Success", content_type = "application/json"),
      (status = BAD_REQUEST, description = "Invalid input data", body = ApiError, example = json!({
          "status": 400,
          "title": "Validation error",
          "detail": "The request body is invalid",
          "code": "VALIDATION_ERROR",
          "error": "Failed to parse the request body as JSON: trailing comma at line 4 column 1"
      })),
      (status = CONFLICT, description = "User already exists", body = ApiError, example = json!({
          "status": 409,
          "title": "Conflict",
          "detail": "User already exists",
          "code": "CONFLICT"
      })),
  )
)]
pub async fn handler_edit_user(
    Extension(ctx): Extension<AppContext>,
    Path(user_id): Path<UserId>,
    ValidatedJson(payload): ValidatedJson<UpdateUserPayload>,
) -> Result<impl IntoResponse, ApiError> {
    debug!("Update user...");
    // Get the user by its id
    let user = ctx
        .user_repo
        .find_one(&user_id)
        .await?
        .ok_or_else(|| ApiError::not_found("User not found"))?;

    // Ensure the user isn't logged in through a provider
    if user.provider != UserProvider::Local {
        return Err(ApiError::forbidden(
            "External users cannot update their profile",
        ));
    }

    // Now that the user is properly fetched, update the data
    let new_username: Username = payload.username.try_into()?;
    let new_email: Email = payload.email.try_into()?;
    let new_status: UserStatus = payload.status.into();
    // Connect the errors
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
            serde_json::json!("Username already exists"),
        );
    }

    if user.email != new_email && ctx.user_repo.find_by_email(&new_email).await?.is_some() {
        errors.insert(
            "email".to_string(),
            serde_json::json!("Email already exists"),
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
    current_user.status = new_status;

    ctx.user_repo.update(current_user).await?;

    Ok(StatusCode::NO_CONTENT.into_response())
}
