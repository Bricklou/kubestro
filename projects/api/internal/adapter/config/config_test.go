package config

import (
	"errors"
	"reflect"
	"strings"
	"testing"
)

func Test_NewConfig_ShouldBeValid(t *testing.T) {
	_, err := NewConfig()

	if err != nil {
		t.Fatalf("NewConfig() => %v, want %v", err, nil)
	}
}

func Test_NewConfig_WithoutTrustedProxiesEnv_ShouldBeEmpty(t *testing.T) {
	actual, _ := NewConfig()

	if actual.HTTP.TrustedProxies != nil {
		t.Fatalf("HTTP.TrustedProxies = %v, want nil value", actual.HTTP.TrustedProxies)
	}
}

func Test_NewConfig_WithoutUrl_ShouldBeDefaulted(t *testing.T) {
	t.Setenv("HTTP_URL", "")

	actual, _ := NewConfig()

	const wantedUrl = "0.0.0.0"
	if actual.HTTP.Url != wantedUrl {
		t.Fatalf("HTTP.Url = %q, want %q", actual.HTTP.Url, wantedUrl)
	}
}

func Test_NewConfig_WithoutPort_ShouldBeDefaulted(t *testing.T) {
	t.Setenv("HTTP_PORT", "")

	actual, _ := NewConfig()

	const wantedPort = "8001"
	if actual.HTTP.Port != wantedPort {
		t.Fatalf("HTTP.Port = %q, want %q", actual.HTTP.Port, wantedPort)
	}
}

func Test_NewConfig_WithInvalidProxies_ShouldReturnAnError(t *testing.T) {
	var proxies = []string{"toto"}
	t.Setenv("HTTP_TRUSTED_PROXIES", strings.Join(proxies, ","))

	_, err := NewConfig()
	if err == nil {
		t.Fatalf("NewConfig() = %v, want %v", err, nil)
	}

	var actualError *InvalidCidrError
	if !errors.As(err, &actualError) {
		t.Fatalf("NewConfig() = %v, want %q", err, reflect.TypeOf(actualError))
	}

	var wantValue = "toto"
	if actualError.Value != wantValue {
		t.Fatalf("NewConfig() = %q, want %q", actualError.Value, wantValue)
	}
}

func Test_NewConfig_WithTrustedProxies_ShouldBeAnArray(t *testing.T) {
	var proxies = []string{"127.0.0.1/24"}
	t.Setenv("HTTP_TRUSTED_PROXIES", strings.Join(proxies, ","))

	actual, _ := NewConfig()
	if !reflect.DeepEqual(actual.HTTP.TrustedProxies, proxies) {
		t.Fatalf("HTTP.TrustedProxies = %q, want %q", actual.HTTP.TrustedProxies, proxies)
	}
}

func Test_NewConfig_WithTrustedProxies_ShouldBeAnArray2(t *testing.T) {
	var proxies = []string{"127.0.0.1/24", "192.168.1.1/16", "10.0.0.1/32"}
	t.Setenv("HTTP_TRUSTED_PROXIES", strings.Join(proxies, ","))

	actual, _ := NewConfig()
	if !reflect.DeepEqual(actual.HTTP.TrustedProxies, proxies) {
		t.Fatalf("HTTP.TrustedProxies = %q, want %q", actual.HTTP.TrustedProxies, proxies)
	}
}
