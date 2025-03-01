use axum::{Extension, Json};
use serde::Serialize;
use utoipa::ToSchema;

use crate::app::http::{dto::user_dto::UserDto, middlewares::auth::RequireAuth};

use super::AUTHENTICATION_TAG;

#[derive(Serialize, ToSchema)]
pub struct MeResponse {
    user: UserDto,
}

#[utoipa::path(
    method(get),
    path = "/api/v1.0/authentication",
    summary = "Get current user",
    description = "Get the current user",
    tag = AUTHENTICATION_TAG
)]
pub async fn handler_me(Extension(RequireAuth(user)): Extension<RequireAuth>) -> Json<MeResponse> {
    Json(MeResponse { user: user.into() })
}
