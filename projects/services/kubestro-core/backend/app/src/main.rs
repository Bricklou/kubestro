use tracing_subscriber::{fmt, layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

#[macro_use]
extern crate tracing;

mod app;

#[tokio::main]
async fn main() {
    // This returns an error if the `.env` file doesn't exist, but that's not what we want
    // since we're not going to use a `.env` file if we deploy this application.
    dotenvy::dotenv().ok();

    #[cfg(debug_assertions)]
    let trace_layer = fmt::layer().with_target(true).pretty();
    #[cfg(not(debug_assertions))]
    let trace_layer = fmt::layer().with_target(true).json();

    // Install global subscriber configured based on RUST_LOG envvar.
    tracing_subscriber::registry()
        .with(EnvFilter::try_from_default_env().unwrap_or_else(|_| {
            format!("{}=debug,tower_http=debug", env!("CARGO_CRATE_NAME")).into()
        }))
        .with(trace_layer)
        .init();

    match app::start().await {
        Ok(_) => {}
        Err(e) => error!("{}", e),
    }
}
