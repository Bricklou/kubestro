use std::{borrow::Cow, collections::HashMap};

use axum::{http::StatusCode, response::IntoResponse, Json};
use serde::Serialize;
use utoipa::ToSchema;

use super::mapping::map_status_code;

/// API Error object
///
/// This object respect the [RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html) standard.
#[derive(Debug, PartialEq, Serialize, ToSchema)]
pub struct ApiError {
    /// The type of the error
    #[serde(rename = "type")] // type is a reserved keyword in Rust, so we need to rename it to
    #[serde(skip_serializing_if = "Option::is_none")]
    pub _type: Option<Cow<'static, str>>,

    /// The HTTP status code of the error
    #[serde(serialize_with = "map_status_code")]
    #[schema(value_type = u16)]
    pub status: StatusCode,

    /// The title of the error
    pub title: Cow<'static, str>,

    /// The detail of the error
    #[serde(skip_serializing_if = "Option::is_none")]
    pub detail: Option<Cow<'static, str>>,

    /// The instance of the error
    #[serde(skip_serializing_if = "Option::is_none")]
    pub instance: Option<Cow<'static, str>>,

    /// The error code
    pub code: Cow<'static, str>,

    /// The extensions of the error
    #[serde(skip_serializing_if = "HashMap::is_empty", flatten)]
    pub extensions: HashMap<Cow<'static, str>, serde_json::Value>,
}

impl Default for ApiError {
    fn default() -> Self {
        Self {
            _type: None,
            status: StatusCode::INTERNAL_SERVER_ERROR,
            title: Cow::Borrowed("Internal Server Error"),
            detail: None,
            instance: None,
            code: Cow::Borrowed("internal_server_error"),
            extensions: HashMap::new(),
        }
    }
}

impl std::fmt::Display for ApiError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "[{}] {} - {}",
            self.status.as_u16(),
            self.title,
            self.detail.as_deref().unwrap_or("No detail provided"),
        )
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> axum::response::Response {
        (self.status, Json(self)).into_response()
    }
}
