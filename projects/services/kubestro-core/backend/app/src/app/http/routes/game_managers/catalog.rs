use axum::{response::IntoResponse, Extension, Json};
use serde::Serialize;
use utoipa::ToSchema;

use crate::app::{
    context::AppContext,
    http::{
        dto::{package_dto::PackageDto, repositories_dto::RepositoryDto},
        helpers::errors::ApiError,
    },
};
use kubestro_core_domain::ports::repositories::repositories_repositories::RepositoriesRepository;

use super::GAME_MANAGER_TAG;

#[derive(Debug, Serialize, ToSchema)]
struct RepositoryWithPackages {
    #[serde(flatten)]
    repository: RepositoryDto,
    packages: Vec<PackageDto>,
}

/// Game Manager catalog response
#[derive(Serialize, ToSchema)]
pub(super) struct GameManagerCatalogResponse {
    packages: Vec<RepositoryWithPackages>,
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
pub async fn handler_get_game_managers_catalog(
    Extension(ctx): Extension<AppContext>,
) -> Result<impl IntoResponse, ApiError> {
    let repositories = ctx.repository_repo.find_all(None).await?;

    let packages: Vec<RepositoryWithPackages> = repositories
        .into_iter()
        .map(|repository| RepositoryWithPackages {
            repository: repository.into(),
            packages: vec![],
        })
        .filter(|repository| !repository.packages.is_empty())
        .collect();

    Ok(Json(GameManagerCatalogResponse { packages }))
}
