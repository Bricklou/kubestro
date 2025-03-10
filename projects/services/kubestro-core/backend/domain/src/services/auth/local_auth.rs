use std::sync::Arc;

use crate::{
    models::{
        fields::{
            email::Email,
            password::{Password, PasswordError},
            username::Username,
        },
        user::{CreateUser, User, UserProvider},
    },
    ports::{
        hasher::Hasher,
        repositories::user_repository::{UserRepoError, UserRepository},
        validators::PasswordValidator,
    },
};

pub struct LocalAuthService {
    user_repo: Arc<dyn UserRepository>,
    hasher: Arc<dyn Hasher>,
    pass_validator: Arc<dyn PasswordValidator>,
}

pub struct RegisterUserPayload {
    pub username: Username,
    pub email: Email,
    pub password: Box<str>,
}

impl LocalAuthService {
    pub fn new(
        user_repo: Arc<dyn UserRepository>,
        hasher: Arc<dyn Hasher>,
        pass_validator: Arc<dyn PasswordValidator>,
    ) -> Self {
        Self {
            user_repo,
            hasher,
            pass_validator,
        }
    }

    #[tracing::instrument(skip(self, password))]
    pub async fn login(
        &self,
        email: &Email,
        password: &str,
    ) -> Result<User, LocalAuthServiceError> {
        let user = self.user_repo.find_by_email(email).await?;

        let Some(user) = user else {
            // To avoid timing attacks, we should always hash the password
            // even if the user is not found.
            let pass = Password::from_hash("".into());
            self.hasher.verify(password, &pass).unwrap_err();
            return Err(LocalAuthServiceError::InvalidCredentials);
        };

        let Some(user_password) = &user.password else {
            return Err(LocalAuthServiceError::PasswordAuthNotAvailable);
        };

        self.hasher
            .verify(password, user_password)
            .map_err(|_| LocalAuthServiceError::InvalidCredentials)?;

        Ok(user)
    }

    pub async fn register(&self, user: RegisterUserPayload) -> Result<User, LocalAuthServiceError> {
        let create_user = CreateUser {
            username: user.username,
            email: user.email,
            password: Some(Password::from_string(
                &user.password,
                self.hasher.clone(),
                self.pass_validator.clone(),
            )?),
            provider: UserProvider::Local,
        };
        let user = self.user_repo.create(create_user).await?;
        Ok(user)
    }

    pub async fn verify_password(
        &self,
        password: &str,
        hash: &Password,
    ) -> Result<(), PasswordError> {
        hash.verify(password, self.hasher.clone())
    }

    #[tracing::instrument(skip(self, new_password))]
    pub async fn update_password(
        &self,
        user: User,
        new_password: &str,
    ) -> Result<(), LocalAuthServiceError> {
        let new_password = Password::from_string(
            new_password,
            self.hasher.clone(),
            self.pass_validator.clone(),
        )?;

        let mut current_user = user;
        current_user.password = Some(new_password);

        self.user_repo.update(current_user).await?;

        Ok(())
    }
}

#[derive(Debug, thiserror::Error, PartialEq)]
pub enum LocalAuthServiceError {
    #[error("Invalid credentials")]
    InvalidCredentials,

    #[error("Password authentication is not available for this account")]
    PasswordAuthNotAvailable,

