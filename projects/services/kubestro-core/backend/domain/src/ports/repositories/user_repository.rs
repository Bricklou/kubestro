use mockall::automock;

use crate::models::{
    create_user::CreateUser,
    fields::email::Email,
    user::{User, UserId},
};

#[automock]
#[async_trait::async_trait]
pub trait UserRepository: Send + Sync {
    async fn create(&self, user: CreateUser) -> Result<User, UserCreateRepoError>;
    async fn find_by_email(&self, email: &Email) -> Result<Option<User>, UserFindRepoError>;
    async fn find_one(&self, id: &UserId) -> Result<Option<User>, UserFindRepoError>;
    async fn find_all(self) -> Result<Vec<User>, UserFindRepoError>;
    async fn update(&self, user: User) -> Result<User, UserUpdateRepoError>;
    async fn delete(&self, id: &UserId) -> Result<(), UserDeleteRepoError>;
}

#[derive(Debug, PartialEq, thiserror::Error)]
pub enum UserCreateRepoError {
    #[error("User already exists")]
    AlreadyExists,
    #[error("Database error: {0}")]
    DatabaseError(String),
    #[error("Unexpected error: {0}")]
    UnexpectedError(String),
}

#[derive(Debug, PartialEq, thiserror::Error)]
pub enum UserFindRepoError {
    #[error("Database error: {0}")]
    DatabaseError(String),
    #[error("Unexpected error: {0}")]
    UnexpectedError(String),
}

#[derive(Debug, PartialEq, thiserror::Error)]
pub enum UserUpdateRepoError {
    #[error("User not found")]
    NotFound,
    #[error("Database error: {0}")]
    DatabaseError(String),
    #[error("Unexpected error: {0}")]
    UnexpectedError(String),
    #[error("Invalid user: {0}")]
    InvalidUser(String),
}

#[derive(Debug, PartialEq, thiserror::Error)]
pub enum UserDeleteRepoError {
    #[error("User not found")]
    NotFound,
    #[error("Database error: {0}")]
    DatabaseError(String),
    #[error("Unexpected error: {0}")]
    UnexpectedError(String),
}
