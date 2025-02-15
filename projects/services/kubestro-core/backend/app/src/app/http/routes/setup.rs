use axum::Json;
use utoipa::OpenApi;
use utoipa_axum::{router::OpenApiRouter, routes};

use crate::app::http::middlewares::status::SetupLayer;

pub(super) const SETUP_TAG: &str = "setup";

#[derive(OpenApi)]
#[openapi(
    tags(
        (name = SETUP_TAG, description = "Setup API endpoints")
    )
)]
struct ApiDoc;

/// Setup application route
#[utoipa::path(
    method(head,post),
    path = "/api/v1.0/setup",
    tag = SETUP_TAG,
    responses(
        (status = OK, description = "Success", body = str, content_type = "application/json")
    )
    // responses(
        // (status = OK, description = "Success", body = Json<()>, content_type = "application/json"),
        // (status = INTERNAL_SERVER_ERROR, description = "Internal Server Error"),
        // (status = BAD_REQUEST, description = "Bad Request")
    // )
)]
async fn setup() -> Json<()> {
    Json(())
}

pub fn get_routes() -> OpenApiRouter {
    OpenApiRouter::with_openapi(ApiDoc::openapi())
        .routes(routes!(setup))
        .layer(SetupLayer::setup_not_needed())
}
