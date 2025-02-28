use std::collections::HashMap;

use axum::{http::StatusCode, response::IntoResponse, Extension, Json};
use deserr::Deserr;
use kubestro_core_domain::models::user::UserProvider;
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use validator::Validate;

use crate::app::{
    context::AppContext,
    http::{
        helpers::{
            errors::ApiError,
            validation::{not_empty::validate_not_empty, ValidatedJson},
        },
        middlewares::auth::RequireAuth,
    },
};

use super::SETTINGS_TAG;

/// Password security update payload
#[derive(Deserialize, Deserr, ToSchema, Validate, Debug)]
pub(super) struct PasswordUpdatePayload {
    #[validate(
        custom(
            function = "validate_not_empty",
            message = "Current password is required"
        ),
        length(min = 8, message = "Password must be at least 8 characters long")
    )]
    pub current_password: String,

    #[validate(
        custom(function = "validate_not_empty", message = "New password is required"),
        length(min = 8, message = "Password must be at least 8 characters long")
    )]
    pub new_password: String,

    #[validate(
        custom(
            function = "validate_not_empty",
            message = "Confirm password is required"
        ),
        length(min = 8, message = "Password must be at least 8 characters long"),
        must_match(other = "new_password", message = "Passwords do not match")
    )]
    pub confirm_password: String,
}

/// Password security update response
#[derive(Serialize, ToSchema)]
pub(super) struct PasswordUpdateResponse {
    success: bool,
}

#[utoipa::path(
    method(put),
    path = "/api/v1.0/settings/password",
    summary = "Update password",
    description = "Update the user password",
    tag = SETTINGS_TAG,

    request_body(content = PasswordUpdatePayload, content_type = "application/json"),
    responses(
        (status = OK, description = "Password updated", body = PasswordUpdateResponse, example = json!({
            "success": true
        })),
        (status = BAD_REQUEST, description = "Invalid input data", body = ApiError, example = json!({
            "status": 400,
            "title": "Validation error",
            "detail": "The request body is invalid",
            "code": "VALIDATION_ERROR",
            "error": "Failed to parse the request body as JSON: trailing comma at line 4 column 1"
        })),
        (status = UNAUTHORIZED, description = "Unauthorized", body = ApiError, example = json!({
            "status": 401,
            "title": "Unauthorized",
            "detail": "Unauthorized",
            "code": "UNAUTHORIZED"
        })),
    )
)]
pub async fn handler_update_password(
    Extension(ctx): Extension<AppContext>,
    Extension(RequireAuth(user)): Extension<RequireAuth>,
    ValidatedJson(input): ValidatedJson<PasswordUpdatePayload>,
) -> Result<Json<PasswordUpdateResponse>, ApiError> {
    // Ensure the user isn't logged in through a provider
    if user.provider != UserProvider::Local || user.password.is_none() {
        return Err(ApiError::forbidden(
            "External users cannot change their password",
        ));
    }

    // NOTE: This is safe to unwrap because we checked if the password is None
    let current_password = user.password.as_ref().unwrap();

    // Check if the current password is correct
    ctx.local_auth
        .verify_password(&input.current_password, current_password)
        .await?;

    // Now, check if the password actually changed
    if input.new_password == input.current_password {
        let mut fields = HashMap::new();
        fields.insert("password".into(), "New password must be different".into());
        return Err(ApiError::conflict("New password must be different", fields));
    }

    // Update the password
    ctx.local_auth
        .update_password(user, &input.new_password)
        .await?;

    Ok(Json(PasswordUpdateResponse { success: true }))
}
