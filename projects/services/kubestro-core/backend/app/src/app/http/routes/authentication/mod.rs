use axum::middleware;
use utoipa::OpenApi;
use utoipa_axum::{router::OpenApiRouter, routes};

use crate::app::http::middlewares;

mod login;
mod logout;
mod me;
mod oidc;
mod register;

pub(super) const AUTHENTICATION_TAG: &str = "authentication";

#[derive(OpenApi)]
#[openapi(
    tags(
        (name = AUTHENTICATION_TAG, description = "Authentication API endpoints")
    )
)]
struct ApiDoc;

pub fn get_routes() -> OpenApiRouter {
    let guest_routes = OpenApiRouter::new()
        .routes(routes!(login::handler_login))
        .routes(routes!(register::handler_register))
        .routes(routes!(oidc::handler_oidc_redirect))
        .routes(routes!(oidc::handler_oidc_callback))
        .layer(middleware::from_fn(middlewares::guest::guest_middleware));

    let auth_routes = OpenApiRouter::new()
        .routes(routes!(me::handler_me, logout::handler_logout))
        .layer(middleware::from_fn(middlewares::auth::auth_middleware));

    OpenApiRouter::with_openapi(ApiDoc::openapi())
        .merge(guest_routes)
        .merge(auth_routes)
}
