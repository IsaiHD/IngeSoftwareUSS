package middleware

import (
	"ingsoft/internal/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

func CheckMiddleware(c *gin.Context) {
	headers := c.GetHeader("Authorization")

	// Verificar si el header está presente
	if headers == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Authorization header not found",
		})
		return
	}

	// Dividir el header en 'Bearer' y el token
	tokenParts := strings.Split(headers, " ")
	if len(tokenParts) < 2 {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Token not provided",
		})
		return
	}

	// Validar el token usando la función de utilidad
	data, err := utils.TokenCheck(tokenParts[1])
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Token is invalid or expired",
		})
		return
	}

	// Extraer el userID de los claims del token
	if userID, ok := data.(jwt.MapClaims)["id"]; ok {
		// Verificar que el userID sea un número y convertirlo
		if idFloat, ok := userID.(float64); ok {
			c.Set("userID", int(idFloat))
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID type"})
			c.Abort()
			return
		}
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User ID not found in token"})
		c.Abort()
		return
	}

	c.Next()
}
