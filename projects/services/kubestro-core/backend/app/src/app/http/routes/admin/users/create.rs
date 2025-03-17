use axum::http::StatusCode;
use axum::response::IntoResponse;
use axum::Extension;
use deserr::Deserr;
use kubestro_core_domain::services::auth::local_auth::RegisterUserPayload;
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
pub(crate) struct CreateUserPayload {
    #[validate(email(message = "Invalid email address"))]
    pub email: String,

    #[validate(length(min = 8, message = "Password must be at least 8 characters long"))]
    pub password: String,

    #[validate(length(min = 3, message = "Username must be at least 3 characters long"))]
    pub username: String,

    pub status: UserStatusDto,
}

#[utoipa::path(
  method(post),
  path = "/api/v1.0/admin/users",
  summary = "Create user",
  tag = ADMIN_TAG,

  request_body(content = CreateUserPayload, content_type = "application/json"),

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
pub async fn handler_create_user(
    Extension(ctx): Extension<AppContext>,
    ValidatedJson(payload): ValidatedJson<CreateUserPayload>,
) -> Result<impl IntoResponse, ApiError> {
    debug!("Creating user...");

    let user_data = RegisterUserPayload {
        username: payload.username.try_into()?,
        email: payload.email.try_into()?,
        password: payload.password.into_boxed_str(),
    };

    let mut user = ctx.local_auth.register(user_data).await?;

    // Set the user status
    user.status = payload.status.into();

    // Save the user
    ctx.user_repo.update(user).await?;

    Ok(StatusCode::NO_CONTENT.into_response())
}
