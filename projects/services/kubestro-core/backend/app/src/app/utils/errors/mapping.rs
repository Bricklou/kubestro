use axum::http::StatusCode;
use serde::{Serialize, Serializer};

use super::ApiError;

pub fn map_status_code<S: Serializer>(
    status: &StatusCode,
    serializer: S,
) -> Result<S::Ok, S::Error> {
    status.as_u16().serialize(serializer)
}

impl ApiError {
    pub fn unexpected_error(detail: impl ToString) -> Self {
        Self {
            status: StatusCode::INTERNAL_SERVER_ERROR,
            title: "Internal Server Error".into(),
            detail: Some(format!("Unexpected error: {}", detail.to_string()).into()),
            code: "internal_server_error".into(),
            ..Default::default()
        }
    }

    pub fn database_error(detail: impl ToString) -> Self {
        Self {
            status: StatusCode::INTERNAL_SERVER_ERROR,
            title: "Internal Server Error".into(),
            detail: Some(format!("Database error: {}", detail.to_string()).into()),
            code: "internal_server_error".into(),
            ..Default::default()
        }
    }
}
