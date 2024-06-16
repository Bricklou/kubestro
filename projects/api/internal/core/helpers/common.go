package helpers

import "os"

// Getenv - Lookup the environment variable provided and set to default value if variable isn't found
func Getenv(key string, fallback string) string {
	if value := os.Getenv(key); len(value) > 0 {
		return value
	}

	return fallback
}
