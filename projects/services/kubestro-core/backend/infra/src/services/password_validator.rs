use kubestro_core_domain::ports::validators::PasswordValidator;
use passwords;

#[derive(Default)]
pub struct InfraPasswordValidator {}

impl PasswordValidator for InfraPasswordValidator {
    fn validate(&self, password: &str) -> Result<(), validator::ValidationError> {
        let analyzed = passwords::analyzer::analyze(password);

        let score = passwords::scorer::score(&analyzed);

        if analyzed.length() < 8 {
            return Err(validator::ValidationError {
                code: "PASSWORD_TOO_SHORT".into(),
                message: Some("Password is too short".into()),
                params: [
                    ("length".into(), analyzed.length().into()),
                    ("score".into(), score.into()),
                ]
                .into(),
            });
        }

        if analyzed.lowercase_letters_count() < 1 {
            return Err(validator::ValidationError {
                code: "PASSWORD_WITHOUT_LOWERCASE".into(),
                message: Some("Password must contain at least one lowercase letter".into()),
                params: [("score".into(), score.into())].into(),
            });
        }

        if analyzed.uppercase_letters_count() < 1 {
            return Err(validator::ValidationError {
                code: "PASSWORD_WITHOUT_UPPERCASE".into(),
                message: Some("Password must contain at least one uppercase letter".into()),
                params: [("score".into(), score.into())].into(),
            });
        }

        if analyzed.numbers_count() < 1 {
            return Err(validator::ValidationError {
                code: "PASSWORD_WITHOUT_NUMBER".into(),
                message: Some("Password must contain at least one number".into()),
                params: [("score".into(), score.into())].into(),
            });
        }

        if analyzed.symbols_count() < 1 {
            return Err(validator::ValidationError {
                code: "PASSWORD_WITHOUT_SPECIAL_CHARACTER".into(),
                message: Some("Password must contain at least one special character".into()),
                params: [("score".into(), score.into())].into(),
            });
        }

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_min_length() {
        let validator = InfraPasswordValidator::default();

        let password = "1234567".to_string();
        let result = validator.validate(&password);

        assert!(result.is_err());
        assert_eq!(result.unwrap_err().code, "PASSWORD_TOO_SHORT");
    }

    #[test]
    fn test_validate_without_number_should_throw_error() {
        let validator = InfraPasswordValidator::default();

        let password = "AbCdEfGh".to_string();
        let result = validator.validate(&password);

        assert!(result.is_err());
        assert_eq!(result.unwrap_err().code, "PASSWORD_WITHOUT_NUMBER");
    }

    #[test]
    fn test_validate_without_uppercase_should_throw_error() {
        let validator = InfraPasswordValidator::default();

        let password = "abcdefgh1".to_string();
        let result = validator.validate(&password);

        assert!(result.is_err());
        assert_eq!(result.unwrap_err().code, "PASSWORD_WITHOUT_UPPERCASE");
    }

    #[test]
    fn test_validate_without_lowercase_should_throw_error() {
        let validator = InfraPasswordValidator::default();

        let password = "ABCDEFGH1".to_string();
        let result = validator.validate(&password);

        assert!(result.is_err());
        assert_eq!(result.unwrap_err().code, "PASSWORD_WITHOUT_LOWERCASE");
    }

    #[test]
    fn test_validate_without_special_character_should_throw_error() {
        let validator = InfraPasswordValidator::default();

        let password = "Abc12442EAcD".to_string();
        let result = validator.validate(&password);

        assert!(result.is_err());
        assert_eq!(
            result.unwrap_err().code,
            "PASSWORD_WITHOUT_SPECIAL_CHARACTER"
        );
    }

    #[test]
    fn test_validate_ok() {
        let validator = InfraPasswordValidator::default();

        let password = "MyP@ssw0rd".to_string();
        let result = validator.validate(&password);

        assert!(result.is_ok());
    }
}
