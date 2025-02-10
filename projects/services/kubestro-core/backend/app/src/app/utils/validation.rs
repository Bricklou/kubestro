use std::{borrow::Cow, collections::HashMap, ops::ControlFlow};

use axum::{
    extract::{rejection::JsonRejection, FromRequest, Request},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use deserr::{
    axum::{AxumJson, AxumJsonRejection},
    DeserializeError, MergeWithError, Sequence, ValuePointerRef,
};
use serde::Serialize;
use validator::{Validate, ValidationErrorsKind};

use super::errors::ApiError;

/// A type alias for `AxumJson` with `ApiDeserrError` as the rejection type.
pub type ApiDeserrJson<T> = AxumJson<T, ApiDeserrError>;

/// A type representing a JSON validation error. This is a custom error
/// type used for `deserr` AxumJson deserialization errors.
#[derive(Debug, Serialize, Clone, PartialEq)]
pub struct JsonValidationError {
    pub detail: String,
    #[serde(skip)]
    pub pointer: String,

    pub code: String,
    #[serde(skip_serializing_if = "HashMap::is_empty")]
    pub params: HashMap<Cow<'static, str>, serde_json::Value>,
}

/// A type representing a deserialization error. This is a custom error
/// type used for `deserr` AwebJson deserialization errors.
#[derive(Debug, Serialize, Clone)]
pub struct ApiDeserrError(HashMap<String, JsonValidationError>);

impl std::fmt::Display for ApiDeserrError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

impl DeserializeError for ApiDeserrError {
    fn error<V: deserr::IntoValue>(
        self_: Option<Self>,
        error: deserr::ErrorKind<V>,
        location: deserr::ValuePointerRef,
    ) -> std::ops::ControlFlow<Self, Self> {
        let error: JsonValidationError = match error {
            deserr::ErrorKind::IncorrectValueKind { actual, accepted } => {
                let accepted = accepted
                    .iter()
                    .map(|kind| map_value_kind_to_string(*kind))
                    .collect::<Vec<String>>();

                JsonValidationError {
                    code: "incorrect_value_kind".into(),
                    pointer: value_pointer_ref_to_string(location),
                    detail: format!(
                        "Incorrect value kind. Expected one of: [{}], got: {}",
                        accepted.join(", "),
                        map_value_kind_to_string(actual.kind())
                    ),
                    params: [
                        (
                            "actual".into(),
                            map_value_kind_to_string(actual.kind()).into(),
                        ),
                        ("expected".into(), accepted.into()),
                    ]
                    .into(),
                }
            }
            deserr::ErrorKind::MissingField { field } => {
                let tmp_loc = location.push_key(field);

                JsonValidationError {
                    code: "missing_field".into(),
                    pointer: value_pointer_ref_to_string(tmp_loc),
                    detail: format!("The field '{}' is required", field),
                    params: [].into(),
                }
            }
            deserr::ErrorKind::UnknownValue { value, accepted } => JsonValidationError {
                code: "unknown_value".into(),
                pointer: value_pointer_ref_to_string(location),
                detail: format!(
                    "Unknown value. Expected one of: [{}], got: {}",
                    accepted.join(", "),
                    value
                ),
                params: [
                    ("value".into(), value.into()),
                    ("accept".into(), accepted.into()),
                ]
                .into(),
            },
            deserr::ErrorKind::UnknownKey { key, accepted } => {
                let tmp_loc = location.push_key(key);
                JsonValidationError {
                    code: "unknown_key".into(),
                    pointer: value_pointer_ref_to_string(tmp_loc),
                    detail: format!(
                        "Unknown key. Expected one of: {}, got: {}",
                        accepted.join(", "),
                        key
                    ),
                    params: [
                        ("key".into(), key.into()),
                        ("expected".into(), accepted.into()),
                    ]
                    .into(),
                }
            }
            deserr::ErrorKind::Unexpected { msg } => JsonValidationError {
                code: "unexpected".into(),
                pointer: value_pointer_ref_to_string(location),
                detail: msg,
                params: HashMap::new(),
            },
            deserr::ErrorKind::BadSequenceLen { actual, expected } => JsonValidationError {
                code: "bad_sequence_len".into(),
                pointer: value_pointer_ref_to_string(location),
                detail: format!(
                    "Bad sequence length. Expected: {}, got: {}",
                    expected,
                    actual.len()
                ),
                params: [
                    ("actual".into(), actual.len().into()),
                    ("expected".into(), expected.into()),
                ]
                .into(),
            },
        };

        let key = error.pointer.clone();
        let errors = if let Some(ApiDeserrError(mut api_errors)) = self_ {
            api_errors.insert(key, error);
            api_errors
        } else {
            HashMap::from_iter([(key, error)].iter().cloned())
        };

        ControlFlow::Continue(ApiDeserrError(errors))
    }
}

impl IntoResponse for ApiDeserrError {
    fn into_response(self) -> axum::response::Response {
        ApiError::from(self).into_response()
    }
}

impl MergeWithError<ApiDeserrError> for ApiDeserrError {
    fn merge(
        self_: Option<Self>,
        other: ApiDeserrError,
        _merge_location: deserr::ValuePointerRef,
    ) -> ControlFlow<Self, Self> {
        let mut other = other.clone();

        if let Some(ApiDeserrError(errors)) = self_ {
            other.0.extend(errors);
        }
        ControlFlow::Continue(other)
    }
}

impl From<ApiDeserrError> for ApiError {
    fn from(value: ApiDeserrError) -> Self {
        let errors = value.0;

        let errors = serde_json::to_value(errors).unwrap();

        let mut extensions = HashMap::<Cow<'static, str>, serde_json::Value>::new();
        extensions.insert("errors".into(), errors);

        ApiError {
            _type: None,
            status: StatusCode::UNPROCESSABLE_ENTITY,
            title: "Validation error".into(),
            detail: Some("The request body is invalid".into()),
            code: "VALIDATION_ERROR".into(),
            instance: None,
            extensions,
        }
    }
}

pub fn value_pointer_ref_to_string(location: ValuePointerRef) -> String {
    match location {
        ValuePointerRef::Origin => "#".to_string(),
        ValuePointerRef::Key { key, prev } => value_pointer_ref_to_string(*prev) + "/" + key,
        ValuePointerRef::Index { index, prev } => {
            value_pointer_ref_to_string(*prev) + "/" + &index.to_string()
        }
    }
}

fn map_value_kind_to_string(value: deserr::ValueKind) -> String {
    match value {
        deserr::ValueKind::Null => "null".to_string(),
        deserr::ValueKind::Boolean => "boolean".to_string(),
        deserr::ValueKind::Integer => "integer".to_string(),
        deserr::ValueKind::NegativeInteger => "negative_integer".to_string(),
        deserr::ValueKind::Float => "float".to_string(),
        deserr::ValueKind::String => "string".to_string(),
        deserr::ValueKind::Sequence => "array".to_string(),
        deserr::ValueKind::Map => "object".to_string(),
    }
}

fn map_kind_to_error(
    field_pointer: ValuePointerRef,
    kind: &ValidationErrorsKind,
) -> HashMap<String, JsonValidationError> {
    let mut errors = HashMap::<String, JsonValidationError>::new();

    match kind {
        ValidationErrorsKind::Field(field_error) => {
            for error in field_error.clone() {
                let mut params = error.params;

                if error.code == "must_match" {
                    params.remove("other");
                }
                params.remove("value");

                let key = value_pointer_ref_to_string(field_pointer);
                errors.insert(
                    key,
                    JsonValidationError {
                        detail: error
                            .message
                            .unwrap_or("No message provided".into())
                            .into_owned(),
                        pointer: value_pointer_ref_to_string(field_pointer),
                        code: error.code.to_string(),
                        params,
                    },
                );
            }
        }
        ValidationErrorsKind::List(list_error) => {
            for (index, kind) in list_error.iter() {
                let index_ptr = field_pointer.push_index(*index);

                for (field, kind) in kind.errors() {
                    let list_item_ptr = index_ptr.push_key(field);
                    errors.extend(map_kind_to_error(list_item_ptr, kind));
                }
            }
        }
        ValidationErrorsKind::Struct(struct_error) => {
            for (field, kind) in struct_error.errors() {
                let struct_field_ptr = field_pointer.push_key(field);
                errors.extend(map_kind_to_error(struct_field_ptr, kind));
            }
        }
    }

    errors
}

impl From<validator::ValidationErrors> for ApiError {
    fn from(validation_error: validator::ValidationErrors) -> Self {
        let mut extensions = HashMap::<Cow<'static, str>, serde_json::Value>::new();

        let mut errors = HashMap::<String, JsonValidationError>::new();

        for (field, errors_kind) in validation_error.0 {
            let loc = ValuePointerRef::Origin.push_key(&field);
            let field_errors = map_kind_to_error(loc, &errors_kind);
            errors.extend(field_errors);
        }

        let errors = serde_json::to_value(errors).unwrap();
        extensions.insert("errors".into(), errors);

        ApiError {
            _type: None,
            status: StatusCode::UNPROCESSABLE_ENTITY,
            title: "Validation error".into(),
            detail: Some("The request body is invalid".into()),
            code: "VALIDATION_ERROR".into(),
            instance: None,
            extensions,
        }
    }
}

#[derive(Debug, Clone, Copy, Default)]
pub struct ValidatedJson<T>(pub T);

impl<T, S> FromRequest<S> for ValidatedJson<T>
where
    T: deserr::Deserr<ApiDeserrError> + Validate,
    S: Send + Sync,
    // ApiDeserrJson<T>: FromRequest<S, Rejection = JsonRejection>,
    Json<T>: FromRequest<S, Rejection = JsonRejection>,
{
    type Rejection = ApiError;

    async fn from_request(req: Request, state: &S) -> Result<Self, Self::Rejection> {
        let value = ApiDeserrJson::<T>::from_request(req, state)
            .await
            .map_err(|e| match e {
                AxumJsonRejection::JsonRejection(er) => ApiError::from(er),
                AxumJsonRejection::DeserrError(er) => er.into(),
            })?
            .into_inner();
        value.validate()?;
        Ok(ValidatedJson(value))
    }
}

impl From<JsonRejection> for ApiError {
    fn from(value: JsonRejection) -> Self {
        let mut extensions = HashMap::<Cow<'static, str>, serde_json::Value>::new();

        match value {
            JsonRejection::JsonDataError(e) => {
                extensions.insert("error".into(), e.to_string().into());
            }
            JsonRejection::MissingJsonContentType(e) => {
                extensions.insert("error".into(), e.to_string().into());
            }
            JsonRejection::JsonSyntaxError(e) => {
                extensions.insert("error".into(), e.to_string().into());
            }
            JsonRejection::BytesRejection(e) => {
                extensions.insert("error".into(), e.to_string().into());
            }
            _ => {}
        }

        ApiError {
            _type: None,
            status: StatusCode::BAD_REQUEST,
            title: "Validation error".into(),
            detail: Some("The request body is invalid".into()),
            code: "VALIDATION_ERROR".into(),
            instance: None,
            extensions,
        }
    }
}
