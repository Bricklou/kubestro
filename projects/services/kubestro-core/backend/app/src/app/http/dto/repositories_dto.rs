use kubestro_core_domain::models::{package::Repository, Entity};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Clone, Debug, Serialize, Deserialize, ToSchema)]
pub struct RepositoryDto {
    pub id: String,
    pub name: String,
    pub url: String,
}

impl From<Repository> for RepositoryDto {
    fn from(repository: Repository) -> Self {
        Self {
            id: repository.id().to_string(),
            name: repository.name.to_string(),
            url: repository.url.to_string(),
        }
    }
}

impl From<&Repository> for RepositoryDto {
    fn from(repository: &Repository) -> Self {
        Self {
            id: repository.id().to_string(),
            name: repository.name.to_string(),
            url: repository.url.to_string(),
        }
    }
}
