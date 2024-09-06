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

	fmt.Println(headers)

	if headers == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "No token provided",
		})
		return
	}

	token := strings.Split(headers, " ")

	if len(token) < 2 {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Invalid token",
		})
		return
	}

	data, err := utils.TokenCheck(token[1])
	fmt.Println(data)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.Next()
}
