package main

import (
	"github.com/bricklou/kubestro-api/pkg/args"
	_ "github.com/bricklou/kubestro-api/pkg/controllers"
	"github.com/bricklou/kubestro-api/pkg/environment"
	"github.com/bricklou/kubestro-api/pkg/k8s"
	"github.com/bricklou/kubestro-api/pkg/router"
	"k8s.io/klog/v2"
)

func main() {
	klog.InfoS("Starting kubestro dashboard web", "version", environment.Version)

	k8s.Init()

	klog.V(1).InfoS("Listening and serving on", "address", args.Address())
	if err := router.Router().Run(args.Address()); err != nil {
		klog.Fatal("Router error: %s", err)
	}
}
