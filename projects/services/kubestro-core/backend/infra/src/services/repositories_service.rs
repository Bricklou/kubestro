use std::sync::Arc;

use kubestro_core_domain::{
    models::package::{CreateRepository, Repository, RepositoryId},
    ports::{
        repositories::repositories_repositories::RepositoriesRepository,
        services::repositories_service::{RepositoriesService, RepositoriesServiceError},
    },
};
use serde_json;

use redis::AsyncCommands;
use redis_pool::SingleRedisPool;
use tokio::task::JoinSet;
use tracing::debug;

#[derive(Clone)]
pub struct InfraRepositoriesService {
    repositories_repository: Arc<dyn RepositoriesRepository>,
    cache_service: SingleRedisPool,
}

impl InfraRepositoriesService {
    pub fn new(
        repositories_repository: Arc<dyn RepositoriesRepository>,
        cache_service: SingleRedisPool,
    ) -> Self {
        Self {
            repositories_repository,
            cache_service,
        }
    }
}

const REPOSITORIES_CACHE_KEY: &str = "repositories_cache";

#[async_trait::async_trait]
impl RepositoriesService for InfraRepositoriesService {
    /// Create a new repository for managers
    ///
    /// This method proxy [`RepositoriesRepository::create`] and update the cache
    async fn create(
        &self,
        repository: CreateRepository,
    ) -> Result<Repository, RepositoriesServiceError> {
        let repository = self.repositories_repository.create(repository).await?;

        let self_clone = self.clone();
        let repository_clone = repository.clone();
        tokio::spawn(async move { self_clone.fetch_and_cache(repository_clone).await });

        Ok(repository)
    }

    /// Delete a repository by its id
    ///
    /// This method proxy [`RepositoriesRepository::delete`] and update the cache
    async fn delete(&self, repository_id: &RepositoryId) -> Result<(), RepositoriesServiceError> {
        self.repositories_repository.delete(repository_id).await?;

        let self_clone = self.clone();
        let repository_id = repository_id.clone();
        tokio::spawn(async move { self_clone.remove_cached_data(repository_id).await });

        Ok(())
    }

    /// Update repositories cache
    ///
    /// This method will fetch all the repositories remote data and cache them into
    /// a KV-store (a Redis pool here).
    async fn update_cache(&self, force: bool) -> Result<(), RepositoriesServiceError> {
        // Retrieve all repositories
        let repositories = self.repositories_repository.find_all(None).await?;

        // For each repository, fetch the remote data and cache it
        // This process is ran in parallel using tokio
        let mut join_set = JoinSet::new();

        for repository in repositories {
            let service_clone = self.clone();
            let repository = repository.clone();
            join_set.spawn(async move {
                // Check if the repository is already cached
                if !force && service_clone.check_if_cached(&repository.id).await? {
                    return Ok(());
                }
                service_clone.fetch_and_cache(repository).await
            });
        }

        join_set
            .join_all()
            .await
            .into_iter()
            .collect::<Result<Vec<_>, _>>()?;

        Ok(())
    }
}

impl InfraRepositoriesService {
    #[tracing::instrument(skip(self))]
    async fn check_if_cached(
        &self,
        repository_id: &RepositoryId,
    ) -> Result<bool, RepositoriesServiceError> {
        // Get redis pool connection
        let mut con = self
            .cache_service
            .acquire()
            .await
            .map_err(|e| RepositoriesServiceError::CachingError(e.to_string()))?;

        let key = format!("{}:{}", REPOSITORIES_CACHE_KEY, repository_id);

        // Check if the hashmap exists
        let exists: u32 = con
            .exists(key)
            .await
            .map_err(|e| RepositoriesServiceError::CachingError(e.to_string()))?;

        Ok(exists == 1)
    }

    #[tracing::instrument(skip(self))]
    async fn fetch_and_cache(
        &self,
        repository: Repository,
    ) -> Result<(), RepositoriesServiceError> {
        // Fetch the remote data
        let repo_data = self.fetch_remote_data(&repository).await?;
        // Cache the remote data
        self.cache_remote_data(&repository.id, repo_data).await?;

        Ok(())
    }

    #[tracing::instrument(skip(self))]
    async fn fetch_remote_data(
        &self,
        repository: &Repository,
    ) -> Result<serde_json::Value, RepositoriesServiceError> {
        // Fetch the remote data
        let data = reqwest::get(&repository.url)
            .await
            .map_err(|e| RepositoriesServiceError::RemoteDataError(e.to_string()))?
            .json::<serde_json::Value>()
            .await
            .map_err(|e| RepositoriesServiceError::RemoteDataError(e.to_string()))?;

        debug!(
            "Fetched remote data for repository {}: {}",
            repository.id, data
        );

        Ok(data)
    }

    #[tracing::instrument(skip(self))]
    async fn cache_remote_data(
        &self,
        repository_id: &RepositoryId,
        repo_data: serde_json::Value,
    ) -> Result<(), RepositoriesServiceError> {
        // Get redis pool connection
        let mut con = self
            .cache_service
            .acquire()
            .await
            .map_err(|e| RepositoriesServiceError::CachingError(e.to_string()))?;

        // Check if the hashmap exists, if not create it
        let stringified_data = serde_json::to_string(&repo_data)
            .map_err(|e| RepositoriesServiceError::CachingError(e.to_string()))?;

        let key = format!("{}:{}", REPOSITORIES_CACHE_KEY, repository_id);

        let _: () = redis::pipe()
            .atomic()
            .set(&key, stringified_data)
            .expire(key, 3600)
            .ignore()
            .query_async(&mut con)
            .await
            .map_err(|e| RepositoriesServiceError::CachingError(e.to_string()))?;

        // Cache the remote data
        Ok(())
    }

    #[tracing::instrument(skip(self))]
    async fn remove_cached_data(
        &self,
        repository: RepositoryId,
    ) -> Result<(), RepositoriesServiceError> {
        // Get redis pool connection
        let mut con = self
            .cache_service
            .acquire()
            .await
            .map_err(|e| RepositoriesServiceError::CachingError(e.to_string()))?;

        let key = format!("{}:{}", REPOSITORIES_CACHE_KEY, repository);

        // Remove the cached data
        let _: () = redis::pipe()
            .atomic()
            .del(key)
            .ignore()
            .query_async(&mut con)
            .await
            .map_err(|e| RepositoriesServiceError::CachingError(e.to_string()))?;

        Ok(())
    }
}
