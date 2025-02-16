use axum::extract::FromRequestParts;
use axum_session::Session;
use axum_session_redispool::SessionRedisPool;

use crate::app::http::{dto::user_dto::UserDto, helpers::errors::ApiError};

// Add extractor that performs authentication check.
pub struct RequireAuth;

impl<S> FromRequestParts<S> for RequireAuth
where
    S: Send + Sync,
{
    type Rejection = ApiError;

    async fn from_request_parts(
        parts: &mut axum::http::request::Parts,
        _state: &S,
    ) -> Result<Self, Self::Rejection> {
        // Extract the session
        let session = parts
            .extensions
            .get::<Session<SessionRedisPool>>()
            .ok_or(ApiError::unauthorized())?;

        if session.get::<UserDto>("user").is_none() {
            return Err(ApiError::unauthorized());
        }

        Ok(RequireAuth)
    }
}