    #[error(transparent)]
    PasswordError(#[from] PasswordError),

    #[error(transparent)]
    User(#[from] UserRepoError),
}

#[cfg(test)]
mod tests {
    use std::sync::Arc;

    use crate::{
        models::{user::UserId, EntityId},
        ports::{
            hasher::{HasherError, MockHasher},
            repositories::user_repository::MockUserRepository,
            validators::MockPasswordValidator,
        },
    };

    use super::*;
    use chrono::Utc;

    const USERNAME: &str = "username";
    const EMAIL: &str = "toto@example.com";
    const PASSWORD: &str = "password";
    const INVALID_PASSWORD: &str = "invalid_password";

    #[tokio::test]
    async fn invalid_user_should_throw_an_error() {
        let mut user_repo = MockUserRepository::new();
        user_repo
            .expect_find_by_email()
            .times(1)
            .returning(|_| Ok(None));

        let mut hasher = MockHasher::new();
        // We expect the hasher to be called even if the user is not found to avoid timing attacks
        hasher
            .expect_verify()
            .times(1)
            .returning(|_, _| Err(HasherError::VerifyError("".to_string())));

        let local_auth = LocalAuthService::new(
            Arc::new(user_repo),
            Arc::new(hasher),
            Arc::new(MockPasswordValidator::new()),
        );

        let email = Email::try_from(EMAIL.to_string()).unwrap();

        let result = local_auth.login(&email, PASSWORD).await;

        assert!(result.is_err());
        assert_eq!(
            result.unwrap_err(),
            LocalAuthServiceError::InvalidCredentials
        );
    }

    #[tokio::test]
    async fn invalid_password_should_throw_an_error() {
        let dumb_user = User::new(
            UserId::new(),
            USERNAME.try_into().unwrap(),
            EMAIL.try_into().unwrap(),
            Some(PASSWORD.to_string().into()),
            Utc::now(),
        );

        let mut user_repo = MockUserRepository::new();
        user_repo
            .expect_find_by_email()
            .times(1)
            .returning(move |_| Ok(Some(dumb_user.clone())));

        let mut hasher = MockHasher::new();
        hasher
            .expect_verify()
            .times(1)
            .returning(|_, _| Err(HasherError::HashError("".to_string())));

        let local_auth = LocalAuthService::new(
            Arc::new(user_repo),
            Arc::new(hasher),
            Arc::new(MockPasswordValidator::new()),
        );

        let email = Email::try_from(EMAIL.to_string()).unwrap();

        let result = local_auth.login(&email, INVALID_PASSWORD).await;

        assert!(result.is_err());
        assert_eq!(
            result.unwrap_err(),
            LocalAuthServiceError::InvalidCredentials
        );
    }

    #[tokio::test]
    async fn valid_credentials_should_return_a_user() {
        let dumb_user = User::new(
            UserId::new(),
            USERNAME.try_into().unwrap(),
            EMAIL.try_into().unwrap(),
            Some(PASSWORD.to_string().into()),
            Utc::now(),
        );

        let result_user = dumb_user.clone();

        let mut user_repo = MockUserRepository::new();
        user_repo
            .expect_find_by_email()
            .times(1)
            .returning(move |_| Ok(Some(dumb_user.clone())));

        let mut hasher = MockHasher::new();
        hasher.expect_verify().times(1).returning(|_, _| Ok(()));

        let local_auth = LocalAuthService::new(
            Arc::new(user_repo),
            Arc::new(hasher),
            Arc::new(MockPasswordValidator::new()),
        );

        let email = Email::try_from(EMAIL.to_string()).unwrap();

        let result = local_auth.login(&email, PASSWORD).await;

        assert!(result.is_ok());
        assert_eq!(result.unwrap(), result_user);
    }

    #[tokio::test]
    async fn not_found_user_should_throw_an_error() {
        let mut user_repo = MockUserRepository::new();
        user_repo
            .expect_find_by_email()
            .times(1)
            .returning(|_| Ok(None));

        let mut hasher = MockHasher::new();
        // We expect the hasher to be called even if the user is not found to avoid timing attacks
        hasher
            .expect_verify()
            .times(1)
            .returning(|_, _| Err(HasherError::VerifyError("".to_string())));

        let local_auth = LocalAuthService::new(
            Arc::new(user_repo),
            Arc::new(hasher),
            Arc::new(MockPasswordValidator::new()),
        );

        let email = Email::try_from(EMAIL.to_string()).unwrap();

        let result = local_auth.login(&email, PASSWORD).await;

        assert!(result.is_err());
        assert_eq!(
            result.unwrap_err(),
            LocalAuthServiceError::InvalidCredentials
        );
    }

    #[tokio::test]
    async fn user_register_with_already_existing_should_throw_an_error() {
        let user = RegisterUserPayload {
            username: USERNAME.try_into().unwrap(),
            email: EMAIL.try_into().unwrap(),
            password: PASSWORD.into(),
        };

        let mut user_repo = MockUserRepository::new();
        user_repo
            .expect_create()
            .times(1)
            .returning(|_| Err(UserRepoError::AlreadyExists));
        let mut hasher = MockHasher::new();
        hasher
            .expect_hash()
            .times(1)
            .returning(|pass| Ok(pass.to_string()));

        let mut pass_validator = MockPasswordValidator::new();
        pass_validator
            .expect_validate()
            .times(1)
            .returning(|_| Ok(()));

        let local_auth = LocalAuthService::new(
            Arc::new(user_repo),
            Arc::new(hasher),
            Arc::new(pass_validator),
        );

        let result = local_auth.register(user).await;

        assert!(result.is_err());
        assert_eq!(
            result.unwrap_err(),
            LocalAuthServiceError::User(UserRepoError::AlreadyExists)
        );
    }

    #[tokio::test]
    async fn user_register_with_valid_data_should_return_user() {
        let user = RegisterUserPayload {
            username: USERNAME.try_into().unwrap(),
            email: EMAIL.try_into().unwrap(),
            password: PASSWORD.into(),
        };

        let output_user = User::new(
            UserId::new(),
            user.username.clone(),
            user.email.clone(),
            Some(Password::from_hash(PASSWORD.into())),
            Utc::now(),
        );

        let mut user_repo = MockUserRepository::new();
        let result_user = output_user.clone();
        user_repo
            .expect_create()
            .times(1)
            .returning(move |_| Ok(result_user.clone()));

        let mut hasher = MockHasher::new();
        hasher
            .expect_hash()
            .times(1)
            .returning(|pass| Ok(pass.to_string()));

        let mut pass_validator = MockPasswordValidator::new();
        pass_validator
            .expect_validate()
            .times(1)
            .returning(|_| Ok(()));

        let local_auth = LocalAuthService::new(
            Arc::new(user_repo),
            Arc::new(hasher),
            Arc::new(pass_validator),
        );

        let result = local_auth.register(user).await;

        assert!(result.is_ok());
        assert_eq!(result.unwrap(), output_user);
    }
}
