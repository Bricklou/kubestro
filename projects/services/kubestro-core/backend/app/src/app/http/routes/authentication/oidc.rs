use axum::{
    extract::Query,
    response::{IntoResponse, Redirect},
    Extension, Json,
};
use axum_session::Session;
use axum_session_redispool::SessionRedisPool;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};

use crate::app::{
    context::AppContext,
    http::{dto::user_dto::UserDto, helpers::errors::ApiError},
};

use super::AUTHENTICATION_TAG;

/// OIDC redirect route
#[utoipa::path(
    method(get),
    path = "/api/v1.0/authentication/redirect",
    tag = AUTHENTICATION_TAG,
    responses(
        (status = PERMANENT_REDIRECT, description = "Redirect to OIDC provider")
    )
)]
pub async fn handler_oidc_redirect(
    ctx: Extension<AppContext>,
    session: Session<SessionRedisPool>,
) -> Result<impl IntoResponse, ApiError> {
    let oidc_auth = ctx
        .oidc_auth
        .clone()
        .ok_or_else(|| ApiError::unexpected_error("OIDC auth not found".to_string()))?;

    let (authorize_url, csrf_state, nonce) = oidc_auth.get_client().authorize_url();

    debug!("Redirecting to OIDC provider: {}", authorize_url);

    session.set("oidc_csrf_state", csrf_state.secret());
    session.set("oidc_nonce", nonce.secret());

    let resp = Redirect::to(authorize_url.as_str()).into_response();
    Ok(resp)
}

#[derive(Deserialize, IntoParams)]
pub(crate) struct OidcCallbackParams {
    code: String,
    state: String,
}

/// Login response
#[derive(Serialize, ToSchema)]
pub(super) struct LoginResponse {
    user: UserDto,
}

/// OIDC callback route
#[utoipa::path(
    method(get),
    path = "/api/v1.0/authentication/callback",
    tag = AUTHENTICATION_TAG,
    params(OidcCallbackParams),
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
        (status = UNAUTHORIZED, description = "Invalid login/password", body = ApiError, example = json!({
            "status": 401,
            "title": "Unauthorized",
            "detail": "Invalid login/password",
            "code": "UNAUTHORIZED"
        })),
    )
)]
pub async fn handler_oidc_callback(
    ctx: Extension<AppContext>,
    session: Session<SessionRedisPool>,
    params: Query<OidcCallbackParams>,
) -> Result<impl IntoResponse, ApiError> {
    let params = params.0;

    let code = params.code.clone();
    let state = params.state.clone();

    let Some(csrf_state) = session.get::<String>("oidc_csrf_state") else {
        return Err(ApiError::unexpected_error(
            "CSRF state not found".to_string(),
        ));
    };
    let Some(nonce) = session.get::<String>("oidc_nonce") else {
        return Err(ApiError::unexpected_error("Nonce not found".to_string()));
    };

    if state != csrf_state {
        return Err(ApiError::unexpected_error("Invalid CSRF state".to_string()));
    }

    let oidc_auth = ctx
        .oidc_auth
        .clone()
        .ok_or_else(|| ApiError::unexpected_error("OIDC configuration not found".to_string()))?;

    let user: UserDto = oidc_auth.login_or_create(code, nonce).await?.into();

    session.renew();
    session.set("user", &user);

    Ok(Json(LoginResponse { user }))
}
