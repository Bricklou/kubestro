use kubestro_core_infra::services::oidc::{OidcClient, OidcDiscoverConfig, OidcError};
use url::Url;

#[derive(Debug, thiserror::Error)]
enum EnvConfigError {
    #[error("Environment variable error: {0}")]
    EnvVar(#[from] std::env::VarError),
    #[error("URL parse error: {0}")]
    UrlParse(#[from] url::ParseError),

    #[error(transparent)]
    OidcError(#[from] OidcError),
}

/// Helper function to parse environment variables as strings
fn get_env(name: &str) -> Result<String, EnvConfigError> {
    std::env::var(name).map_err(Into::into)
}

/// Helper function to parse environment variables as URLs
fn get_env_url(name: &str) -> Result<Url, EnvConfigError> {
    std::env::var(name)?.parse::<Url>().map_err(Into::into)
}

fn push_missing_field(missing_fields: &mut Vec<String>, field: &str) {
    missing_fields.push(format!("\t- Missing mandatory field: {}", field));
}

#[derive(Debug, Clone)]
pub struct OidcConfig {
    pub display_name: Option<String>,
    pub client: OidcClient,
}

/// Read the environment variables and build OIDC configuration
///
/// Returns None if:
///   - No environment variables are set
///   - Mandatory fields are missing (with all warnings displayed at once)
///
/// Returns Some(OidcConfig) if all mandatory fields are present
pub async fn init_oidc_config() -> Option<OidcConfig> {
    // First check if any OIDC env vars are set to avoid unnecessary warning
    let oidc_config_url = get_env_url("OIDC_CONFIG_URL");
    let oidc_client_id = get_env("OIDC_CLIENT_ID");

    if oidc_config_url.is_err() {
        return None;
    }

    // Collect all configuration errors
    let mut missing_fields = Vec::new();

    if oidc_client_id.is_err() {
        push_missing_field(&mut missing_fields, "OIDC_CLIENT_ID");
    }

    let oidc_client_secret = get_env("OIDC_CLIENT_SECRET");
    if oidc_client_secret.is_err() {
        push_missing_field(&mut missing_fields, "OIDC_CLIENT_SECRET");
    }

    let oidc_redirect_uri = get_env_url("OIDC_REDIRECT_URI");
    if oidc_redirect_uri.is_err() {
        push_missing_field(&mut missing_fields, "OIDC_REDIRECT_URI");
    }

    // Check if we have any missing fields and return None if so
    if !missing_fields.is_empty() {
        warn!(
            "Missing required OIDC configuration fields:\n{}",
            missing_fields.join("\n")
        );
        return None;
    }

    // At this point, we know all mandatory fields are present and valid.
    // We can safely unwrap the values.
    // NOTE: for now, only OpenID Connect service with discovery are supported. We can
    // probably add support for manual configuration in the future.
    let mut config = OidcDiscoverConfig::new(
        oidc_config_url.unwrap().to_string(),
        oidc_client_id.unwrap(),
        oidc_client_secret.unwrap(),
        oidc_redirect_uri.unwrap().to_string(),
    );

    // Add optional fields if they exists
    config.claim_name = get_env("OIDC_CLAIM_NAME").ok();
    config.claim_name_prefix = get_env("OIDC_CLAIM_NAME_PREFIX").ok();
    config.scopes = get_env("OIDC_SCOPES")
        .ok()
        .map(|scopes| scopes.split(',').map(String::from).collect());

    debug!("OIDC configuration loaded successfully");

    let client = match OidcClient::new(config).await {
        Ok(client) => client,
        Err(e) => {
            error!("Failed to create OIDC client: {}", e);
            return None;
        }
    };

    Some(OidcConfig {
        display_name: get_env("OIDC_DISPLAY_NAME").ok(),
        client,
    })
}
