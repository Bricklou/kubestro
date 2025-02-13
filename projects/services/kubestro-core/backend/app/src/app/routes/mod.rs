use anyhow::Context;
use axum::{
    extract::{MatchedPath, Request},
    Extension,
};
use axum_session::{SessionConfig, SessionLayer, SessionStore};
use axum_session_redispool::SessionRedisPool;
use tower::ServiceBuilder;
use tower_http::trace::{DefaultOnRequest, DefaultOnResponse, TraceLayer};
use tracing::Level;
use utoipa::OpenApi;
use utoipa_axum::router::OpenApiRouter;
use utoipa_scalar::{Scalar, Servable};

use super::ApiContext;

mod authentication;
mod base;

const API_VERSION: &str = concat!(env!("CARGO_PKG_VERSION"), " (", env!("GIT_HASH"), ")");
const API_TITLE: &str = "Kubestro Core API";
const API_DESCRIPTION: &str = "Kubestro Core API";

#[derive(OpenApi)]
#[openapi(
    info(version = API_VERSION, title = API_TITLE, description = API_DESCRIPTION),
)]
struct ApiDoc;

pub async fn get_routes(context: ApiContext) -> anyhow::Result<axum::Router> {
    let router = OpenApiRouter::with_openapi(ApiDoc::openapi());

    let router = base::register_routes(router);
    let router = router.merge(authentication::get_routes());

    let router = register_global_services(router, context.clone());
    let router = register_session_store(router, context).await?;

    let (routes, api) = router.split_for_parts();

    Ok(routes.merge(Scalar::with_url("/docs", api)))
}

fn register_global_services(router: OpenApiRouter, context: ApiContext) -> OpenApiRouter {
    router.layer(
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
}

async fn register_session_store(
    router: OpenApiRouter,
    context: ApiContext,
) -> anyhow::Result<OpenApiRouter> {
    // Session store
    let session_config = SessionConfig::default().with_table_name("session_table");
    let session_store =
        SessionStore::<SessionRedisPool>::new(Some(context.pool.clone().into()), session_config)
            .await
            .context("failed to create session store")?;

    Ok(router.layer(SessionLayer::new(session_store)))
}
