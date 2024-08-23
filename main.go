package main

import (
	"ingsoft/initializers"
	"net/http"

	"github.com/gin-gonic/gin"
)

func init() {
	// loadEnvVariables()
	initializers.LoadEnvVariables()
	initializers.ConnectDB()
}

func main() {
	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
		})
	})
	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
