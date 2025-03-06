use uuid::Uuid;

mod macros;

pub mod fields;

pub mod package;
pub mod user;

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
