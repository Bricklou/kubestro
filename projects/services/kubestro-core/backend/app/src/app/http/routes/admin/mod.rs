use utoipa::OpenApi;
use utoipa_axum::{router::OpenApiRouter, routes};

mod users;

pub(super) const ADMIN_TAG: &str = "admin";

#[derive(OpenApi)]
#[openapi(
    tags(
        (name = ADMIN_TAG, description = "Admin API endpoints")
    )
)]
struct ApiDoc;

pub fn get_routes() -> OpenApiRouter {
    OpenApiRouter::with_openapi(ApiDoc::openapi()).routes(routes!(users::handler_get_users))
}
