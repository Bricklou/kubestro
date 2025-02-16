use axum::{http::StatusCode, response::IntoResponse, Extension};
use deserr::Deserr;
use kubestro_core_domain::services::auth::local_auth::RegisterUserPayload;
use serde::Deserialize;
use tracing::field::debug;
use utoipa::{OpenApi, ToSchema};
use utoipa_axum::{router::OpenApiRouter, routes};
use validator::Validate;

use crate::app::{
    context::{AppContext, ServiceStatus},
    http::{
        helpers::{errors::ApiError, validation::ValidatedJson},
        middlewares::status::SetupLayer,
    },
};

pub(super) const SETUP_TAG: &str = "setup";

#[derive(OpenApi)]
#[openapi(
    tags(
        (name = SETUP_TAG, description = "Setup API endpoints")
    )
)]
struct ApiDoc;

/// Setup payload
#[derive(Deserialize, Deserr, ToSchema, Validate, Debug)]
pub(super) struct SetupPayload {
    #[validate(email(message = "Invalid email address"))]
    pub email: String,
    #[validate(length(min = 8, message = "Password must be at least 8 characters long"))]
    password: String,
}

/// Setup application route
#[utoipa::path(
    method(head,post),
    path = "/api/v1.0/setup",
    tag = SETUP_TAG,
    responses(
        (status = NO_CONTENT, description = "Success", content_type = "application/json"),
        (status = BAD_REQUEST, description = "Invalid input data", body = ApiError, example = json!({
            "status": 400,
            "title": "Validation error",
            "detail": "The request body is invalid",
            "code": "VALIDATION_ERROR",
            "error": "Failed to parse the request body as JSON: trailing comma at line 4 column 1"
        })),
        (status = CONFLICT, description = "User already exists", body = ApiError, example = json!({
            "status": 409,
            "title": "Conflict",
            "detail": "User already exists",
            "code": "CONFLICT"
        })),
    )
)]
async fn setup(
    Extension(ctx): Extension<AppContext>,
    ValidatedJson(payload): ValidatedJson<SetupPayload>,
) -> Result<impl IntoResponse, ApiError> {
    debug("Setting up application...");

    let user_data = RegisterUserPayload {
        username: "admin".try_into()?,
        email: payload.email.try_into()?,
        password: payload.password.into_boxed_str(),
    };

    ctx.local_auth.register(user_data).await?;

    debug!("Updating application status to installed");
    {
        let mut shared_state_lock = ctx.shared_state.write().map_err(|_| {
            error!("Failed finalize the setup: unable to write shared state");
            ApiError::unexpected_error("Failed to finalize the setup".to_string())
        })?;
        shared_state_lock.status = ServiceStatus::Installed;
    }
    debug!("Application setup completed");

    Ok(StatusCode::NO_CONTENT.into_response())
}

pub fn get_routes() -> OpenApiRouter {
    OpenApiRouter::with_openapi(ApiDoc::openapi())
        .routes(routes!(setup))
        .layer(SetupLayer::setup_not_needed())
}
