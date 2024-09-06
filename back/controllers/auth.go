package controllers

import (
	"ingsoft/internal/utils"
	"ingsoft/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AuthController struct {
	authService services.AuthService
}

func InitAuthController(authService *services.AuthService) *AuthController {
	return &AuthController{
		authService: *authService,
	}
}

func (ac *AuthController) InitRoutes(router *gin.Engine) {
	routes := router.Group("/auth")
	routes.POST("/login", ac.Login())
	routes.POST("/register", ac.Register())
}

func (*AuthController) Nope() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Connected",
		})
	}
}

func (at *AuthController) Register() gin.HandlerFunc {
	type RegisterBody struct {
		Name     string `json:"name" binding:"required"`
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
		Username string `json:"username" binding:"required"`
		RoleID   int    `json:"role_id"`
	}
	return func(c *gin.Context) {
		var registerbody RegisterBody
		if err := c.BindJSON(&registerbody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		roleID := 1
		user, err := at.authService.Register(&registerbody.Name, &registerbody.Email, &registerbody.Password, &registerbody.Username, &roleID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": user,
		})
	}
}

func (at *AuthController) Login() gin.HandlerFunc {
	type LoginBody struct {
		Email    string `json:"email" min:"6" max:"100"`
		Password string `json:"password" binding:"required" min:"6" max:"255"`
		Username string `json:"username" min:"6" max:"20"`
	}
	return func(c *gin.Context) {
		var loginBody LoginBody
		if err := c.BindJSON(&loginBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Validar que al menos uno de los campos (email o username) esté presente
		if loginBody.Email == "" && loginBody.Username == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "email or username is required"})
			return
		}
		user, err := at.authService.Login(&loginBody.Email, &loginBody.Password, &loginBody.Username)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		var token string

		token, err = utils.GenerateToken(user.Email, user.UserID)

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"message": user,
			"token":   token,
		})
	}
}
