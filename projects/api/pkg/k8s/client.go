package k8s

import (
	"github.com/bricklou/kubestro-api/pkg/args"
	"github.com/bricklou/kubestro-api/pkg/environment"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/klog/v2"
)

var client *kubernetes.Clientset

func Init() {

	var config *rest.Config
	var err error

	if args.KubeconfigPath() != "" {
		klog.InfoS("Kube config path specified :", "kubeconfig", args.KubeconfigPath())
		config, err = clientcmd.BuildConfigFromFlags("", args.KubeconfigPath())
	} else {
		// create the in-cluster config
		config, err = rest.InClusterConfig()
	}
	if err != nil {
		panic(err)
	}

	config.UserAgent = environment.UserAgent()

	// creates the clienset
	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		panic(err)
	}

	client = clientset
}

func Client() *kubernetes.Clientset {
	return client
}
