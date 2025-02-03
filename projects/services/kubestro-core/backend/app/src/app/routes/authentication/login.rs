use std::sync::Arc;

use crate::app::utils::{errors::ApiError, validation::ValidatedJson};

use super::AUTHENTICATION_TAG;
use axum::{Extension, Json};
use deserr::Deserr;
use kubestro_core_domain::{
    models::{fields::email::Email, user::User},
    services::auth::local_auth::LocalAuthService,
};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use validator::Validate;

/// Login payload
#[derive(Deserialize, Deserr, ToSchema, Validate, Debug)]
pub(super) struct LoginPayload {
    #[validate(email(message = "Invalid email address"))]
    pub email: String,
    #[validate(length(min = 8, message = "Password must be at least 8 characters long"))]
    password: String,
}

/// Login response
#[derive(Serialize, ToSchema)]
pub(super) struct LoginResponse {
    user: User,
}

#[utoipa::path(
    method(post),
    path = "/api/v1.0/authentication",
    summary = "Authenticate user",
    description = "Authenticate a user using login/password credentials",
    tag = AUTHENTICATION_TAG,

    request_body(content = LoginPayload, content_type = "application/json"),
    responses(
        (status = OK, description = "Login successful", body = LoginResponse, example = json!({
            "message": "Login successful"
        })),
        (status = BAD_REQUEST, description = "Invalid input data", body = ApiError, example = json!({
            "status": 400,
            "title": "Validation error",
            "detail": "The request body is invalid",
            "code": "VALIDATION_ERROR",
            "error": "Failed to parse the request body as JSON: trailing comma at line 4 column 1"
        })),
        (status = UNAUTHORIZED, description = "Invalid login/password", body = ApiError, example = json!({
            "status": 401,
            "title": "Unauthorized",
            "detail": "Invalid login/password",
            "code": "UNAUTHORIZED"
        })),
    )
)]
pub async fn handler_login(
    Extension(local_auth): Extension<Arc<LocalAuthService>>,
    ValidatedJson(input): ValidatedJson<LoginPayload>,
) -> Result<Json<LoginResponse>, ApiError> {
    let email = Email::try_from(input.email.clone())?;

    let user = local_auth.login(&email, &input.password).await?;

    Ok(Json(LoginResponse { user }))
}
