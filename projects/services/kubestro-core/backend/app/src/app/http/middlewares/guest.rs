use axum::extract::FromRequestParts;
use axum_session::Session;
use axum_session_redispool::SessionRedisPool;

use crate::app::http::{dto::user_dto::UserDto, helpers::errors::ApiError};

// Add extractor that performs authentication check.
pub struct RequireGuest;

impl<S> FromRequestParts<S> for RequireGuest
where
    S: Send + Sync,
{
    type Rejection = ApiError;

    async fn from_request_parts(
        parts: &mut axum::http::request::Parts,
        _state: &S,
    ) -> Result<Self, Self::Rejection> {
        // Extract the session
        let Some(session) = parts.extensions.get::<Session<SessionRedisPool>>() else {
            return Ok(RequireGuest);
        };

        // Check if there is no user in the session
        if session.get::<UserDto>("user").is_some() {
            return Err(ApiError::unauthorized());
        }

        Ok(RequireGuest)
    }
}
