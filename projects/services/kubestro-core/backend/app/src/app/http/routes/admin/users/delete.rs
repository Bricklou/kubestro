use axum::{extract::Path, Extension, Json};
use kubestro_core_domain::models::{user::UserId, Entity};

use crate::app::{
    context::AppContext,
    http::{helpers::errors::ApiError, middlewares::auth::RequireAuth, routes::admin::ADMIN_TAG},
};

#[utoipa::path(
  method(delete),
  path = "/api/v1.0/admin/users/{id}",
  summary = "Delete user",
  tag = ADMIN_TAG,

  params(
    ("id" = String, Path, description = "User database ID"),
  ),

  responses(
    (status = NO_CONTENT, description = "User deleted"),
    (status = FORBIDDEN, body = ApiError, description = "Forbidden"),
    (status = NOT_FOUND, description = "User not found"),
  )
)]
pub async fn handler_delete_user(
    Extension(ctx): Extension<AppContext>,
    Path(user_id): Path<UserId>,
    RequireAuth(current_user): RequireAuth,
) -> Result<Json<()>, ApiError> {
    if current_user.id() == user_id {
        return Err(ApiError::forbidden("You can't delete yourself"));
    }

    ctx.user_repo.delete(&user_id).await?;

    Ok(Json(()))
}
