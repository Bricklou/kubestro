use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use kubestro_core_domain::{
    models::fields::password::Password,
    ports::hasher::{Hasher, HasherError},
};

#[derive(Default)]
pub struct Argon2Hasher<'a> {
    argon2: Argon2<'a>,
}

impl Hasher for Argon2Hasher<'_> {
    #[tracing::instrument(skip(self, value))]
    fn hash(&self, value: &str) -> Result<String, HasherError> {
        let salt = SaltString::generate(&mut OsRng);

        let hash = self
            .argon2
            .hash_password(value.as_bytes(), &salt)
            .map_err(|err| HasherError::HashError(err.to_string()))?;

        Ok(hash.to_string())
    }

    #[tracing::instrument(skip(self, value, hash))]
    fn verify(&self, value: &str, hash: &Password) -> Result<(), HasherError> {
        let hash = PasswordHash::new(hash.value())
            .map_err(|err| HasherError::VerifyError(err.to_string()))?;

        self.argon2
            .verify_password(value.to_string().as_bytes(), &hash)
            .map_err(|err| HasherError::VerifyError(err.to_string()))
    }
}
