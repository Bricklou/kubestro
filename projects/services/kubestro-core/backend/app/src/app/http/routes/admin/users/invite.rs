use std::collections::HashMap;

use axum::Extension;
use deserr::Deserr;
use kubestro_core_domain::models::fields::email::Email;
use serde::Deserialize;
use utoipa::ToSchema;
use validator::Validate;

use crate::app::{
    context::AppContext,
    http::{
        helpers::{errors::ApiError, validation::ValidatedJson},
        routes::admin::ADMIN_TAG,
    },
};

/// Create user payload
#[derive(Deserialize, Deserr, ToSchema, Validate, Debug)]
pub(crate) struct InviteUserPayload {
    #[validate(email(message = "Invalid email address"))]
    pub email: String,

    #[validate(length(max = 1000, message = "Password must be at least 8 characters long"))]
    #[deserr(default)]
    pub description: Option<String>,
}

#[utoipa::path(
  method(post),
  path = "/api/v1.0/admin/users/invite",
  summary = "Invite a user",
  tag = ADMIN_TAG,

  request_body(content = InviteUserPayload, content_type = "application/json"),

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
pub async fn handler_invite_user(
    Extension(ctx): Extension<AppContext>,
    ValidatedJson(payload): ValidatedJson<InviteUserPayload>,
) -> Result<(), ApiError> {
    debug!("Inviting user...");

    let email: Email = payload.email.try_into()?;

    // Check if the user already exists
    if ctx.user_repo.find_by_email(&email).await?.is_some() {
        return Err(ApiError::conflict(
            "User already exists",
            "The user with the provided email already exists",
            HashMap::new(),
        ));
    }

    // TODO: implement the user invitation logic

    Err(ApiError::not_implemented(
        "The user invitation logic is not implemented yet",
    ))
}
