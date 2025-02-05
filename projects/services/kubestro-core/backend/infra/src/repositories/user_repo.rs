use std::sync::Arc;

use chrono::{DateTime, Utc};
use kubestro_core_domain::{
    models::{
        create_user::CreateUser,
        fields::{
            email::{Email, EmailError},
            password::{Password, PasswordError},
            username::{Username, UsernameError},
        },
        user::{User, UserId},
        Entity, EntityId,
    },
    ports::repositories::user_repository::{
        UserCreateRepoError, UserDeleteRepoError, UserFindRepoError, UserRepository,
        UserUpdateRepoError,
    },
};
use sea_orm::{
    prelude::async_trait, sqlx, ActiveModelTrait, ActiveValue, ColumnTrait, DbErr, EntityTrait,
    QueryFilter, RuntimeErr,
};
use tracing::trace;

use crate::entities;

use super::db::DbProvider;

#[derive(Debug, thiserror::Error)]
pub enum UserError {
    #[error("Invalid username: {0}")]
    InvalidUsername(#[from] UsernameError),
    #[error("Invalid email: {0}")]
    InvalidEmail(#[from] EmailError),
    #[error("Invalid password: {0}")]
    InvalidPassword(#[from] PasswordError),
    #[error("Unexpected error: {0}")]
    UnexpectedError(String),
}

impl TryFrom<User> for entities::user::ActiveModel {
    type Error = UserError;

    fn try_from(value: User) -> Result<Self, Self::Error> {
        Ok(entities::user::ActiveModel {
            id: ActiveValue::Set(value.id().value()),
            username: ActiveValue::Set(value.username.to_string()),
            email: ActiveValue::Set(value.email.to_string()),
            password: ActiveValue::Set(value.password.to_string()),
            created_at: ActiveValue::Set(value.created_at.into()),
            updated_at: ActiveValue::Set(value.updated_at.into()),
        })
    }
}

impl TryFrom<entities::user::Model> for User {
    type Error = UserError;

    fn try_from(value: entities::user::Model) -> Result<Self, Self::Error> {
        let id = UserId::from(value.id);
        let username = Username::try_from(value.username)?;
        let email = Email::try_from(value.email)?;
        let password = Password::from_hash(value.password);
        let created_at: DateTime<Utc> = value.created_at.into();

        Ok(User::new(id, username, email, password, created_at))
    }
}

#[derive(Clone)]
pub struct UserPgRepo {
    db: Arc<DbProvider>,
}

impl UserPgRepo {
    /// new constructor function
    pub fn new(pool: Arc<DbProvider>) -> Self
    where
        Self: Sized,
    {
        Self { db: pool }
    }
}

#[async_trait::async_trait]
impl UserRepository for UserPgRepo {
    #[tracing::instrument(skip(self, user_data))]
    async fn create(&self, user_data: CreateUser) -> Result<User, UserCreateRepoError> {
        let user = entities::user::ActiveModel {
            id: ActiveValue::Set(UserId::new().value()),
            username: ActiveValue::Set(user_data.username.to_string()),
            email: ActiveValue::Set(user_data.email.to_string()),
            password: ActiveValue::Set(user_data.password.to_string()),
            ..Default::default()
        };

        user.insert(self.db.pool())
            .await
            .map_err(|err| match err {
                DbErr::Query(RuntimeErr::SqlxError(sqlx::Error::Database(db_err))) => {
                    trace!("Database error: {}", db_err.to_string());
                    if db_err.is_unique_violation() {
                        UserCreateRepoError::AlreadyExists
                    } else {
                        UserCreateRepoError::DatabaseError(db_err.to_string())
                    }
                }
                e => UserCreateRepoError::UnexpectedError(e.to_string()),
            })
            .and_then(|user| {
                User::try_from(user)
                    .map_err(|e| UserCreateRepoError::UnexpectedError(e.to_string()))
            })
    }

    #[tracing::instrument(skip(self))]
    async fn find_by_email(&self, email: &Email) -> Result<Option<User>, UserFindRepoError> {
        let query = entities::user::Entity::find()
            .filter(entities::user::Column::Email.contains(email.to_string()))
            .one(self.db.pool())
            .await;

        match query {
            Ok(model) => match model {
                Some(model) => match User::try_from(model) {
                    Ok(user) => Ok(Some(user)),
                    Err(e) => Err(UserFindRepoError::UnexpectedError(e.to_string())),
                },
                None => Ok(None),
            },
            Err(e) => Err(UserFindRepoError::DatabaseError(e.to_string())),
        }
    }

    #[tracing::instrument(skip(self))]
    async fn find_one(&self, id: &UserId) -> Result<Option<User>, UserFindRepoError> {
        let query = entities::user::Entity::find_by_id(id.value())
            .one(self.db.pool())
            .await;

        match query {
            Ok(model) => match model {
                Some(model) => match User::try_from(model) {
                    Ok(user) => Ok(Some(user)),
                    Err(e) => Err(UserFindRepoError::UnexpectedError(e.to_string())),
                },
                None => Ok(None),
            },
            Err(e) => Err(UserFindRepoError::DatabaseError(e.to_string())),
        }
    }

    #[tracing::instrument(skip(self))]
    async fn find_all(self) -> Result<Vec<User>, UserFindRepoError> {
        let query = entities::user::Entity::find().all(self.db.pool()).await;

        match query {
            Ok(models) => {
                let users = models
                    .into_iter()
                    .map(User::try_from)
                    .collect::<Result<Vec<User>, UserError>>();

                match users {
                    Ok(users) => Ok(users),
                    Err(e) => Err(UserFindRepoError::UnexpectedError(e.to_string())),
                }
            }
            Err(e) => Err(UserFindRepoError::DatabaseError(e.to_string())),
        }
    }

    #[tracing::instrument(skip(self, user_data))]
    async fn update(&self, user_data: User) -> Result<User, UserUpdateRepoError> {
        let user = entities::user::ActiveModel::try_from(user_data)
            .map_err(|err| UserUpdateRepoError::UnexpectedError(err.to_string()))?;

        let query = user.update(self.db.pool()).await;

        match query {
            Ok(model) => match User::try_from(model) {
                Ok(user) => Ok(user),
                Err(e) => Err(UserUpdateRepoError::UnexpectedError(e.to_string())),
            },
            Err(e) => Err(UserUpdateRepoError::DatabaseError(e.to_string())),
        }
    }

    #[tracing::instrument(skip(self))]
    async fn delete(&self, id: &UserId) -> Result<(), UserDeleteRepoError> {
        let query = entities::user::Entity::find_by_id(id.value())
            .one(self.db.pool())
            .await;

        match query {
            Ok(_) => Ok(()),
            Err(e) => Err(UserDeleteRepoError::DatabaseError(e.to_string())),
        }
    }
}
