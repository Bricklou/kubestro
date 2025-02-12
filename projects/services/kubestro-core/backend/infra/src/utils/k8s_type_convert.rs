use serde::{Deserialize, Deserializer};

pub fn bool_from_str<'de, D: Deserializer<'de>>(deserializer: D) -> Result<bool, D::Error> {
    let s: String = Deserialize::deserialize(deserializer)?;
    match s.as_str() {
        "true" => Ok(true),
        "false" => Ok(false),
        _ => Err(serde::de::Error::custom("invalid boolean")),
    }
}

pub fn bool_to_str<S: serde::Serializer>(b: &bool, serializer: S) -> Result<S::Ok, S::Error> {
    serializer.serialize_str(if *b { "true" } else { "false" })
}
