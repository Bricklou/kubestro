use axum::http::StatusCode;
use serde::{Serialize, Serializer};

pub fn map_status_code<S: Serializer>(
    status: &StatusCode,
    serializer: S,
) -> Result<S::Ok, S::Error> {
    status.as_u16().serialize(serializer)
}
