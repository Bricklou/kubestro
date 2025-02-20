use axum::{
    extract::Request,
    middleware::Next,
    response::{IntoResponse, Response},
};
use axum_session::Session;
use axum_session_redispool::SessionRedisPool;

use crate::app::http::{dto::user_dto::UserDto, helpers::errors::ApiError};

pub async fn guest_middleware(request: Request, next: Next) -> Response {
    // Extract session from request parts
    let (parts, body) = request.into_parts();

    if let Some(session) = &parts.extensions.get::<Session<SessionRedisPool>>() {
        // Check for the presence of a user data in the session
        if session.get::<UserDto>("user").is_some() {
            return ApiError::unauthorized().into_response();
        }
    }

    // If there is no session, continue
    let request = Request::from_parts(parts, body);
    next.run(request).await
}
