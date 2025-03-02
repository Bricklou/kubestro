use crate::models::{
    fields::email::Email,
    user::{CreateUser, User, UserId},
};

#[cfg_attr(test, mockall::automock)]
#[async_trait::async_trait]
pub trait UserRepository: Send + Sync {
    async fn create(&self, user: CreateUser) -> Result<User, UserRepoError>;
    async fn find_by_username(&self, username: &str) -> Result<Option<User>, UserRepoError>;
    async fn find_by_email(&self, email: &Email) -> Result<Option<User>, UserRepoError>;
    async fn find_by_oidc_subject(&self, oidc_subject: &str)
        -> Result<Option<User>, UserRepoError>;
    async fn find_one(&self, id: &UserId) -> Result<Option<User>, UserRepoError>;
    async fn find_all(self) -> Result<Vec<User>, UserRepoError>;
    async fn update(&self, user: User) -> Result<User, UserRepoError>;
    async fn delete(&self, id: &UserId) -> Result<(), UserRepoError>;

    async fn create_oidc_association(
        &self,
        id: &UserId,
        oidc_subject: &str,
    ) -> Result<(), UserRepoError>;
}

#[derive(Debug, PartialEq, thiserror::Error)]
pub enum UserRepoError {
    #[error("User not found")]
    NotFound,
    #[error("User already exists")]
    AlreadyExists,
    #[error("Invalid user: {0}")]
    InvalidUser(String),
    #[error("Database error: {0}")]
    DatabaseError(String),
    #[error("Unexpected error: {0}")]
    UnexpectedError(String),
}
