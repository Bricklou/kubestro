use crate::{
    models::package::{CreateRepository, Repository, RepositoryId},
    ports::repositories::repositories_repositories::RepositoryRepoError,
};

#[async_trait::async_trait]
pub trait RepositoriesService: Send + Sync {
    /// Create a new repository, cache its remote information and return it
    async fn create(
        &self,
        repository: CreateRepository,
    ) -> Result<Repository, RepositoriesServiceError>;
    /// Delete a repository and remove its data from the cache
    async fn delete(&self, repository_id: &RepositoryId) -> Result<(), RepositoriesServiceError>;

    /// Update the cache for all repositories
    async fn update_cache(&self, force: bool) -> Result<(), RepositoriesServiceError>;
}

#[derive(Debug, thiserror::Error)]
pub enum RepositoriesServiceError {
    #[error(transparent)]
    RepositoryError(#[from] RepositoryRepoError),
    #[error("Failed to use cache: {0}")]
    CachingError(String),
    #[error("Failed to fetch remote data: {0}")]
    RemoteDataError(String),
    #[error("Unexpected error: {0}")]
    UnexpectedError(String),
}
