package controllers

import (
	"ingsoft/internal/utils"
	"ingsoft/middleware"
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
	routes.GET("/profile", middleware.CheckMiddleware, ac.Profile())
	routes.PATCH("/profile", middleware.CheckMiddleware, ac.UpdateProfile())        // Ruta para actualizar perfil
	routes.POST("/changepassword", middleware.CheckMiddleware, ac.ChangePassword()) // Ruta para cambiar la contraseña
	routes.DELETE("/deleteaccount", middleware.CheckMiddleware, ac.DeleteAccount()) // Ruta para eliminar cuenta
}

func (*AuthController) Nope() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Connected",
		})
	}
}

// Método para obtener el perfil del usuario
func (at *AuthController) Profile() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Obtiene el userID desde el contexto, que fue establecido en el middleware al verificar el token JWT
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "No authentication token found",
			})
			return
		}

		// Llama al servicio para obtener el perfil del usuario
		user, err := at.authService.Profile(userID.(int))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		// Devuelve la información del usuario
		c.JSON(http.StatusOK, gin.H{
			"message": user,
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

		// Almacenar el token en la cookie de forma segura (HttpOnly: true)
		c.SetCookie(
			"Auth_Cookie", // Nombre de la cookie
			token,         // Valor de la cookie (el token)
			3600*24*30,    // Duración en segundos (30 días)
			"/",           // Ruta (disponible para toda la aplicación)
			"",            // Dominio (vacío significa que se aplica al dominio actual)
			true,          // Secure: solo se enviará a través de HTTPS
			true,          // HttpOnly: no accesible desde JavaScript (más seguro)
		)

		c.JSON(http.StatusOK, gin.H{
			"message": user,
			"token":   token,
		})
	}
}

// Método para actualizar el perfil del usuario
func (at *AuthController) UpdateProfile() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Obtiene el userID desde el contexto, que fue establecido en el middleware al verificar el token JWT
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "No authentication token found",
			})
			return
		}

		// Define la estructura para el cuerpo de la solicitud
		type UpdateProfileBody struct {
			Name        *string `json:"name"`
			Email       *string `json:"email"`
			Username    *string `json:"username"`
			Place       *string `json:"place"`
			PhoneNumber *string `json:"phonenumber"`
			Bio         *string `json:"bio"`
		}

		var updateBody UpdateProfileBody
		if err := c.BindJSON(&updateBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Llama al servicio para actualizar el perfil del usuario
		user, err := at.authService.UpdateProfile(userID.(int), updateBody.Name, updateBody.Email, updateBody.Username, updateBody.Place, updateBody.PhoneNumber, updateBody.Bio)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		// Devuelve la información actualizada del usuario
		c.JSON(http.StatusOK, gin.H{
			"message": user,
		})
	}
}

// Método para cambiar la contraseña del usuario
func (at *AuthController) ChangePassword() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Obtiene el userID desde el contexto, que fue establecido en el middleware al verificar el token JWT
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "No authentication token found",
			})
			return
		}

		// Define la estructura para el cuerpo de la solicitud
		type ChangePasswordBody struct {
			CurrentPassword string `json:"current_password" binding:"required"`
			NewPassword     string `json:"new_password" binding:"required"`
		}

		var changePasswordBody ChangePasswordBody
		if err := c.BindJSON(&changePasswordBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// Llama al servicio para cambiar la contraseña
		err := at.authService.ChangePassword(userID.(int), &changePasswordBody.CurrentPassword, &changePasswordBody.NewPassword)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Password changed successfully",
		})
	}
}

// Método para eliminar la cuenta del usuario
func (at *AuthController) DeleteAccount() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Obtiene el userID desde el contexto, que fue establecido en el middleware al verificar el token JWT
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "No authentication token found",
			})
			return
		}

		// Llama al servicio para eliminar la cuenta del usuario
		err := at.authService.DeleteAccount(userID.(int))
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"message": "Account deleted successfully",
		})
	}
}
