use std::sync::Arc;

use axum::{Extension, Json};
use deserr::Deserr;
use kubestro_core_domain::{
    models::user::User,
    services::auth::local_auth::{LocalAuthService, RegisterUserPayload},
};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use validator::Validate;

use crate::app::utils::{errors::ApiError, validation::ValidatedJson};

use super::AUTHENTICATION_TAG;

/// Register payload
#[derive(Deserialize, Deserr, ToSchema, Validate, Debug)]
pub(super) struct RegisterPayload {
    #[validate(length(min = 3, message = "Username must be at least 3 characters long"))]
    pub username: String,
    #[validate(email(message = "Invalid email address"))]
    pub email: String,
    #[validate(length(min = 8, message = "Password must be at least 8 characters long"))]
    password: String,
}

/// Register response
#[derive(Serialize, ToSchema)]
pub(super) struct RegisterResponse {
    user: User,
}

#[utoipa::path(
    method(post),
    path = "/api/v1.0/authentication/register",
    summary = "Register user",
    description = "Register a new user",
    tag = AUTHENTICATION_TAG,

    request_body(content = RegisterPayload, content_type = "application/json"),
    responses(
        (status = OK, description = "Registration successful", body = RegisterResponse, example = json!({
            "user": {
                "id": "1",
                "username": "user",
                "email": "admin@example.com",
                "created_at": "2021-08-01T00:00:00Z",
                "updated_at": "2021-08-01T00:00:00Z"
            }
        })),
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
pub async fn handler_register(
    Extension(local_auth): Extension<Arc<LocalAuthService>>,
    ValidatedJson(input): ValidatedJson<RegisterPayload>,
) -> Result<Json<RegisterResponse>, ApiError> {
    let user_data = RegisterUserPayload {
        username: input.username.try_into()?,
        email: input.email.try_into()?,
        password: input.password.into_boxed_str(),
    };

    let user = local_auth.register(user_data).await?;
    Ok(Json(RegisterResponse { user }))
}
