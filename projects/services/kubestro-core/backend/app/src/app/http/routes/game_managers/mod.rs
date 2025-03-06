use utoipa::OpenApi;
use utoipa_axum::{router::OpenApiRouter, routes};

mod catalog;
mod repositories;

pub(super) const GAME_MANAGER_TAG: &str = "game-managers";

#[derive(OpenApi)]
#[openapi(
    tags(
        (name = GAME_MANAGER_TAG, description = "Game Manager API endpoints")
    )
)]
struct ApiDoc;

pub fn get_routes() -> OpenApiRouter {
    let repositories_routes = OpenApiRouter::new().routes(routes!(
        repositories::handler_get_repositories,
        repositories::handler_add_repository,
        repositories::handler_delete_repository,
    ));

    let catalog_routes =
        OpenApiRouter::new().routes(routes!(catalog::handler_get_game_managers_catalog));

    OpenApiRouter::with_openapi(ApiDoc::openapi())
        .merge(repositories_routes)
        .merge(catalog_routes)
}
