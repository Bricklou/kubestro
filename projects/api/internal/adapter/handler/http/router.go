package http

import (
	"log/slog"
	"strings"

	"github.com/bricklou/kubestro-api/internal/adapter/config"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	sloggin "github.com/samber/slog-gin"
)

// Router is a wrapper for HTTP router
type Router struct {
	*gin.Engine
}

// NewRouter creates a new HTTP router
func NewRouter(
	httpConfig *config.HTTP,
) (*Router, error) {
	// Disable debug mode in production
	if httpConfig.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// CORS
	ginConfig := cors.DefaultConfig()
	allowedOrigins := httpConfig.AllowedOrigins
	originsList := strings.Split(allowedOrigins, ",")
	ginConfig.AllowOrigins = originsList

	router := gin.New()
	_ = router.SetTrustedProxies(httpConfig.TrustedProxies)
	router.Use(sloggin.New(slog.Default()), gin.Recovery(), cors.New(ginConfig))

	return &Router{router}, nil
}

// Serve starts the HTTP server
func (r *Router) Serve(addr string) error {
	return r.Run(addr)
}
