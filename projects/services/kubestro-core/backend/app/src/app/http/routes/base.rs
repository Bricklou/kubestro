use axum::{http::StatusCode, response::IntoResponse, Json};
use serde::Serialize;
use utoipa::ToSchema;
use utoipa_axum::{router::OpenApiRouter, routes};

/// Health response
#[derive(Serialize, ToSchema)]
struct HealthResponse {
    status: String,
}

/// Health check service
#[utoipa::path(
    method(get,head),
    path = "/health",
    responses(
        (status = OK, description = "Success", body = HealthResponse, content_type = "application/json")
    )
)]

async fn handler_health() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok".to_string(),
    })
}

#[derive(Serialize)]
struct NotFoundResponse {
    message: String,
}

/// Fallback service for handling routes to unknown paths
pub(super) async fn handler_404() -> impl IntoResponse {
    (
        StatusCode::NOT_FOUND,
        Json(NotFoundResponse {
            message: "Not Found".to_string(),
        }),
    )
}

pub fn register_routes(router: OpenApiRouter) -> OpenApiRouter {
    router
        // add health check service
        .routes(routes!(handler_health))
        // add a fallback service for handling routes to unknown paths
        .fallback(handler_404)
}
