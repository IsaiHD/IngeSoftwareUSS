package middleware

import (
	"fmt"
	"ingsoft/internal/utils"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func CheckMiddleware(c *gin.Context) {

	headers := c.GetHeader("Authorization")

	fmt.Println("Authorization Header:", headers)

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

	fmt.Println("Token Data:", data)
	if err != nil {
		fmt.Println("Error:", err) // Imprimir el error para depuración
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Claims not Matched",
		})
		return
	}

	c.Next()
}
