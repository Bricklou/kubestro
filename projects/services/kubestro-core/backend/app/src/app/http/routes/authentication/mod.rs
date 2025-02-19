use utoipa::OpenApi;
use utoipa_axum::{router::OpenApiRouter, routes};

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
    OpenApiRouter::with_openapi(ApiDoc::openapi())
        .routes(routes!(login::handler_login))
        .routes(routes!(register::handler_register))
        .routes(routes!(me::handler_me, logout::handler_logout))
        .routes(routes!(oidc::handler_oidc_redirect))
}
