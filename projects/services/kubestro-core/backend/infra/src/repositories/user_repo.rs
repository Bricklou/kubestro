use std::sync::Arc;

use chrono::{DateTime, Utc};
use kubestro_core_domain::{
    models::{
        fields::{
            email::{Email, EmailError},
            password::{Password, PasswordError},
            username::{Username, UsernameError},
        },
        pagination::{self, PaginatedModel, PaginationOptions, SortOrder},
        user::{CreateUser, User, UserId, UserProvider, UserStatus, UsersFilters, UsersSortField},
        Entity, EntityId,
    },
    ports::repositories::user_repository::{UserRepoError, UserRepository},
};
use sea_orm::{
    prelude::{async_trait, Expr, Uuid},
    sea_query::{extension::postgres::PgExpr, Func},
    sqlx, ActiveModelTrait, ActiveValue, ColumnTrait, Condition, DbErr, EntityTrait, ModelTrait,
    Order, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, QueryTrait, RuntimeErr,
    TransactionTrait,
};
use tracing::trace;

use crate::entities::{self, user_oidc};

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

impl From<UserProvider> for entities::sea_orm_active_enums::UserProvider {
    fn from(provider: UserProvider) -> Self {
        match provider {
            UserProvider::Local => entities::sea_orm_active_enums::UserProvider::Local,
            UserProvider::Oidc => entities::sea_orm_active_enums::UserProvider::Oidc,
        }
    }
}

impl From<entities::sea_orm_active_enums::UserProvider> for UserProvider {
    fn from(provider: entities::sea_orm_active_enums::UserProvider) -> UserProvider {
        match provider {
            entities::sea_orm_active_enums::UserProvider::Local => UserProvider::Local,
            entities::sea_orm_active_enums::UserProvider::Oidc => UserProvider::Oidc,
        }
    }
}

impl From<UserStatus> for entities::sea_orm_active_enums::UserStatus {
    fn from(status: UserStatus) -> Self {
        match status {
            UserStatus::Active => entities::sea_orm_active_enums::UserStatus::Active,
            UserStatus::Inactive => entities::sea_orm_active_enums::UserStatus::Inactive,
            UserStatus::Invited => entities::sea_orm_active_enums::UserStatus::Invited,
            UserStatus::Suspended => entities::sea_orm_active_enums::UserStatus::Suspended,
        }
    }
}

impl From<entities::sea_orm_active_enums::UserStatus> for UserStatus {
    fn from(status: entities::sea_orm_active_enums::UserStatus) -> UserStatus {
        match status {
            entities::sea_orm_active_enums::UserStatus::Active => UserStatus::Active,
            entities::sea_orm_active_enums::UserStatus::Inactive => UserStatus::Inactive,
            entities::sea_orm_active_enums::UserStatus::Invited => UserStatus::Invited,
            entities::sea_orm_active_enums::UserStatus::Suspended => UserStatus::Suspended,
        }
    }
}

impl From<UsersSortField> for entities::user::Column {
    fn from(sort_field: UsersSortField) -> Self {
        match sort_field {
            UsersSortField::Username => entities::user::Column::Username,
            UsersSortField::Email => entities::user::Column::Email,
            UsersSortField::CreatedAt => entities::user::Column::CreatedAt,
            UsersSortField::UpdatedAt => entities::user::Column::UpdatedAt,
        }
    }
}

impl TryFrom<User> for entities::user::ActiveModel {
    type Error = UserError;

    fn try_from(value: User) -> Result<Self, Self::Error> {
        Ok(entities::user::ActiveModel {
            id: ActiveValue::Set(value.id().value()),
            username: ActiveValue::Set(value.username.to_string()),
            email: ActiveValue::Set(value.email.to_string()),
            password: ActiveValue::Set(value.password.map(|p| p.to_string())),
            created_at: ActiveValue::Set(value.created_at.into()),
            updated_at: ActiveValue::Set(value.updated_at.into()),
            provider: ActiveValue::Set(value.provider.into()),
            status: ActiveValue::Set(value.status.into()),
        })
    }
}

impl TryFrom<entities::user::Model> for User {
    type Error = UserError;

