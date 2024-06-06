package args

import (
	"flag"
	"fmt"
	"github.com/bricklou/kubestro-api/pkg/helpers"
	"github.com/spf13/pflag"
	"k8s.io/klog/v2"
	"net"
)

var (
	argNamespace   = pflag.String("namespace", helpers.GetEnv("POD_NAMESPACE", "kubestro-dashboard"), "Namespace to use when creating Dashboard specific resources, i.e. settings config map")
	argBindAddress = pflag.IP("bind-address", net.IPv4(0, 0, 0, 0), "IP address on which to serve the --port, set to 0.0.0.0 for all interfaces")
	argPort        = pflag.Int("port", 8001, "port to listen to for incoming HTTP requests")
	argKubeconfig  = pflag.String("kubeconfig", "", "Path to kubeconfig file")
)

func init() {
	// Init klog
	fs := flag.NewFlagSet("", flag.PanicOnError)
	klog.InitFlags(fs)

	// Default log level to 1
	_ = fs.Set("v", "1")

	pflag.CommandLine.AddGoFlagSet(fs)
	pflag.Parse()
}

func Namespace() string {
	return *argNamespace
}

func BindAddress() net.IP {
	return *argBindAddress
}

func Address() string {
	return fmt.Sprintf("%s:%d", BindAddress(), Port())
}
func Port() int {
	return *argPort
}

func KubeconfigPath() string {
	return *argKubeconfig
}
