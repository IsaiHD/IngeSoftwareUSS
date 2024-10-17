package controllers

import (
	"ingsoft/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CategoriesController struct {
	cate services.CategoriesService
}

func (cate *CategoriesController) InitCategoriesControllerRouters(router *gin.Engine, categoriesService services.CategoriesService) {
	categories := router.Group("/activities")

	// Rutas para las listar todas las actividades
	categories.GET("/", cate.GetActivities())

	cate.cate = categoriesService
}

func (cate *CategoriesController) GetActivities() gin.HandlerFunc {
	return func(c *gin.Context) {
		categories := cate.cate.GetCategoriesService()
		if categories == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error getting categories"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"Categorias": categories, // Utiliza la variable "categories"
		})
	}
}
