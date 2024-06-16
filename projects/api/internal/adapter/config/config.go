package config

import (
	"net"
	"os"
	"strings"

	"github.com/bricklou/kubestro-api/internal/core/helpers"
	"github.com/joho/godotenv"
)

// Container contains environment variables for the application, http server and kubernetes client.
type (
	Container struct {
		App        *App
		HTTP       *HTTP
		Kubernetes *Kubernetes
	}

	// App contains all the environment variables for the application
	App struct {
		Env string
	}

	// HTTP contains all the environment variables for the http server
	HTTP struct {
		Env            string
		Url            string
		Port           string
		AllowedOrigins string
		TrustedProxies []string
	}

	// Kubernetes contains all the environment variables for the kubernetes client
	Kubernetes struct {
		Namespace   string
		BindAddress string
		KubeConfig  string
	}
)

// NewConfig creates a new container instance
func NewConfig() (*Container, error) {
	var appEnv = helpers.Getenv("APP_ENV", "production")
	if appEnv != "production" {
		err := godotenv.Load()
		if err != nil {
			return nil, err
		}
	}

	app := &App{
		Env: appEnv,
	}

	trustedProxiesEnv := os.Getenv("HTTP_TRUSTED_PROXIES")
	var trustedProxies []string
	if trustedProxiesEnv == "" {
		trustedProxies = nil
	} else {
		trustedProxies = strings.Split(trustedProxiesEnv, ",")
	}

	for _, value := range trustedProxies {
		_, _, err := net.ParseCIDR(value)
		if err != nil {
			return nil, &InvalidCidrError{
				Value:   value,
				Message: err,
			}
		}
	}

	http := &HTTP{
		Env:            appEnv,
		Url:            helpers.Getenv("HTTP_URL", "0.0.0.0"),
		Port:           helpers.Getenv("HTTP_PORT", "8001"),
		AllowedOrigins: os.Getenv("HTTP_ALLOWED_ORIGINS"),
		TrustedProxies: trustedProxies,
	}

	kubernetes := &Kubernetes{
		Namespace:   helpers.Getenv("KUBE_NAMESPACE", "kubestro"),
		BindAddress: helpers.Getenv("KUBE_BIND_ADDRESS", "0.0.0.0"),
		KubeConfig:  os.Getenv("KUBECONFIG"),
	}

	return &Container{
		App:        app,
		HTTP:       http,
		Kubernetes: kubernetes,
	}, nil
}
