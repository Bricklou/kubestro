use axum::{http::StatusCode, response::IntoResponse};
use axum_session::Session;
use axum_session_redispool::SessionRedisPool;
use serde::Serialize;
use utoipa::ToSchema;

use super::AUTHENTICATION_TAG;

/// Logout response
#[derive(Serialize, ToSchema)]
pub(super) struct LogoutResponse {
    message: String,
}

#[utoipa::path(
    method(delete),
    path = "/api/v1.0/authentication",
    summary = "Logout user",
    description = "Logout the current user",
    tag = AUTHENTICATION_TAG,

    responses(
        (status = OK, description = "Logout successful", body = LogoutResponse, example = json!({
            "message": "Logout successful"
        })),
    ),
)]
pub async fn handler_logout(session: Session<SessionRedisPool>) -> impl IntoResponse {
    session.destroy();
    (StatusCode::OK, "Logout successful".to_string())
}
