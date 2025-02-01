use axum::{response::IntoResponse, Json};
use serde::Serialize;
use utoipa::ToSchema;

use super::AUTHENTICATION_TAG;

#[derive(Serialize, ToSchema)]
pub struct MeResponse<T> {
    user: T,
}

#[utoipa::path(
    method(get),
    path = "/api/v1.0/authentication",
    summary = "Get current user",
    description = "Get the current user",
    tag = AUTHENTICATION_TAG
)]
pub async fn handler_me() -> impl IntoResponse {
    Json(MeResponse {
        user: "user".to_string(),
    })
}
