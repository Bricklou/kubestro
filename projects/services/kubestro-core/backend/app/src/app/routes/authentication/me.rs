use axum::Json;
use axum_session::Session;
use axum_session_redispool::SessionRedisPool;
use serde::Serialize;
use utoipa::ToSchema;

use crate::app::{dto::user_dto::UserDto, utils::errors::ApiError};

use super::AUTHENTICATION_TAG;

#[derive(Serialize, ToSchema)]
pub struct MeResponse {
    user: UserDto,
}

#[utoipa::path(
    method(get),
    path = "/api/v1.0/authentication",
    summary = "Get current user",
    description = "Get the current user",
    tag = AUTHENTICATION_TAG
)]
pub async fn handler_me(session: Session<SessionRedisPool>) -> Result<Json<MeResponse>, ApiError> {
    session
        .get::<UserDto>("user")
        .ok_or(ApiError::unauthorized())
        .map(|user| Json(MeResponse { user }))
}
