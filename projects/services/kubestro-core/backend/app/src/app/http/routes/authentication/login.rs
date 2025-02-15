use crate::app::{
    context::AppContext,
    http::{
        dto::user_dto::UserDto,
        helpers::{errors::ApiError, validation::ValidatedJson},
    },
};

use super::AUTHENTICATION_TAG;
use axum::{Extension, Json};
use axum_session::Session;
use axum_session_redispool::SessionRedisPool;
use deserr::Deserr;
use kubestro_core_domain::models::fields::email::Email;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use validator::Validate;

/// Login payload
#[derive(Deserialize, Deserr, ToSchema, Validate, Debug)]
pub(super) struct LoginPayload {
    #[validate(email(message = "Invalid email address"))]
    pub email: String,
    #[validate(length(min = 8, message = "Password must be at least 8 characters long"))]
    password: String,
}

/// Login response
#[derive(Serialize, ToSchema)]
pub(super) struct LoginResponse {
    user: UserDto,
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
            "user": {
                "id": "1",
                "email": "admin@example.com",
                "username" : "admin",
                "created_at": "2021-08-31T12:00:00Z",
                "updated_at": "2021-08-31T12:00:00Z",
            }
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
    Extension(ctx): Extension<AppContext>,
    session: Session<SessionRedisPool>,
    ValidatedJson(input): ValidatedJson<LoginPayload>,
) -> Result<Json<LoginResponse>, ApiError> {
    let email = Email::try_from(input.email.clone())?;

    let user: UserDto = ctx.local_auth.login(&email, &input.password).await?.into();

    session.renew();
    session.set("user", &user);

    Ok(Json(LoginResponse { user }))
}
