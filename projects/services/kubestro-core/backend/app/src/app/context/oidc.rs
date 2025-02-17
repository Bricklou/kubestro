use serde::Serialize;
use url::Url;

#[derive(Debug, thiserror::Error)]
enum EnvConfigError {
    #[error("Environment variable error: {0}")]
    EnvVar(#[from] std::env::VarError),
    #[error("URL parse error: {0}")]
    UrlParse(#[from] url::ParseError),
}

#[derive(Debug)]
pub struct OidcConfig {
    // Required fields
    config_url: Url,
    client_id: String,
    client_secret: String,
    redirect_uri: Url,

    // Optional fields
    claim_name: Option<String>,
    claim_name_prefix: Option<String>,
    scopes: Option<Vec<String>>,
    display_name: Option<String>,
}

impl OidcConfig {
    fn new(config_url: Url, client_id: String, client_secret: String, redirect_uri: Url) -> Self {
        Self {
            config_url,
            client_id,
            client_secret,
            redirect_uri,
            claim_name: None,
            claim_name_prefix: None,
            scopes: None,
            display_name: None,
        }
    }
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

/// Read the environment variables and build OIDC configuration
///
/// Returns None if:
///   - No environment variables are set
///   - Mandatory fields are missing (with all warnings displayed at once)
///
/// Returns Some(OidcConfig) if all mandatory fields are present
pub fn init_oidc_config() -> Option<OidcConfig> {
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
    let mut config = OidcConfig::new(
        oidc_config_url.unwrap(),
        oidc_client_id.unwrap(),
        oidc_client_secret.unwrap(),
        oidc_redirect_uri.unwrap(),
    );

    // Add optional fields if they exists
    config.claim_name = get_env("OIDC_CLAIM_NAME").ok();
    config.claim_name_prefix = get_env("OIDC_CLAIM_NAME_PREFIX").ok();
    config.scopes = get_env("OIDC_SCOPES")
        .ok()
        .map(|scopes| scopes.split(',').map(String::from).collect());
    config.display_name = get_env("OIDC_DISPLAY_NAME").ok();

    debug!("OIDC configuration loaded successfully");

    Some(config)
}
