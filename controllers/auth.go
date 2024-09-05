package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthController struct {
}

func InitAuthController() *AuthController {
	return &AuthController{}
}

func (ac *AuthController) InitRoutes(router *gin.Engine) {
	routes := router.Group("/auth")
	routes.POST("/login", ac.Nope())
	routes.POST("/register", ac.Nope())
}

func (*AuthController) Nope() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Connected",
		})
	}
}
