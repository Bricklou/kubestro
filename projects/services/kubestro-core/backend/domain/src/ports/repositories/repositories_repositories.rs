use crate::models::package::{CreateRepository, Repository, RepositoryId};

#[cfg_attr(test, mockall::automock)]
#[async_trait::async_trait]
pub trait RepositoriesRepository: Send + Sync {
    async fn find_all(
        &self,
        search: Option<String>,
    ) -> Result<Vec<Repository>, RepositoryRepoError>;
    async fn find_one(&self, id: &RepositoryId) -> Result<Option<Repository>, RepositoryRepoError>;
    async fn create(&self, repository: CreateRepository)
        -> Result<Repository, RepositoryRepoError>;
    async fn delete(&self, repository_id: &RepositoryId) -> Result<(), RepositoryRepoError>;
}

#[derive(Debug, thiserror::Error)]
pub enum RepositoryRepoError {
    #[error("Database error: {0}")]
    DatabaseError(String),
    #[error("Unexpected error: {0}")]
    UnexpectedError(String),
    #[error("This repository already exists")]
    AlreadyExists,
    #[error("This repository does not exist")]
    NotFound,
}
