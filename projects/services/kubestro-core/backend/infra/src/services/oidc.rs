use openidconnect::{
    core::{
        CoreClient, CoreIdTokenVerifier, CoreProviderMetadata, CoreResponseType, CoreTokenResponse,
        CoreUserInfoClaims,
    },
    reqwest,
    url::Url,
    AccessToken, AuthenticationFlow, AuthorizationCode, ClientId, ClientSecret, CsrfToken,
    EndpointMaybeSet, EndpointNotSet, EndpointSet, IssuerUrl, LocalizedClaim, Nonce, RedirectUrl,
    Scope,
};

type CoreOidcClient = CoreClient<
    EndpointSet,
    EndpointNotSet,
    EndpointNotSet,
    EndpointNotSet,
    EndpointMaybeSet,
    EndpointMaybeSet,
>;

#[derive(Debug, thiserror::Error)]
pub enum OidcError {
    #[error("Failed to discovery provider metadata: {0}")]
    Discovery(String),
    #[error("Failed to parse URL: {0}")]
    UrlParse(#[from] openidconnect::url::ParseError),
    #[error("Invalid configuration: {0}")]
    Configuration(#[from] openidconnect::ConfigurationError),
    #[error("Failed to request user info: {0}")]
    UserInfo(String),
    #[error("Failed to exchange code: {0}")]
    ExchangeCode(String),
}

#[derive(Debug, Clone)]
pub struct OidcDiscoverConfig {
    // Required fields
    pub config_url: String,
    pub client_id: String,
    pub client_secret: String,
    pub redirect_uri: String,

    // Optional fields
    pub claim_name: Option<String>,
    pub claim_name_prefix: Option<String>,
    pub scopes: Option<Vec<String>>,
}

impl OidcDiscoverConfig {
    pub fn new(
        config_url: String,
        client_id: String,
        client_secret: String,
        redirect_uri: String,
    ) -> Self {
        Self {
            config_url,
            client_id,
            client_secret,
            redirect_uri,
            claim_name: None,
            claim_name_prefix: None,
            scopes: None,
        }
    }
}

#[derive(Debug, Clone)]
pub struct OidcClient {
    http_client: reqwest::Client,
    client: CoreOidcClient,
    discovery_config: OidcDiscoverConfig,
}

impl OidcClient {
    /// Create a new OIDC client
    pub async fn new(discovery_config: OidcDiscoverConfig) -> Result<Self, OidcError> {
        let http_client = reqwest::ClientBuilder::new()
            .redirect(reqwest::redirect::Policy::none())
            .build()
            .expect("Failed to create HTTP client");

        let client = Self::discovery_client(&http_client, &discovery_config).await?;

        Ok(Self {
            http_client,
            client,
            discovery_config,
        })
    }

    /// Call the OpenId discovery endpoint to retrieve configuration
    async fn discovery_client(
        http_client: &reqwest::Client,
        discovery_config: &OidcDiscoverConfig,
    ) -> Result<CoreOidcClient, OidcError> {
        let client_id = ClientId::new(discovery_config.client_id.clone());
        let client_secret = ClientSecret::new(discovery_config.client_secret.clone());

        let issuer_url = IssuerUrl::new(discovery_config.config_url.to_string())?;

        let provider_metadata = CoreProviderMetadata::discover_async(issuer_url, http_client)
            .await
            .map_err(|e| OidcError::Discovery(e.to_string()))?;

        let core_client =
            CoreClient::from_provider_metadata(provider_metadata, client_id, Some(client_secret))
                .set_redirect_uri(RedirectUrl::new(discovery_config.redirect_uri.to_string())?);

        Ok(core_client)
    }

    /// Get the inner core client
    pub fn core_client(&self) -> &CoreOidcClient {
        &self.client
    }

    pub async fn user_info(
        &self,
        access_token: AccessToken,
    ) -> Result<CoreUserInfoClaims, OidcError> {
        let user_info_request = self.client.user_info(access_token, None)?;

        let user_info = user_info_request
            .request_async(&self.http_client)
            .await
            .map_err(|e| OidcError::UserInfo(e.to_string()))?;
        Ok(user_info)
    }

    pub fn authorize_url(&self) -> (Url, CsrfToken, Nonce) {
        let builder = self.client.authorize_url(
            AuthenticationFlow::<CoreResponseType>::AuthorizationCode,
            CsrfToken::new_random,
            Nonce::new_random,
        );

        let builder = match &self.discovery_config.scopes {
            Some(scopes) => {
                builder.add_scopes(scopes.iter().map(|item| Scope::new(item.clone())).clone())
            }
            None => builder,
        };

        builder
            .add_scope(Scope::new("openid".to_string()))
            .add_scope(Scope::new("email".to_string()))
            .add_scope(Scope::new("profile".to_string()))
            .url()
    }

    pub async fn exchange_code(&self, code: String) -> Result<CoreTokenResponse, OidcError> {
        let code = AuthorizationCode::new(code);

        let token_response = self
            .client
            .exchange_code(code)?
            .request_async(&self.http_client)
            .await
            .map_err(|e| OidcError::ExchangeCode(e.to_string()))?;

        Ok(token_response)
    }

    pub fn id_token_verifier(&self) -> CoreIdTokenVerifier<'_> {
        self.client.id_token_verifier()
    }

    pub fn extract_localized_name<T: Clone>(&self, claim: Option<&LocalizedClaim<T>>) -> Option<T> {
        let claim = claim?;
        let key = claim.get(None)?;
        Some(key.clone())
    }
}
