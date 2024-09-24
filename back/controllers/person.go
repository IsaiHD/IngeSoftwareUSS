package controllers

import (
	"ingsoft/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type PersonController struct {
	users services.PersonService
}

func (per *PersonController) InitPersonControllerRouters(router *gin.Engine, userService services.PersonService) {
	users := router.Group("/persons")
	users.GET("/", per.GetPersons())
	per.users = userService
}

func (per *PersonController) GetPersons() gin.HandlerFunc {
	return func(c *gin.Context) {
		activity := per.users.GetPersonService()
		if activity == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error getting persons"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"Persons": per.users.GetPersonService(),
		})

	}
}
