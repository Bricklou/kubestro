use axum::{
    response::{IntoResponse, Redirect},
    Extension,
};
use axum_session::Session;
use axum_session_redispool::SessionRedisPool;
use openidconnect::{core::CoreResponseType, AuthenticationFlow, CsrfToken, Nonce, Scope};

use crate::app::{context::AppContext, http::helpers::errors::ApiError};

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
    let oidc_config = ctx
        .oidc_config
        .clone()
        .ok_or_else(|| ApiError::unexpected_error("OIDC configuration not found".to_string()))?;

    let client = oidc_config.client;

    let (authorize_url, csrf_state, nonce) = client
        .authorize_url(
            AuthenticationFlow::<CoreResponseType>::AuthorizationCode,
            CsrfToken::new_random,
            Nonce::new_random,
        )
        .add_scope(Scope::new("openid".to_string()))
        .add_scope(Scope::new("email".to_string()))
        .add_scope(Scope::new("profile".to_string()))
        .url();

    debug!("Redirecting to OIDC provider: {}", authorize_url);

    session.set("oidc_csrf", csrf_state.secret());
    session.set("oidc_nonce", nonce.secret());

    let resp = Redirect::to(authorize_url.as_str()).into_response();
    Ok(resp)
}
