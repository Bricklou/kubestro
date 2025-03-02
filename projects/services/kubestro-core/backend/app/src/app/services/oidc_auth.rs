use std::sync::Arc;

use crate::app::context::oidc::OidcConfig;
use kubestro_core_domain::{
    models::{
        fields::{email::EmailError, password::PasswordError, username::UsernameError},
        user::{CreateUser, User, UserProvider},
        Entity,
    },
    ports::repositories::user_repository::{UserRepoError, UserRepository},
};
use kubestro_core_infra::services::oidc::{OidcClient, OidcError};
use openidconnect::{Nonce, TokenResponse};
use tracing::debug;

pub struct OidcAuthService {
    user_repo: Arc<dyn UserRepository>,
    oidc_config: OidcConfig,
}

impl OidcAuthService {
    pub fn new(user_repo: Arc<dyn UserRepository>, oidc_config: OidcConfig) -> Self {
        Self {
            user_repo,
            oidc_config,
        }
    }

    pub fn get_client(&self) -> &OidcClient {
        &self.oidc_config.client
    }

    pub fn display_name(&self) -> Option<String> {
        self.oidc_config.display_name.clone()
    }

    /// Login the user if it exists, otherwise create it based on the OIDC information
    #[tracing::instrument(skip(self))]
    pub async fn login_or_create(
        &self,
        code: String,
        nonce: String,
    ) -> Result<User, OidcAuthServiceError> {
        let client = &self.oidc_config.client;
        let token_response = self.oidc_config.client.exchange_code(code).await?;

        let Some(id_token) = token_response.id_token() else {
            debug!("No ID token found in the token response");
            return Err(OidcAuthServiceError::LoginFailed);
        };

        let nonce = Nonce::new(nonce);

        let claims = id_token
            .claims(&client.id_token_verifier(), &nonce)
            .map_err(|e| {
                debug!("Failed to verify the ID token: {:?}", e);
                OidcAuthServiceError::LoginFailed
            })?;

        let user_id = claims.subject();
        // NOTE: The unwrap is safe because the `email` is required with the OIDC client scopes (`email`)
        let email = claims.email().unwrap();
        // NOTE: The unwrap is safe because both the `name` and `given_name` are required with the OIDC client scopes (`profile`)
        let given_name = client.extract_localized_name(claims.given_name()).unwrap();

        debug!("User claims: {:?}", claims);
        // Check if the user already exists
        if let Some(user) = self
            .user_repo
            .find_by_oidc_subject(user_id.as_str())
            .await?
        {
            // If the user exists, return it
            debug!("User found: {:?}", user);
            return Ok(user);
        }

        // Otherwise, create the user
        // NOTE: The password is not used for OIDC users
        let user_data = CreateUser {
            username: given_name.to_string().try_into()?,
            email: email.to_string().try_into()?,
            password: None,
            provider: UserProvider::Oidc,
        };
        let user = self.user_repo.create(user_data).await?;

        // And then, create the association between the user and the OIDC subject
        self.user_repo
            .create_oidc_association(&user.id(), user_id.as_str())
            .await
            .map_err(|e| {
                debug!("Failed to create the OIDC association: {:?}", e);
                OidcAuthServiceError::User(e)
            })?;

        Ok(user)
    }
}

#[derive(Debug, thiserror::Error)]
pub enum OidcAuthServiceError {
    #[error("Login failed")]
    LoginFailed,

    #[error(transparent)]
    OidcClientError(#[from] OidcError),

    #[error(transparent)]
    PasswordError(#[from] PasswordError),

    #[error(transparent)]
    UsernameError(#[from] UsernameError),

    #[error(transparent)]
    EmailError(#[from] EmailError),

    #[error(transparent)]
    User(#[from] UserRepoError),
}
