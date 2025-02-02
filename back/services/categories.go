package services

import (
	"ingsoft/internal/models"
	"log"

	"gorm.io/gorm"
)

type CategoriesService struct {
	db *gorm.DB
}

type Category struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func (cat *CategoriesService) InitService(database *gorm.DB) {
	cat.db = database
	cat.db.AutoMigrate(&models.Category{})
}

func (cat *CategoriesService) GetCategoriesService() []Category {

	if cat.db == nil {
		log.Fatal("Database connection is not initialized")
	}

	var categories []models.Category

	cat.db.Find(&categories)

	var categoriesResponse []Category
	for _, category := range categories {
		categoriesResponse = append(categoriesResponse, Category{
			ID:   category.CategoryID,
			Name: category.Name,
		})
	}

	return categoriesResponse
}
