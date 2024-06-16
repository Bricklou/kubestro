package logger

import (
	"log/slog"
	"os"
	"time"

	"github.com/bricklou/kubestro-api/internal/adapter/config"
	"github.com/go-logr/logr"
	"github.com/lmittmann/tint"
	slogmulti "github.com/samber/slog-multi"
	"k8s.io/klog/v2"
)

// logger is the default logger used by the application
var logger *slog.Logger

// Set sets the logger configuration based on the environment
func Set(config *config.App) {
	logger = slog.New(
		tint.NewHandler(os.Stderr, &tint.Options{
			Level:      slog.LevelDebug,
			TimeFormat: time.DateTime,
		}),
	)

	if config.Env == "production" {
		logrLogger := klog.Background()
		slogHandler := logr.ToSlogHandler(logrLogger)

		logger = slog.New(
			slogmulti.Fanout(
				slogHandler,
				slog.NewTextHandler(os.Stderr, nil),
			),
		)
	}

	slog.SetDefault(logger)
}
