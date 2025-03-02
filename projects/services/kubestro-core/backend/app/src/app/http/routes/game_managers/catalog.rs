use axum::{response::IntoResponse, Json};
use serde::Serialize;
use utoipa::ToSchema;

use crate::app::http::helpers::errors::ApiError;

use super::GAME_MANAGER_TAG;

/// Game Manager catalog response
#[derive(Serialize, ToSchema)]
pub(super) struct GameManagerCatalogResponse {
    packages: Vec<String>,
}

#[utoipa::path(
    method(get),
    path = "/api/v1.0/game-managers/catalog",
    summary = "Get game managers catalog",
    description = "Get the game managers catalog",
    tag = GAME_MANAGER_TAG,

    responses(
        (status = OK, description = "Game managers catalog", body = GameManagerCatalogResponse, example = json!({})),
    ),
)]
pub async fn handler_get_game_managers_catalog() -> Result<impl IntoResponse, ApiError> {
    Ok(Json(GameManagerCatalogResponse { packages: vec![] }))
}
