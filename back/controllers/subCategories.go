package controllers

import (
	"ingsoft/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type SubCategoriesController struct {
	subCat services.SubCategoriesService
}

func (subCat *SubCategoriesController) InitSubCategoriesControllerRouters(router *gin.Engine, subCategoriesService services.SubCategoriesService) {
	categories := router.Group("/subcategories")

	// Rutas para las listar todas las actividades
	categories.GET("/:categoryID", subCat.GetSubCategories())

	subCat.subCat = subCategoriesService
}

func (subCat *SubCategoriesController) GetSubCategories() gin.HandlerFunc {
	return func(c *gin.Context) {
		categoryIDstr := c.Param("categoryID")
		categoryID, err := strconv.Atoi(categoryIDstr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
			return
		}
		if categoryID < 0 {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
			return
		}
		subCategories := subCat.subCat.GetSubCategoriesService(categoryID)
		if subCategories == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error getting subcategories"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"SubCategorias": subCategories, // Utiliza la variable "subCategories"
		})
	}
}
