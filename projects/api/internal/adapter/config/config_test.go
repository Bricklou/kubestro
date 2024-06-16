package config

import (
	"errors"
	"reflect"
	"strings"
	"testing"
)

func Test_CreateNewConfig_ShouldNotThrowErrors(t *testing.T) {
	_, err := New()

	if err != nil {
		t.Fatalf("Config creation throw the error %v", err)
	}
}

func Test_CreateNewConfig_WithoutTrustedProxiesEnv_ShouldBeEmpty(t *testing.T) {
	actual, _ := New()

	if actual.HTTP.TrustedProxies != nil {
		t.Fatalf("HTTP.TrustedProxies = %v, want nil value", actual.HTTP.TrustedProxies)
	}
}

func Test_CreateNewConfig_WithoutUrl_ShouldBeDefaulted(t *testing.T) {
	t.Setenv("HTTP_URL", "")

	actual, _ := New()

	const wantedUrl = "0.0.0.0"
	if actual.HTTP.Url != wantedUrl {
		t.Fatalf("HTTP.Url = %q, want %q", actual.HTTP.Url, wantedUrl)
	}
}

func Test_CreateNewConfig_WithoutPort_ShouldBeDefaulted(t *testing.T) {
	t.Setenv("HTTP_PORT", "")

	actual, _ := New()

	const wantedPort = "8001"
	if actual.HTTP.Port != wantedPort {
		t.Fatalf("HTTP.Port = %q, want %q", actual.HTTP.Port, wantedPort)
	}
}

func Test_CreateNewConfig_WithInvalidProxies_ShouldReturnAnError(t *testing.T) {
	var proxies = []string{"toto"}
	t.Setenv("HTTP_TRUSTED_PROXIES", strings.Join(proxies, ","))

	_, err := New()
	if err == nil {
		t.Fatalf("expected error not be nil, but was nil")
	}

	var actualError *InvalidIpError
	if !errors.As(err, &actualError) {
		t.Fatalf("expected error to be InvalidIpError, but go %v", err)
	}

	if actualError.Value != "toto" {
		t.Fatalf("expected error value to be %v, but go %v", "toto", actualError.Value)
	}
}

func Test_CreateNewConfig_WithTrustedProxies_ShouldBeAnArray(t *testing.T) {
	var proxies = []string{"127.0.0.1/24", "192.168.1.1/16", "10.0.0.1/32"}
	t.Setenv("HTTP_TRUSTED_PROXIES", strings.Join(proxies, ","))

	actual, _ := New()
	if !reflect.DeepEqual(actual.HTTP.TrustedProxies, proxies) {
		t.Fatalf("HTTP.TrustedProxies = %q, want %q", actual.HTTP.TrustedProxies, proxies)
	}
}
