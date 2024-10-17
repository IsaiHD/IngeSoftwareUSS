package controllers

import (
	"ingsoft/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type SubCategoriesController struct {
	subCat services.SubCategoriesService
}

func (subCat *SubCategoriesController) InitSubCategoriesControllerRouters(router *gin.Engine, subCategoriesService services.SubCategoriesService) {
	categories := router.Group("/activities")

	// Rutas para las listar todas las actividades
	categories.GET("/", subCat.GetSubCategories())

	subCat.subCat = subCategoriesService
}

func (subCat *SubCategoriesController) GetSubCategories() gin.HandlerFunc {
	return func(c *gin.Context) {
		subCategories := subCat.subCat.GetSubCategoriesService()
		if subCategories == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error getting subcategories"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"SubCategorias": subCategories, // Utiliza la variable "subCategories"
		})
	}
}
