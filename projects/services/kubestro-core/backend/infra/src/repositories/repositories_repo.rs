use std::sync::Arc;

use kubestro_core_domain::{
    models::{
        package::{CreateRepository, Repository, RepositoryId},
        EntityId,
    },
    ports::repositories::repositories_repositories::{RepositoriesRepository, RepositoryRepoError},
};
use sea_orm::{
    sqlx, ActiveModelTrait, ActiveValue, ColumnTrait, DbErr, EntityTrait, ModelTrait, QueryFilter,
    RuntimeErr, TransactionTrait,
};
use tracing::trace;

use crate::entities::{self};

use super::db::DbProvider;

impl TryFrom<entities::repository::Model> for Repository {
    type Error = String;

    fn try_from(value: entities::repository::Model) -> Result<Self, Self::Error> {
        Ok(Repository {
            id: RepositoryId::from(value.id),
            name: value.name,
            url: value.url,
        })
    }
}

#[derive(Clone)]
pub struct RepositoriesPgRepo {
    db: Arc<DbProvider>,
}

impl RepositoriesPgRepo {
    pub fn new(db: Arc<DbProvider>) -> Self
    where
        Self: Sized,
    {
        Self { db }
    }
}

#[async_trait::async_trait]
impl RepositoriesRepository for RepositoriesPgRepo {
    #[tracing::instrument(skip(self))]
    async fn find_all(&self) -> Result<Vec<Repository>, RepositoryRepoError> {
        let query = entities::repository::Entity::find()
            .all(self.db.pool())
            .await;

        match query {
            Ok(repos) => {
                let repos = repos
                    .into_iter()
                    .map(Repository::try_from)
                    .collect::<Result<Vec<Repository>, String>>()
                    .map_err(|e| RepositoryRepoError::UnexpectedError(e.to_string()))?;
                Ok(repos)
            }
            Err(e) => Err(RepositoryRepoError::DatabaseError(e.to_string())),
        }
    }

    #[tracing::instrument(skip(self))]
    async fn find_one(&self, id: &RepositoryId) -> Result<Option<Repository>, RepositoryRepoError> {
        let query = entities::repository::Entity::find()
            .filter(entities::repository::Column::Id.eq(id.value()))
            .one(self.db.pool())
            .await;

        match query {
            Ok(repo) => {
                let repo = repo
                    .map(Repository::try_from)
                    .transpose()
                    .map_err(|e| RepositoryRepoError::UnexpectedError(e.to_string()))?;
                Ok(repo)
            }
            Err(e) => Err(RepositoryRepoError::DatabaseError(e.to_string())),
        }
    }

    #[tracing::instrument(skip(self))]
    async fn create(
        &self,
        repository_data: CreateRepository,
    ) -> Result<Repository, RepositoryRepoError> {
        let repository = entities::repository::ActiveModel {
            id: ActiveValue::Set(RepositoryId::new().value()),
            name: ActiveValue::Set(repository_data.name),
            url: ActiveValue::Set(repository_data.url),
        };

        repository
            .insert(self.db.pool())
            .await
            .map_err(|err| match err {
                DbErr::Query(RuntimeErr::SqlxError(sqlx::Error::Database(db_err))) => {
                    trace!("Database error: {:?}", db_err.to_string());
                    RepositoryRepoError::DatabaseError(db_err.to_string())
                }
                e => RepositoryRepoError::UnexpectedError(e.to_string()),
            })
            .and_then(|repo| {
                Repository::try_from(repo)
                    .map_err(|e| RepositoryRepoError::UnexpectedError(e.to_string()))
            })
    }

    #[tracing::instrument(skip(self))]
    async fn delete(&self, id: &RepositoryId) -> Result<(), RepositoryRepoError> {
        let txn = self
            .db
            .pool()
            .begin()
            .await
            .map_err(|e| RepositoryRepoError::DatabaseError(e.to_string()))?;

        let repo = entities::repository::Entity::find()
            .filter(entities::repository::Column::Id.eq(id.value()))
            .one(&txn)
            .await
            .map_err(|e| RepositoryRepoError::DatabaseError(e.to_string()))?;

        if let Some(repo) = repo {
            repo.delete(&txn)
                .await
                .map_err(|e| RepositoryRepoError::DatabaseError(e.to_string()))?;
        }

        txn.commit()
            .await
            .map_err(|e| RepositoryRepoError::DatabaseError(e.to_string()))?;

        Ok(())
    }
}
