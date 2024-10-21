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

	if headers == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Header not found",
		})
		return
	}

	token := strings.Split(headers, " ")

	if len(token) < 2 {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Token not provided",
		})
		return
	}

	data, err := utils.TokenCheck(token[1])

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Claims not Matched",
		})
		return
	}

	// Extraer el userID del token y almacenarlo en el contexto
	if userID, ok := data.(jwt.MapClaims)["id"]; ok {
		// Convertir de float64 a int
		if idFloat, ok := userID.(float64); ok {
			c.Set("userID", int(idFloat))
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID type"})
			c.Abort()
			return
		}
	}

	c.SetCookie("Authorization", token, 3600 * 24 * 30, "", "", false)
	c.Next()
}
