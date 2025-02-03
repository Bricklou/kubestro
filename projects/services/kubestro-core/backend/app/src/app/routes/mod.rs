use axum::{
    extract::{MatchedPath, Request},
    http::StatusCode,
    response::IntoResponse,
    Extension, Json,
};
use serde::Serialize;
use tower::ServiceBuilder;
use tower_http::trace::{DefaultOnRequest, DefaultOnResponse, TraceLayer};
use tracing::Level;
use utoipa::{OpenApi, ToSchema};
use utoipa_axum::{router::OpenApiRouter, routes};
use utoipa_scalar::{Scalar, Servable};

use super::ApiContext;

mod authentication;

const API_VERSION: &str = concat!(env!("CARGO_PKG_VERSION"), " (", env!("GIT_HASH"), ")");
const API_TITLE: &str = "Kubestro Core API";
const API_DESCRIPTION: &str = "Kubestro Core API";

#[derive(OpenApi)]
#[openapi(
    info(version = API_VERSION, title = API_TITLE, description = API_DESCRIPTION),
)]
struct ApiDoc;

pub fn get_routes(context: ApiContext) -> axum::Router {
    let (routes, api) = OpenApiRouter::with_openapi(ApiDoc::openapi())
        // add health check service
        .routes(routes!(handler_health))
        // register authentication routes
        .merge(authentication::get_routes())
        // add a fallback service for handling routes to unknown paths
        .fallback(handler_404)
        // plug necessary context layer
        .layer(
            ServiceBuilder::new()
                .layer(Extension(context.user_repo))
                .layer(Extension(context.hasher))
                .layer(Extension(context.local_auth))
                .layer(
                    TraceLayer::new_for_http()
                        // Create our own span for the request and include the matched path. The matched
                        // path is useful for figuring out which handler the request was routed to.
                        .make_span_with(|req: &Request| {
                            let method = req.method();
                            let uri = req.uri();

                            // Axum automatically adds this extension
                            let matched_path = req
                                .extensions()
                                .get::<MatchedPath>()
                                .map(|matched_path| matched_path.as_str());

                            tracing::debug_span!("request", %method, %uri, matched_path)
                        })
                        // By default, `TraceLayer` will log 4xx and 5xx responses, but we're doing our
                        // specific logging of errors so disable that
                        .on_request(DefaultOnRequest::new().level(Level::DEBUG))
                        // By default, `TraceLayer` will log 5xx responses, but we're doing our specific
                        // logging of errors so disable that
                        .on_response(DefaultOnResponse::new().level(Level::INFO)),
                ),
        )
        .split_for_parts();

    routes.merge(Scalar::with_url("/docs", api))
}

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
async fn handler_404() -> impl IntoResponse {
    (
        StatusCode::NOT_FOUND,
        Json(NotFoundResponse {
            message: "Not Found".to_string(),
        }),
    )
}
