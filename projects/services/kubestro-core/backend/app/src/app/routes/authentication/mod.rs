use utoipa::OpenApi;
use utoipa_axum::{router::OpenApiRouter, routes};

mod login;
mod logout;
mod me;

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
        .routes(routes!(login::handler_login, logout::handler_logout))
        .routes(routes!(me::handler_me))
}
