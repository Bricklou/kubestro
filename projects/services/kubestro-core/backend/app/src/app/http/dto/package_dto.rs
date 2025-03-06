use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Clone, Debug, Serialize, Deserialize, ToSchema)]
pub struct PackageDto {
    pub id: String,
    pub name: String,
    pub version: String,
    pub description: String,
}
