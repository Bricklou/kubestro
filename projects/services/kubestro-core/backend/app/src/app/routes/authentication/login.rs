use crate::app::{utils::validation::ValidatedJson, ApiContext};

use super::AUTHENTICATION_TAG;
use axum::{response::IntoResponse, Extension, Json};
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
struct LoginResponse {
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
        (status = OK, description = "Login successful", body = LoginResponse),
        (status = BAD_REQUEST, description = "Invalid input data", body = str),
        (status = UNAUTHORIZED, description = "Invalid login/password", body = str),
    )
)]
pub async fn handler_login(
    // Extension(_context): Extension<ApiContext>,
    ValidatedJson(input): ValidatedJson<LoginPayload>,
) -> impl IntoResponse {
    debug!("Login request: {:?}", input);
    Json(LoginResponse {
        message: "Login successful".to_string(),
    })
}