    fn try_from(value: entities::user::Model) -> Result<Self, Self::Error> {
        let id = UserId::from(value.id);
        let username = Username::try_from(value.username)?;
        let email = Email::try_from(value.email)?;
        let password = value.password.map(Password::from_hash);
        let created_at: DateTime<Utc> = value.created_at.into();
        let provider = UserProvider::from(value.provider);
        let status = UserStatus::from(value.status);

        let mut user = User::new(id, username, email, password, created_at);
        user.set_provider(provider);
        user.set_status(status);

        Ok(user)
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
    async fn create(&self, user_data: CreateUser) -> Result<User, UserRepoError> {
        let user = entities::user::ActiveModel {
            id: ActiveValue::Set(UserId::new().value()),
            username: ActiveValue::Set(user_data.username.to_string()),
            email: ActiveValue::Set(user_data.email.to_string()),
            password: ActiveValue::Set(user_data.password.map(|p| p.to_string())),
            provider: ActiveValue::Set(user_data.provider.into()),
            ..Default::default()
        };

        user.insert(self.db.pool())
            .await
            .map_err(|err| match err {
                DbErr::Query(RuntimeErr::SqlxError(sqlx::Error::Database(db_err))) => {
                    trace!("Database error: {}", db_err.to_string());
                    if db_err.is_unique_violation() {
                        UserRepoError::AlreadyExists
                    } else {
                        UserRepoError::DatabaseError(db_err.to_string())
                    }
                }
                e => UserRepoError::UnexpectedError(e.to_string()),
            })
            .and_then(|user| {
                User::try_from(user).map_err(|e| UserRepoError::UnexpectedError(e.to_string()))
            })
    }

    #[tracing::instrument(skip(self))]
    async fn find_by_email(&self, email: &Email) -> Result<Option<User>, UserRepoError> {
        let query = entities::user::Entity::find()
            .filter(entities::user::Column::Email.contains(email.to_string()))
            .one(self.db.pool())
            .await;

        match query {
            Ok(model) => match model {
                Some(model) => match User::try_from(model) {
                    Ok(user) => Ok(Some(user)),
                    Err(e) => Err(UserRepoError::UnexpectedError(e.to_string())),
                },
                None => Ok(None),
            },
            Err(e) => Err(UserRepoError::DatabaseError(e.to_string())),
        }
    }

    #[tracing::instrument(skip(self))]
    async fn find_by_username(&self, username: &str) -> Result<Option<User>, UserRepoError> {
        let query = entities::user::Entity::find()
            .filter(entities::user::Column::Username.contains(username.to_string()))
            .one(self.db.pool())
            .await;

        match query {
            Ok(model) => match model {
                Some(model) => match User::try_from(model) {
                    Ok(user) => Ok(Some(user)),
                    Err(e) => Err(UserRepoError::UnexpectedError(e.to_string())),
                },
                None => Ok(None),
            },
            Err(e) => Err(UserRepoError::DatabaseError(e.to_string())),
        }
    }

    #[tracing::instrument(skip(self))]
    async fn find_one(&self, id: &UserId) -> Result<Option<User>, UserRepoError> {
        let query = entities::user::Entity::find_by_id(id.value())
            .one(self.db.pool())
            .await;

        match query {
            Ok(model) => match model {
                Some(model) => match User::try_from(model) {
                    Ok(user) => Ok(Some(user)),
                    Err(e) => Err(UserRepoError::UnexpectedError(e.to_string())),
                },
                None => Ok(None),
            },
            Err(e) => Err(UserRepoError::DatabaseError(e.to_string())),
        }
    }

    #[tracing::instrument(skip(self))]
    async fn find_all(self) -> Result<Vec<User>, UserRepoError> {
        let query = entities::user::Entity::find().all(self.db.pool()).await;

        match query {
            Ok(models) => {
                let users = models
                    .into_iter()
                    .map(User::try_from)
                    .collect::<Result<Vec<User>, UserError>>()
                    .map_err(|e| UserRepoError::UnexpectedError(e.to_string()))?;

                Ok(users)
            }
            Err(e) => Err(UserRepoError::DatabaseError(e.to_string())),
        }
    }

    #[tracing::instrument(skip(self, user_data))]
    async fn update(&self, user_data: User) -> Result<User, UserRepoError> {
        let user = entities::user::ActiveModel::try_from(user_data)
            .map_err(|err| UserRepoError::UnexpectedError(err.to_string()))?;

        let query = user.update(self.db.pool()).await.map_err(|err| match err {
            DbErr::Query(RuntimeErr::SqlxError(sqlx::Error::Database(db_err))) => {
                trace!("Database error: {}", db_err.to_string());
                if db_err.is_unique_violation() {
                    UserRepoError::AlreadyExists
                } else {
                    UserRepoError::DatabaseError(db_err.to_string())
                }
            }
            e => UserRepoError::UnexpectedError(e.to_string()),
        });

        match query {
            Ok(model) => match User::try_from(model) {
                Ok(user) => Ok(user),
                Err(e) => Err(UserRepoError::UnexpectedError(e.to_string())),
            },
            Err(e) => Err(UserRepoError::DatabaseError(e.to_string())),
        }
    }

    #[tracing::instrument(skip(self))]
    async fn delete(&self, id: &UserId) -> Result<(), UserRepoError> {
        let txn = self
            .db
            .pool()
            .begin()
            .await
            .map_err(|e| UserRepoError::DatabaseError(e.to_string()))?;

        let query = entities::user::Entity::find_by_id(id.value())
            .one(self.db.pool())
            .await
            .map_err(|e| UserRepoError::DatabaseError(e.to_string()))?;

        if let Some(user) = query {
            user.delete(&txn)
                .await
                .map_err(|e| UserRepoError::DatabaseError(e.to_string()))?;
        }

        txn.commit()
            .await
            .map_err(|e| UserRepoError::DatabaseError(e.to_string()))?;

        Ok(())
    }

    #[tracing::instrument(skip(self))]
    async fn find_by_oidc_subject(&self, subject: &str) -> Result<Option<User>, UserRepoError> {
        let user_model = entities::user_oidc::Entity::find()
            .filter(user_oidc::Column::OidcSubject.eq(subject))
            .find_also_related(entities::user::Entity)
            .one(self.db.pool())
            .await
            .map_err(|e| UserRepoError::DatabaseError(e.to_string()))?
            .and_then(|(_, user_model)| user_model);

        match user_model {
            Some(user_model) => match User::try_from(user_model) {
                Ok(user) => Ok(Some(user)),
                Err(e) => Err(UserRepoError::UnexpectedError(e.to_string())),
            },
            None => Ok(None),
        }
    }

    #[tracing::instrument(skip(self))]
    async fn paginate_users(
        &self,
        pagination: PaginationOptions<UsersFilters, UsersSortField>,
    ) -> Result<PaginatedModel<User>, UserRepoError> {
        let mut query = entities::user::Entity::find()
            .apply_if(pagination.filters.search, |query, val| {
                query.filter(
                    Condition::any()
                        .add(
                            Expr::expr(Func::lower(Expr::col(entities::user::Column::Username)))
                                .ilike(format!("%{}%", &val.to_lowercase())),
                        )
                        .add(
                            Expr::expr(Func::lower(Expr::col(entities::user::Column::Email)))
                                .ilike(format!("%{}%", &val.to_lowercase())),
                        ),
                )
            })
            .apply_if(pagination.order, |query, (field, order)| {
                let column = entities::user::Column::from(field);
                query.order_by(
                    column,
                    match order {
                        SortOrder::Asc => Order::Asc,
                        SortOrder::Desc => Order::Desc,
                    },
                )
            });

        if !pagination.filters.provider.is_empty() {
            let providers = pagination
                .filters
                .provider
                .iter()
                .map(|v| entities::sea_orm_active_enums::UserProvider::from(v.clone()))
                .collect::<Vec<_>>();

            query = query.filter(entities::user::Column::Provider.is_in(providers));
        }

        if !pagination.filters.status.is_empty() {
            let status = pagination
                .filters
                .status
                .iter()
                .map(|v| entities::sea_orm_active_enums::UserStatus::from(v.clone()))
                .collect::<Vec<_>>();

            query = query.filter(entities::user::Column::Status.is_in(status));
        }

        let paginator = query.paginate(self.db.pool(), pagination.limit);

        let models = paginator
            .fetch_page(pagination.page - 1)
            .await
            .map_err(|e| UserRepoError::DatabaseError(e.to_string()))?;
        let meta = paginator
            .num_items_and_pages()
            .await
            .map_err(|e| UserRepoError::DatabaseError(e.to_string()))?;

        let users = models
            .into_iter()
            .map(User::try_from)
            .collect::<Result<Vec<User>, UserError>>()
            .map_err(|e| UserRepoError::UnexpectedError(e.to_string()))?;

        Ok(PaginatedModel {
            items: users,
            total_items: meta.number_of_items,
            total_pages: meta.number_of_pages,
        })
    }

    #[tracing::instrument(skip(self))]
    async fn create_oidc_association(
        &self,
        user_id: &UserId,
        subject: &str,
    ) -> Result<(), UserRepoError> {
        let oidc_user = entities::user_oidc::ActiveModel {
            id: ActiveValue::Set(Uuid::new_v4()),
            user_id: ActiveValue::Set(user_id.value()),
            oidc_subject: ActiveValue::Set(subject.to_string()),
        };

        oidc_user
            .insert(self.db.pool())
            .await
            .map_err(|err| match err {
                DbErr::Query(RuntimeErr::SqlxError(sqlx::Error::Database(db_err))) => {
                    trace!("Database error: {}", db_err.to_string());
                    if db_err.is_unique_violation() {
                        UserRepoError::AlreadyExists
                    } else {
                        UserRepoError::DatabaseError(db_err.to_string())
                    }
                }
                e => UserRepoError::UnexpectedError(e.to_string()),
            })?;

        Ok(())
    }
}
