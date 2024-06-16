package main

import (
	"fmt"
	"log/slog"
	"os"

	_ "github.com/bricklou/kubestro-api/docs"
	"github.com/bricklou/kubestro-api/internal/adapter/config"
	"github.com/bricklou/kubestro-api/internal/adapter/handler/http"
	"github.com/bricklou/kubestro-api/internal/adapter/logger"
	"github.com/bricklou/kubestro-api/internal/core/environment"
	"k8s.io/klog/v2"
)

//	@title						Kubestro API
//	@version					1.0
//	@description				This is the Kubestro API server. It serves as the backend for the Kubestro dashboard to deploy Minecraft
//
// servers on Kubernetes.
//
//	@license.name				MIT
//	@license.url				https://github.com/Bricklou/kubestro/blob/main/LICENSE
//
//	@host						localhost:8080
//	@BasePath					/
//	@schemes					http https
//
//	@securityDefinitions.apikey	BearerAuth
//	@in							header
//	@name						Authorization
//	@description				Type "Bearer" followed by a space and the access token
func main() {
	// Load environment variables
	appConfig, err := config.New()
	if err != nil {
		klog.Fatal(err)
		os.Exit(1)
	}

	// Set logger
	logger.Set(appConfig.App)

	slog.Info("Starting kubestro dashboard web",
		"app", appConfig.App.Name,
		"env", appConfig.App.Env,
		"version", environment.Version,
	)

	// Dependency injection

	// Init router
	router, err := http.NewRouter(
		appConfig.HTTP,
	)
	if err != nil {
		slog.Error("Error initializing router", "error", err)
		os.Exit(1)
	}

	// Start server
	listenAddr := fmt.Sprintf("%s:%s", appConfig.HTTP.Url, appConfig.HTTP.Port)
	slog.Info("Starting server", "address", listenAddr)
	err = router.Serve(listenAddr)
	if err != nil {
		slog.Error("Error starting the HTTP server", "error", err)
		os.Exit(1)
	}
}
