package controllers

import (
	"ingsoft/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ActivityController struct {
	activities services.Activity
}

func (acti *ActivityController) InitActivityControllerRouters(router *gin.Engine) {
	activities := router.Group("/activities")
	activities.GET("/", acti.GetActivities())
	activities.POST("/", acti.CreateActivity())

}

func (acti *ActivityController) GetActivities() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": acti.activities.GetActivitiesService(),
		})
	}
}

func (acti *ActivityController) CreateActivity() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "CreateActivity",
		})
	}
}
