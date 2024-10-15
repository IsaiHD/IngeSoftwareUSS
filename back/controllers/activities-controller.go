package controllers

import (
	"ingsoft/middleware"
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
	activities.Use(middleware.CheckMiddleware)
	// Rutas para las listar todas las actividades
	activities.GET("/", acti.GetActivities())
	activities.GET("/name", acti.GetActivityByName())
	activities.GET("/type", acti.GetActivityByTypeFilter())

	// activities.GET("/:id", acti.GetActivityById())
	activities.POST("/", acti.CreateActivity())
	activities.PUT("/:id", acti.UpdateActivity())
	activities.DELETE("/:id", acti.DeleteActivity())

	// Obtener actividades por usuario
	activities.GET("/user", acti.GetActivitiesByUser())

	acti.activities = activityService
}

func (acti *ActivityController) GetActivities() gin.HandlerFunc {
	return func(c *gin.Context) {
		activities := acti.activities.GetActivitiesService()
		if activities == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error getting activities"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"Actividades": activities, // Utiliza la variable "activities"
		})
	}
}

func (acti *ActivityController) GetActivityByName() gin.HandlerFunc {
	type ActiBody struct {
		Name string `json:"name" binding:"required"` // Nombre de la actividad
	}

	return func(c *gin.Context) {

		var actiBody ActiBody

		if err := c.BindJSON(&actiBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		activies, err := acti.activities.GetActivitiesByNameFilter(actiBody.Name)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"Actividades": activies, // Utiliza la variable "activities"
		})

	}
}

func (acti *ActivityController) GetActivityByTypeFilter() gin.HandlerFunc {
	type ActiBody struct {
		Type string `json:"type" binding:"required"` // Tipo de la actividad
	}

	return func(c *gin.Context) {
		var actiBody ActiBody

		if err := c.BindJSON(&actiBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		activies, err := acti.activities.GetActivityByTypeFilter(actiBody.Type)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"Actividades": activies, // Utiliza la variable "activities"
		})

	}
}

func (acti *ActivityController) GetActivitiesByUser() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Obtener el ID del usuario del contexto
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error getting user ID"})
			return
		}

		// Convertir userID a int
		userIDInt, ok := userID.(int)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "User ID is not valid"})
			return
		}
		println(userIDInt)
		// Obtener las actividades del usuario
		activities, err := acti.activities.GetUserActivities(userIDInt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"success":    true,
			"activities": activities,
		})
	}
}

func (acti *ActivityController) CreateActivity() gin.HandlerFunc {
	type ActiBody struct {
		Name        string `json:"name"`
		Description string `json:"description"`
		Atype       string `json:"type"`
		Asubtype    string `json:"subtype"`
		Image       string `json:"image"`
		StartDate   string `json:"startDate"`
		EndDate     string `json:"endDate"`
		Place       string `json:"place"`
	}

	return func(c *gin.Context) {
		var actiBody ActiBody

		if err := c.BindJSON(&actiBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if actiBody.Image == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Image is required"})
			return
		}

		// Parsear las fechas
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

		// Obtener el userID desde el contexto
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "User ID not found in context"})
			return
		}

		// Convertir el userID a tipo int
		userIDInt, ok := userID.(int)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid User ID type"})
			return
		}

		// Crear la actividad asociada al usuario
		activity, err := acti.activities.CreateActivityService(
			actiBody.Name,
			actiBody.Description,
			actiBody.Atype,
			startDate,
			endDate,
			actiBody.Place,
			userIDInt, // Pasar el ID del usuario que se une a la actividad
			actiBody.Asubtype,
			actiBody.Image,
		)
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
	// type ActiBody struct {
	// 	Name        string `json:"name"`
	// 	Atype       string `json:"type"`
	// 	Description string `json:"description"`
	// 	StartDate   string `json:"startDate"` // Fecha en formato string
	// 	EndDate     string `json:"endDate"`   // Fecha en formato string
	// 	Place       string `json:"place"`
	// }

	// return func(c *gin.Context) {

	// 	var actiBody ActiBody
	// 	if err := c.BindJSON(&actiBody); err != nil {
	// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 		return
	// 	}

	// 	startDate, err := time.Parse("2006-01-02", actiBody.StartDate)
	// 	if err != nil {
	// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid startDate format"})
	// 		return
	// 	}

	// 	endDate, err := time.Parse("2006-01-02", actiBody.EndDate)
	// 	if err != nil {
	// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid endDate format"})
	// 		return
	// 	}

	// 	id := c.Param("id")
	// 	activityID, err := strconv.Atoi(id)
	// 	if err != nil {
	// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
	// 		return
	// 	}
	// 	// Verificar si la actividad existe antes de actualizar
	// 	existingActivity, err := acti.activities.GetActivityServiceById(activityID)
	// 	if err != nil {
	// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	// 		return
	// 	}

	// 	activity, err := acti.activities.UpdateActivityService(existingActivity.ActivityID, actiBody.Name, actiBody.Description, actiBody.Atype, startDate, endDate, actiBody.Place)
	// 	if err != nil {
	// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	// 		return
	// 	}
	// 	c.JSON(http.StatusOK, gin.H{
	// 		"success":  true,
	// 		"activity": activity,
	// 	})
	// }
	return nil
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
