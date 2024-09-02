package controllers

import (
	"ingsoft/services"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type ActivityController struct {
	activities services.ActivityService
}

func (acti *ActivityController) InitActivityControllerRouters(router *gin.Engine, activityService services.ActivityService) {
	activities := router.Group("/activities")
	activities.GET("/", acti.GetActivities())
	activities.GET("/:id", acti.GetActivityById())
	activities.POST("/", acti.CreateActivity())
	activities.PUT("/:id", acti.UpdateActivity())
	activities.DELETE("/:id", acti.DeleteActivity())
	acti.activities = activityService
}

func (acti *ActivityController) GetActivities() gin.HandlerFunc {
	return func(c *gin.Context) {
		activity := acti.activities.GetActivitiesService()
		if activity == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error getting activities"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"Actividades": acti.activities.GetActivitiesService(),
		})

	}
}

func (acti *ActivityController) GetActivityById() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		activityID, err := strconv.Atoi(id)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
			return
		}

		activity, err := acti.activities.GetActivityServiceById(activityID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"success":  true,
			"activity": activity,
		})
	}
}

func (acti *ActivityController) CreateActivity() gin.HandlerFunc {
	type ActiBody struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		Atype       string `json:"type"`
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

		activity, err := acti.activities.CreateActivityService(actiBody.Name, actiBody.Description, actiBody.Atype, startDate, endDate, actiBody.Place)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"success":  true,
			"activity": activity,
		})
	}
}

func (acti *ActivityController) UpdateActivity() gin.HandlerFunc {
	type ActiBody struct {
		Name        string `json:"name"`
		Atype       string `json:"type"`
		Description string `json:"description"`
		StartDate   string `json:"startDate"` // Fecha en formato string
		EndDate     string `json:"endDate"`   // Fecha en formato string
		Place       string `json:"place"`
	}

	return func(c *gin.Context) {
		id := c.Param("id")
		activityID, err := strconv.Atoi(id)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
			return
		}

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

		activity, err := acti.activities.UpdateActivityService(activityID, actiBody.Name, actiBody.Description, actiBody.Atype, startDate, endDate, actiBody.Place)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"success":  true,
			"activity": activity,
		})
	}
}

func (acti *ActivityController) DeleteActivity() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		activityID, err := strconv.Atoi(id)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
			return
		}

		err = acti.activities.DeleteActivityService(activityID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Asegúrate de devolver un mensaje de éxito
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "Activity deleted successfully",
		})
	}
}
