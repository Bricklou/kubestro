package k8s

import (
	"github.com/bricklou/kubestro-api/internal/adapter/config"
	"github.com/bricklou/kubestro-api/internal/core/environment"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/klog/v2"
)

var client *kubernetes.Clientset

func Init(k8sConfig *config.Kubernetes) {

	var config *rest.Config
	var err error

	if k8sConfig.KubeConfig != "" {
		klog.InfoS("Kube config path specified :", "kubeconfig", k8sConfig.KubeConfig)
		config, err = clientcmd.BuildConfigFromFlags("", k8sConfig.KubeConfig)
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
