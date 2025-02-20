use axum::{
    extract::{FromRequestParts, Request},
    middleware::Next,
    response::{IntoResponse, Response},
};
use axum_session::Session;
use axum_session_redispool::SessionRedisPool;

use crate::app::http::{dto::user_dto::UserDto, helpers::errors::ApiError};

// Add extractor that performs authentication check.
#[derive(Debug, Clone)]
pub struct RequireAuth(pub UserDto);

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

        let Some(user) = session.get::<UserDto>("user") else {
            return Err(ApiError::unauthorized());
        };

        Ok(RequireAuth(user))
    }
}

pub async fn auth_middleware(request: Request, next: Next) -> Response {
    // Extract session from request parts
    let (mut parts, body) = request.into_parts();
    let require_auth = match RequireAuth::from_request_parts(&mut parts, &()).await {
        Ok(require_auth) => require_auth,
        Err(e) => return e.into_response(),
    };

    // Now you can use the session data
    let mut request = Request::from_parts(parts, body);
    request.extensions_mut().insert(require_auth);

    // Continue with the next middleware or handler
    next.run(request).await
}
