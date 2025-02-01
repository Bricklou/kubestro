use crate::app::{
    utils::{errors::ApiError, validation::ValidatedJson},
    ApiContext,
};

use super::AUTHENTICATION_TAG;
use axum::{Extension, Json};
use deserr::Deserr;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use validator::Validate;

/// Login payload
#[derive(Deserialize, Deserr, ToSchema, Validate, Debug)]
pub(super) struct LoginPayload {
    #[validate(length(min = 3, message = "login must be at least 3 characters long"))]
    pub login: String,
    #[validate(length(min = 8, message = "password must be at least 8 characters long"))]
    password: String,
}

/// Login response
#[derive(Serialize, ToSchema)]
pub(super) struct LoginResponse {
    message: String,
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
    Extension(_context): Extension<ApiContext>,
    ValidatedJson(input): ValidatedJson<LoginPayload>,
) -> Result<Json<LoginResponse>, ApiError> {
    debug!("Login request: {:?}", input);
    Ok(Json(LoginResponse {
        message: "Login successful".to_string(),
    }))
}
