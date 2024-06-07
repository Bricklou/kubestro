package namespaces

import (
	"context"
	"github.com/bricklou/kubestro-api/pkg/k8s"
	"github.com/bricklou/kubestro-api/pkg/router"
	"github.com/gin-gonic/gin"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"net/http"
)

func init() {
	router.Root().GET("/api/namespaces", handleGetNamespaces)
}

func handleGetNamespaces(c *gin.Context) {
	nsList, err := k8s.Client().CoreV1().Namespaces().List(context.TODO(), metav1.ListOptions{})

	if err != nil {
		c.JSON(http.StatusInternalServerError, err)
	}

	strNs := make([]string, len(nsList.Items))

	for i := range nsList.Items {
		strNs[i] = nsList.Items[i].Name
	}

	c.JSON(http.StatusOK, map[string]any{
		"message":    "Hello from golang! Here are your kubernetes namespaces.",
		"namespaces": strNs,
	})
}
