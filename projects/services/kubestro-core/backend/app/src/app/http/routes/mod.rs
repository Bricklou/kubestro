use anyhow::Context;
use axum::{
    extract::{MatchedPath, Request},
    middleware, Extension,
};
use axum_session::{SessionConfig, SessionLayer, SessionStore};
use axum_session_redispool::SessionRedisPool;
use tower::ServiceBuilder;
use tower_http::trace::{DefaultOnRequest, DefaultOnResponse, TraceLayer};
use tracing::Level;
use utoipa::OpenApi;
use utoipa_axum::router::OpenApiRouter;
use utoipa_scalar::{Scalar, Servable};

use crate::app::context::AppContext;

use super::middlewares::{self, status::SetupLayer};

mod authentication;
mod base;
mod game_managers;
mod settings;
mod setup;

const API_VERSION: &str = concat!(env!("CARGO_PKG_VERSION"), " (", env!("GIT_HASH"), ")");
const API_TITLE: &str = "Kubestro Core API";
const API_DESCRIPTION: &str = "Kubestro Core API";

#[derive(OpenApi)]
#[openapi(
    info(version = API_VERSION, title = API_TITLE, description = API_DESCRIPTION),
)]
struct ApiDoc;

pub async fn get_routes(context: AppContext) -> anyhow::Result<axum::Router> {
    // This router is only accessible is the user is authenticated
    let router_with_auth = OpenApiRouter::new()
        .merge(settings::get_routes())
        .merge(game_managers::get_routes())
        .layer(middleware::from_fn(middlewares::auth::auth_middleware));

    // This router is only accessible if the setup is done
    let router_with_setup = OpenApiRouter::new()
        .merge(authentication::get_routes())
        .merge(router_with_auth)
        .layer(SetupLayer::setup_needed());

    // This is all the routes of the application
    let router = OpenApiRouter::with_openapi(ApiDoc::openapi())
        .merge(base::get_routes())
        .merge(setup::get_routes())
        .merge(router_with_setup);

    let router = register_global_services(router, context.clone());
    let router = register_session_store(router, context).await?;

    let (routes, api) = router.split_for_parts();

    Ok(routes.merge(Scalar::with_url("/docs", api)))
}

fn register_global_services(router: OpenApiRouter, context: AppContext) -> OpenApiRouter {
    router.layer(
        ServiceBuilder::new().layer(Extension(context)).layer(
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
}

async fn register_session_store(
    router: OpenApiRouter,
    context: AppContext,
) -> anyhow::Result<OpenApiRouter> {
    // Session store
    let session_config = SessionConfig::default().with_table_name("session_table");
    let session_store = SessionStore::<SessionRedisPool>::new(
        Some(context.cache_pool.clone().into()),
        session_config,
    )
    .await
    .context("failed to create session store")?;

    Ok(router.layer(SessionLayer::new(session_store)))
}
