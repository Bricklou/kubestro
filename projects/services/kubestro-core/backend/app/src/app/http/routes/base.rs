use axum::{http::StatusCode, response::IntoResponse, Extension, Json};
use serde::Serialize;
use utoipa::{OpenApi, ToSchema};
use utoipa_axum::{router::OpenApiRouter, routes};

use crate::app::context::{AppContext, ServiceStatus};

pub(super) const BASE_TAG: &str = "base";

/// OpenAPI documentation
#[derive(OpenApi)]
#[openapi(
    tags(
        (name = BASE_TAG, description = "Base API endpoints")
    )
)]
struct ApiDoc;

/// Health response
#[derive(Serialize, ToSchema)]
struct StatusResponse {
    status: ServiceStatus,
}

/// Status check route
#[utoipa::path(
    method(get),
    path = "/status",
    tag = BASE_TAG,
    responses(
        (status = OK, description = "Success", body = StatusResponse, content_type = "application/json")
    )
)]
async fn handler_status(ctx: Extension<AppContext>) -> Json<StatusResponse> {
    let shared_state_lock = ctx.shared_state.read().await;
    let status = shared_state_lock.status.clone();

    Json(StatusResponse { status })
}

#[derive(Serialize)]
struct NotFoundResponse {
    message: String,
}

/// Fallback service for handling routes to unknown paths
async fn handler_404() -> impl IntoResponse {
    (
        StatusCode::NOT_FOUND,
        Json(NotFoundResponse {
            message: "Not Found".to_string(),
        }),
    )
}

pub fn get_routes() -> OpenApiRouter {
    OpenApiRouter::with_openapi(ApiDoc::openapi())
        // add status route
        .routes(routes!(handler_status))
        // add a fallback service for handling routes to unknown paths
        .fallback(handler_404)
}
