#[derive(Debug)]
pub enum SortOrder {
    Asc,
    Desc,
}

#[derive(Debug)]
pub struct PaginationOptions<F, S: SortingFieldTrait> {
    pub page: u64,
    pub limit: u64,

    pub filters: F,
    pub order: Option<(S, SortOrder)>,
}

impl<F: Default, S: SortingFieldTrait> Default for PaginationOptions<F, S> {
    fn default() -> Self {
        Self {
            page: 1,
            limit: 10,
            filters: F::default(),
            order: None,
        }
    }
}

pub struct PaginatedModel<T> {
    pub items: Vec<T>,
    pub total_items: u64,
    pub total_pages: u64,
}

pub trait SortingFieldTrait {
    fn from_str(field: &str) -> Result<Self, SortingFieldError>
    where
        Self: Sized;
}

#[derive(Debug, thiserror::Error)]
pub enum SortingFieldError {
    #[error("Invalid sorting field: {0}")]
    InvalidSortingField(String),
}

/// Parse sorting field
///
/// Take in input any field with the format `field` or `-field` and return the field and the sort order
pub fn parse_sorting_field<S: SortingFieldTrait>(
    field: String,
) -> Result<(S, SortOrder), SortingFieldError> {
    if field.is_empty() {
        return Err(SortingFieldError::InvalidSortingField(field));
    }

    let (field, order) = if field.starts_with('-') {
        (field[1..].to_string(), SortOrder::Desc)
    } else {
        (field, SortOrder::Asc)
    };

    let field = S::from_str(&field)?;

    Ok((field, order))
}
