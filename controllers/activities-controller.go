package controllers

import (
	"ingsoft/services"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type ActivityController struct {
	activities services.ActivityService
}

func (acti *ActivityController) InitActivityControllerRouters(router *gin.Engine, activitiyService services.ActivityService) {
	activities := router.Group("/activities")
	activities.GET("/", acti.GetActivities())
	activities.POST("/", acti.CreateActivity())
	activities.PUT("/:id", acti.UpdateActivity())
	activities.DELETE("/:id", acti.DeleteActivity())
	acti.activities = activitiyService
}

func (acti *ActivityController) GetActivities() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": acti.activities.GetActivitiesService(),
		})
	}
}

func (acti *ActivityController) CreateActivity() gin.HandlerFunc {
	type ActiBody struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		StartDate   string `json:"startDate"` // Fecha en formato string
		EndDate     string `json:"endDate"`   // Fecha en formato string
		Place       string `json:"place"`
	}

	return func(c *gin.Context) {
		var actiBody ActiBody
		if err := c.BindJSON(&actiBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		startDate, err := time.Parse("2006-01-02", actiBody.StartDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid startDate format"})
			return
		}

		endDate, err := time.Parse("2006-01-02", actiBody.EndDate)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid endDate format"})
			return
		}

		activity, err := acti.activities.CreateActivityService(actiBody.Name, actiBody.Description, startDate, endDate, actiBody.Place)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"activity": activity})
	}
}

func (acti *ActivityController) UpdateActivity() gin.HandlerFunc {
	return nil
}

func (acti *ActivityController) DeleteActivity() gin.HandlerFunc {
	type ActiBody struct {
		ID int `json:"id"`
	}

	return func(c *gin.Context) {
		var actiBody ActiBody

		if err := c.BindJSON(&actiBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
	}
}
