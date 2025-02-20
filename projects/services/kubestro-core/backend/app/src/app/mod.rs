use context::{create_app_context, AppContext, ServiceStatus};
use kubestro_core_domain::{
    models::fields::{email::Email, username::Username},
    services::auth::local_auth::RegisterUserPayload,
};
use tokio::{signal, sync::mpsc};
use tokio_util::sync::CancellationToken;

mod context;
mod http;
mod k8s;
mod services;

/// Start the Kubestro Core application
pub async fn start() -> anyhow::Result<()> {
    info!("Welcome to Kubestro Core!");

    // Create the application context
    let app_context = create_app_context().await?;

    // Run the application initialization logic
    init_app(app_context.clone()).await?;

    // Run the application
    run_app(app_context).await?;

    Ok(())
}

/// Initialize the application
///
/// This function will try to check if the application has already been setup and if
/// the admin user exists. Otherwise, it will do the necessary setup.
async fn init_app(ctx: AppContext) -> anyhow::Result<()> {
    // Check if the admin user exists
    let user_repo = ctx.user_repo.clone();
    let local_auth = ctx.local_auth.clone();

    // Check if the admin user exists
    debug!("Checking if `admin` user exists...");
    let admin_user = user_repo.find_by_username("admin").await?;

    // If there is no admin user
    if admin_user.is_none() {
        // Try to check if env vars are set
        let admin_email = std::env::var("ADMIN_EMAIL").ok();
        let admin_password = std::env::var("ADMIN_PASSWORD").ok();

        let admin_email = admin_email.unwrap_or("admin@acme.com".to_string());

        // If the password is set
        if let Some(password) = admin_password {
            // Since the password is set, we can try to create the admin user
            warn!("`admin` user not found. Creating `admin` user with the password from the `ADMIN_PASSWORD` env var...");

            // Create the admin user
            let register_user = RegisterUserPayload {
                username: Username::try_from("admin".to_string())?,
                email: Email::try_from(admin_email)?,
                password: password.into(),
            };
            local_auth.register(register_user).await?;

            {
                let mut shared_state_lock = ctx
                    .shared_state
                    .write()
                    .map_err(|e| anyhow::anyhow!("Failed to acquire shared state lock: {}", e))?;
                shared_state_lock.status = ServiceStatus::Installed;
            }

            return Ok(());
        }

        // When the password is not set, we will just log a warning and put the system
        // in the `NotInstalled` state
        warn!(
            "`admin` user not found. Please set the `ADMIN_PASSWORD` env var to create the `admin` user. \
            Alternatively, you can create the user manually through the dashboard."
        );

        {
            let mut shared_state_lock = ctx
                .shared_state
                .write()
                .map_err(|e| anyhow::anyhow!("Failed to acquire shared state lock: {}", e))?;
            shared_state_lock.status = ServiceStatus::NotInstalled;
        }

        return Ok(());
    }

    // If the admin user exists, do nothing
    info!("System already installed, skipping setup...");

    // Set the status to `Installed`
    let mut shared_state_lock = ctx
        .shared_state
        .write()
        .map_err(|e| anyhow::anyhow!("Failed to acquire shared state lock: {}", e))?;
    shared_state_lock.status = ServiceStatus::Installed;

    Ok(())
}

/// Run the application
async fn run_app(ctx: AppContext) -> anyhow::Result<()> {
    // Create a new CancellationToken, which will be used to signal the shutdown
    let shutdown_token = CancellationToken::new();
    // Clone the token for use in tasks
    let http_shutdown_token = shutdown_token.clone();
    let k8s_shutdown_token = shutdown_token.clone();

    // Create a mpsc channel to send shutdown signal
    let (_shutdown_send, mut shutdown_recv) = mpsc::unbounded_channel::<()>();

    // Spawn the HTTP server tasks
    let app_context_http = ctx.clone();
    let http_handle = tokio::spawn(async move {
        http::start_http_server(http_shutdown_token, app_context_http).await
    });
    let k8s_handle =
        tokio::spawn(async move { k8s::start_k8s_loop(k8s_shutdown_token, ctx.clone()).await });

    // Handle shutdown signal
    tokio::select! {
        _ = signal::ctrl_c() => {
            info!("Received ctrl-c signal, shutting down...");
        },
        _ = shutdown_recv.recv() => {
            info!("Received shutdown signal, shutting down...");
        }
    }

    // Signal all tasks to shut down
    shutdown_token.cancel();

    // Wait for all tasks to complete
    http_handle.await??;
    k8s_handle.await??;

    info!("All tasks have completed, shutting down...");

    Ok(())
}
