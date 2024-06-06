package router

import (
	"github.com/bricklou/kubestro-api/pkg/environment"
	"github.com/gin-gonic/gin"
)

var (
	router *gin.Engine
	root   *gin.RouterGroup
)

func init() {
	if !environment.IsDev() {
		gin.SetMode(gin.ReleaseMode)
	}

	router = gin.Default()
	_ = router.SetTrustedProxies(nil)

	root = router.Group("/")
}

func Root() *gin.RouterGroup {
	return root
}

func Router() *gin.Engine {
	return router
}
