use uuid::Uuid;

pub mod fields;

pub mod user;

pub mod create_user;

pub trait EntityId: Eq + PartialEq {
    fn new() -> Self;
    fn value(&self) -> Uuid;
}

pub trait Entity<Id>
where
    Id: EntityId,
{
    fn id(&self) -> Id;
}
