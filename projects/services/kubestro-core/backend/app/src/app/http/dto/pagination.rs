use kubestro_core_domain::models::pagination::{SortOrder, SortingFieldTrait};
use serde::Deserialize;
use utoipa::ToSchema;

#[derive(Debug, ToSchema)]
pub struct PaginationOrder<T: SortingFieldTrait>(pub T, pub SortOrder);

impl<T: SortingFieldTrait> From<PaginationOrder<T>> for (T, SortOrder) {
    fn from(pagination_order: PaginationOrder<T>) -> Self {
        (pagination_order.0, pagination_order.1)
    }
}

impl<'de, T: SortingFieldTrait> Deserialize<'de> for PaginationOrder<T> {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        // Try to parse `field` or `-field` into the actual field and the sort order
        let s = String::deserialize(deserializer)?;

        let (field, order) = if s.starts_with('-') {
            (s[1..].to_string(), SortOrder::Desc)
        } else {
            (s, SortOrder::Asc)
        };

        Ok(PaginationOrder(
            T::from_str(&field).map_err(serde::de::Error::custom)?,
            order,
        ))
    }
}
