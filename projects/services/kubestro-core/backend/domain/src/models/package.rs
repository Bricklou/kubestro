use crate::impl_entity_id;

use super::Entity;

impl_entity_id!(
    /// Package Id
    PackageId
);

#[derive(Debug, Clone)]
pub struct Package {
    pub id: PackageId,

    pub name: String,
    pub version: String,
    pub description: String,
    pub url: String,
}

impl Entity<PackageId> for Package {
    fn id(&self) -> PackageId {
        self.id.clone()
    }
}

impl_entity_id!(
    /// Repository Id
    RepositoryId
);

#[derive(Debug, Clone)]
pub struct Repository {
    pub id: RepositoryId,

    pub name: String,
    pub url: String,
}

impl Entity<RepositoryId> for Repository {
    fn id(&self) -> RepositoryId {
        self.id.clone()
    }
}

/// Create Repository model
#[derive(Debug, Clone, PartialEq)]
pub struct CreateRepository {
    /// The name of the repository
    pub name: String,
    /// The url of the repository
    pub url: String,
}
