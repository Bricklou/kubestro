package servers

import (
	"github.com/bricklou/kubestro-api/pkg/router"
	"github.com/gin-gonic/gin"
	"net/http"
)

func init() {
	router.Root().POST("/api/servers", handlePostServer)
}

type CreateServer struct {
	Name string `json:"name" binding:"required"`
	Namespace string `json:"namespace" binding:"required"`
}

func handlePostServer(c *gin.Context) {
	var json CreateServer

	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	println("Server created: ", json.Name, json.Namespace)

	c.JSON(http.StatusOK, gin.H{"message": "Server created", "name": json.Name, "namespace": json.Namespace})
}