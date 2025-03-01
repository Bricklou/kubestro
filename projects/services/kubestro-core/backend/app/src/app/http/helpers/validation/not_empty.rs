use validator::ValidationError;

/// Validates whether the given value is not empty.
pub fn validate_not_empty(value: &str) -> Result<(), ValidationError> {
    if value.is_empty() {
        Err(ValidationError::new("Value cannot be empty"))
    } else {
        Ok(())
    }
}
