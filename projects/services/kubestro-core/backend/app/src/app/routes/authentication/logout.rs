use axum::{http::StatusCode, response::IntoResponse};

use super::AUTHENTICATION_TAG;

#[utoipa::path(
    method(delete),
    path = "/api/v1.0/authentication",
    summary = "Logout user",
    description = "Logout the current user",
    tag = AUTHENTICATION_TAG
)]
pub async fn handler_logout() -> impl IntoResponse {
    (StatusCode::OK, "Logout successful".to_string())
}
