use std::{future::Future, pin::Pin, task::Poll};

use axum::{
    http::Request,
    response::{IntoResponse, Response},
};
use tower::{Layer, Service};

use crate::app::{
    context::{AppContext, ServiceStatus},
    http::helpers::errors::ApiError,
};

/// Create `SetupLayer` middleware, which will be used to prevent unauthorized access to the setup
/// endpoint.
#[derive(Debug, Clone, Copy)]
pub struct SetupLayer {
    /// Whether the setup state needs to be "installed".
    /// Check [ServiceStatus] for more information.
    needs_setup: bool,
}

impl SetupLayer {
    /// Create a new `SetupLayer` middleware.
    /// Will allow requests only if the app is installed.
    pub const fn setup_needed() -> Self {
        Self { needs_setup: true }
    }

    /// Create a new `SetupLayer` middleware.
    /// Will allow requests only if the app is not installed.
    pub const fn setup_not_needed() -> Self {
        Self { needs_setup: false }
    }
}

impl<S> Layer<S> for SetupLayer {
    type Service = SetupService<S>;

    fn layer(&self, inner: S) -> Self::Service {
        SetupService {
            inner,
            needs_setup: self.needs_setup,
        }
    }
}

/// `Setup` middleware service, which will be used to prevent unauthorized access to the setup
/// endpoint.
#[derive(Debug, Clone, Copy)]
pub struct SetupService<T> {
    /// Inner service.
    inner: T,
    /// Whether the setup state needs to be "installed".
    /// Check [ServiceStatus] for more information.
    needs_setup: bool,
}

impl<B, S> Service<Request<B>> for SetupService<S>
where
    S: Service<Request<B>, Response = Response> + Clone + Send + 'static,
    S::Future: Send + 'static,
    S::Response: 'static,
    B: std::fmt::Debug + Send + 'static,
{
    type Response = S::Response;
    type Error = S::Error;
    type Future = Pin<Box<dyn Future<Output = Result<Self::Response, Self::Error>> + Send>>;

    fn poll_ready(&mut self, cx: &mut std::task::Context<'_>) -> Poll<Result<(), Self::Error>> {
        self.inner.poll_ready(cx).map_err(Into::into)
    }

    fn call(&mut self, req: Request<B>) -> Self::Future {
        println!("request = {:?}, required = {:?}", req, self.needs_setup);

        let needs_setup = self.needs_setup;
        let shared_state = req
            .extensions()
            .get::<AppContext>()
            .unwrap()
            .shared_state
            .clone();

        let fut = self.inner.call(req);

        let f = async move {
            // Scope the lock guard to drop it before the await
            let status = {
                let shared_state = match shared_state.read() {
                    Ok(shared_state) => shared_state,
                    Err(e) => {
                        error!("Failed to acquire shared state lock: {}", e);
                        return Ok(ApiError::unexpected_error(e.to_string()).into_response());
                    }
                };
                shared_state.status.clone()
            }; // Lock guard is dropped here

            // If the middleware require the app to be setup
            if needs_setup && status == ServiceStatus::NotInstalled {
                return Ok(ApiError::forbidden(
                    "This action require the application to be installed in order to use it.",
                )
                .into_response());
            }

            if !needs_setup && status == ServiceStatus::Installed {
                return Ok(ApiError::forbidden(
                    "This action is only permitted when the application is not installed.",
                )
                .into_response());
            }

            fut.await
        };

        Box::pin(f)
    }
}
