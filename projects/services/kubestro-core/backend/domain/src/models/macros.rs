#[macro_export]
macro_rules! impl_entity_id {
    ($(#[$meta:meta])* $name:ident) => {
        $(#[$meta])*
        #[derive(Debug, Clone, serde::Serialize, serde::Deserialize, PartialEq, Eq, Hash)]
        pub struct $name(uuid::Uuid);

        impl $crate::models::EntityId for $name {
            fn new() -> Self {
                Self(uuid::Uuid::new_v4())
            }

            fn value(&self) -> uuid::Uuid {
                self.0
            }
        }

        impl Default for $name {
            fn default() -> Self {
                use $crate::models::EntityId;
                Self::new()
            }
        }

        impl std::fmt::Display for $name {
            fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
                write!(f, "{}", self.0)
            }
        }

        impl From<uuid::Uuid> for $name {
            fn from(id: uuid::Uuid) -> Self {
                Self(id)
            }
        }

        impl TryFrom<String> for $name {
            type Error = uuid::Error;

            fn try_from(value: String) -> Result<Self, Self::Error> {
                uuid::Uuid::parse_str(value.as_str()).map(Self)
            }
        }
    };
    () => {
        // Throw a compiler error
        compile_error!("No type provided for EntityId implementation");
    };
}
