use anyhow::Result;
use axum::{Extension, Json};
use kubestro_core_domain::models::{
    pagination::{PaginationOptions, SortOrder},
    user::{UsersFilters, UsersSortField},
};
use serde::{Deserialize, Serialize};
use serde_qs::axum::QsQuery;
use utoipa::{IntoParams, ToSchema};

use crate::app::{
    context::AppContext,
    http::{
        dto::{
            pagination::PaginationOrder,
            user_dto::{UserDto, UserProviderDto, UserStatusDto, UsersSortFieldDto},
        },
        helpers::errors::ApiError,
    },
};

/// Users filters
#[derive(Deserialize, Debug, ToSchema)]
pub(crate) struct RequestUsersFilters {
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub search: Option<String>,

    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provider: Vec<UserProviderDto>,

    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub status: Vec<UserStatusDto>,
}

impl From<RequestUsersFilters> for UsersFilters {
    fn from(filters: RequestUsersFilters) -> Self {
        Self {
            search: filters.search,
            provider: filters.provider.into_iter().map(Into::into).collect(),
            status: filters.status.into_iter().map(Into::into).collect(),
        }
    }
}

/// Get user request params
#[derive(Deserialize, IntoParams, Debug)]
pub(crate) struct GetUsersParams {
    page: Option<u64>,
    limit: Option<u64>,

    #[serde(default, flatten)]
    filters: RequestUsersFilters,

    #[serde(default, flatten, skip_serializing_if = "Option::is_none")]
    order: Option<PaginationOrder<UsersSortFieldDto>>,
}

/// Get users response
#[derive(Serialize, ToSchema)]
pub(super) struct GetUsersResponse {
    items: Vec<UserDto>,
    pub total_items: u64,
    pub total_pages: u64,
}

#[utoipa::path(
    method(get),
    path = "/api/v1.0/admin/users",
    summary = "Get users",
    description = "Get users list",

    responses(
        (status = OK, description = "Users list", body = GetUsersResponse, example = json!({
            "users": [
                {
                    "id": "1",
                    "email": "john.doe@example.com",
                    "username" : "john.doe",
                    "created_at": "2021-08-31T12:00:00Z",
                    "updated_at": "2021-08-31T12:00:00Z",
                    "provider": "local"
                },
            ]
        })),
    ),
)]
pub async fn handler_get_users(
    Extension(ctx): Extension<AppContext>,
    QsQuery(params): QsQuery<GetUsersParams>,
) -> Result<Json<GetUsersResponse>, ApiError> {
    let order: Option<(UsersSortFieldDto, SortOrder)> = params.order.map(Into::into);

    let pagination_options: PaginationOptions<UsersFilters, UsersSortField> = PaginationOptions {
        limit: params.limit.unwrap_or(10),
        page: params.page.unwrap_or(1),
        filters: params.filters.into(),
        order: order.map(|(field, order)| (field.into(), order)),
        ..Default::default()
    };
    let data = ctx.user_repo.paginate_users(pagination_options).await?;

    Ok(Json(GetUsersResponse {
        items: data.items.into_iter().map(UserDto::from).collect(),
        total_items: data.total_items,
        total_pages: data.total_pages,
    }))
}
