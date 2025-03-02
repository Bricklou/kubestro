use axum::{
    extract::{Path, Query},
    http::StatusCode,
    response::IntoResponse,
    Extension, Json,
};
use deserr::Deserr;
use serde::{Deserialize, Serialize};
use utoipa::{IntoParams, ToSchema};
use validator::Validate;

use crate::app::{
    context::AppContext,
    http::{
        dto::repositories_dto::RepositoryDto,
        helpers::{errors::ApiError, validation::ValidatedJson},
    },
};
use kubestro_core_domain::{
    models::package::{CreateRepository, RepositoryId},
    ports::repositories::repositories_repositories::RepositoriesRepository,
};

use super::GAME_MANAGER_TAG;

/// Repositories list response
#[derive(Serialize, ToSchema)]
pub(super) struct RepositoriesListResponse {
    repositories: Vec<RepositoryDto>,
}

/// Repositories list queries
#[derive(Deserialize, IntoParams)]
pub(super) struct RepositoriesListQueries {
    #[serde(default)]
    search: Option<String>,
}

/// Get managers repositories list
#[utoipa::path(
    method(get),
    path = "/api/v1.0/game-managers/repositories",
    summary = "Get managers repositories list",
    description = "Get the repositories list for game managers",
    tag = GAME_MANAGER_TAG,

    responses(
        (status = OK, description = "Game managers repositories list", body = RepositoriesListResponse, example = json!({
            "repositories": [
                {
                    "id": "321a07de-7717-49a8-9b28-a6858503bef3",
                    "name": "Demo",
                    "url": "https://example.com/repository",
                }
            ]
        })),
    ),
)]
pub async fn handler_get_repositories(
    Extension(ctx): Extension<AppContext>,
    Query(queries): Query<RepositoriesListQueries>,
) -> Result<impl IntoResponse, ApiError> {
    let repositories = ctx
        .repository_repo
        .find_all(queries.search)
        .await?
        .iter()
        .map(RepositoryDto::from)
        .collect();

    Ok(Json(RepositoriesListResponse { repositories }))
}

/// Add a new repository payload
#[derive(Deserialize, Deserr, Validate, ToSchema, Debug)]
pub(super) struct AddRepositoryPayload {
    #[validate(length(
        min = 3,
        message = "Repository name must be at least 3 characters long"
    ))]
    pub name: String,
    #[validate(url(message = "Invalid repository URL"))]
    pub url: String,
}

/// Add a new repository response
#[derive(Serialize, ToSchema)]
pub(super) struct AddRepositoryResponse {
    repository: RepositoryDto,
}

/// Add a new repository handler
#[utoipa::path(
    method(post),
    path = "/api/v1.0/game-managers/repositories",
    summary = "Add a new repository",
    description = "Add a new repository to the game managers list",
    tag = GAME_MANAGER_TAG,

    request_body(content = AddRepositoryPayload, content_type = "application/json"),
    responses(
        (status = CREATED, description = "Repository added", body = RepositoryDto, example = json!({
            "id": "1",
            "name": "repository",
            "url": "https://example.com/repository",
        })),

        (status = UNPROCESSABLE_ENTITY, description = "Invalid input data", body = ApiError, example = json!({
            "status": 422,
            "title": "Validation error",
            "detail": "The request body is invalid",
            "code": "VALIDATION_ERROR",
            "errors": {
                "#/url": {
                "code": "url",
                "detail": "Invalid repository URL"
                }
            }
        })),

        (status = CONFLICT, description = "Repository already exists", body = ApiError, example = json!({
            "status": 409,
            "title": "Conflict",
            "detail": "Repository already exists",
            "code": "CONFLICT"
        })),
    ),
)]
pub async fn handler_add_repository(
    Extension(ctx): Extension<AppContext>,
    ValidatedJson(payload): ValidatedJson<AddRepositoryPayload>,
) -> Result<impl IntoResponse, ApiError> {
    let repo_data = CreateRepository {
        name: payload.name,
        url: payload.url,
    };

    let repository: RepositoryDto = ctx.repository_repo.create(repo_data).await?.into();

    Ok((
        StatusCode::CREATED,
        Json(AddRepositoryResponse { repository }),
    ))
}

/// Delete a repository handler
#[utoipa::path(
    method(delete),
    path = "/api/v1.0/game-managers/repositories/{id}",
    summary = "Delete a repository",
    description = "Delete a repository from the game managers list",
    tag = GAME_MANAGER_TAG,

    params(
        ("id" = String, Path, description = "Repository database id")
    ),
    responses(
        (status = NO_CONTENT, description = "Repository deleted"),
    ),
)]
pub async fn handler_delete_repository(
    Extension(ctx): Extension<AppContext>,
    Path(id): Path<RepositoryId>,
) -> Result<impl IntoResponse, ApiError> {
    ctx.repository_repo.delete(&id).await?;

    Ok(StatusCode::NO_CONTENT)
}
