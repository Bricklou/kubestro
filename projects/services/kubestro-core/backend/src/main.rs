use std::time::Duration;

use axum::{
    extract::{MatchedPath, Request},
    http::StatusCode,
    response::IntoResponse,
    routing::get,
    Json, Router,
};
use serde::Serialize;
use tokio::{net::TcpListener, signal};
use tower_http::{
    timeout::TimeoutLayer,
    trace::{self, TraceLayer},
};
use tracing::info_span;
use tracing::Level;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    // This returns an error if the `.env` file doesn't exist, but that's not what we want
    // since we're not going to use a `.env` file if we deploy this application.
    dotenvy::dotenv().ok();

    // Initialize the logger
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                format!("{}=debug,tower_http=debug", env!("CARGO_CRATE_NAME")).into()
            }),
        )
        .with(tracing_subscriber::fmt::layer().with_target(false).json())
        .init();

    // build our application with a route
    let app = Router::new()
        .route("/", get(handler))
        .layer((
            // TraceLayer::new_for_http()
            // Create our own span for the request and include the matched path. The matched
            // path is useful for figuring out which handler the request was routed to.
            TraceLayer::new_for_http()
                // Create our own span for the request and include the matched path. The matched
                // path is useful for figuring out which handler the request was routed to.
                .make_span_with(|req: &Request| {
                    let method = req.method();
                    let uri = req.uri();

                    // axum automatically adds this extension
                    let matched_path = req
                        .extensions()
                        .get::<MatchedPath>()
                        .map(|matched_path| matched_path.as_str());

                    tracing::debug_span!("request", %method, %uri, matched_path)
                })
                .on_response(trace::DefaultOnResponse::new().level(Level::INFO)), // By default `TraceLayer` will log 5xx responses but we're doing our specific
            // logging of errors so disable that
            TimeoutLayer::new(Duration::from_secs(10)),
        ))
        // add a fallback service for handling routes to unknown paths
        .fallback(handler_404);

    // run it
    let listener = TcpListener::bind("127.0.0.1:3000").await.unwrap();
    tracing::debug!("Listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app)
        .with_graceful_shutdown(shutdown_signal())
        .await
        .unwrap();
}

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install CTRL+C signal handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _=  terminate => {},
    }
}

#[derive(Debug, Serialize)]
pub struct MyData {
    name: String,
}

async fn handler() -> Json<MyData> {
    Json(MyData {
        name: "Hello, World!".to_string(),
    })
}

async fn handler_404() -> impl IntoResponse {
    (StatusCode::NOT_FOUND, "Not Found")
}
