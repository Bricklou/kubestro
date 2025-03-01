use utoipa::OpenApi;
use utoipa_axum::{router::OpenApiRouter, routes};

mod profile;
mod security;

pub(super) const SETTINGS_TAG: &str = "settings";

#[derive(OpenApi)]
#[openapi(
    tags(
        (name = SETTINGS_TAG, description = "Settings API endpoints")
    )
)]
struct ApiDoc;

pub fn get_routes() -> OpenApiRouter {
    OpenApiRouter::with_openapi(ApiDoc::openapi())
        .routes(routes!(profile::handler_update_profile))
        .routes(routes!(security::handler_update_password))
}
