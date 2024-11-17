package services

import (
	"ingsoft/internal/models"

	"gorm.io/gorm"
)

type SubCategoriesService struct {
	db *gorm.DB
}

type SubCategory struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func (subCat *SubCategoriesService) InitSubCategoriesService(database *gorm.DB) {
	subCat.db = database
	subCat.db.AutoMigrate(&models.SubCategory{})
}

func (subCat *SubCategoriesService) GetSubCategoriesService(categoryID int) []SubCategory {
	var subCategories []models.SubCategory

	if categoryID < 0 {
		return nil
	}
	// Filtra por CategoryID e incluye la información de Category
	subCat.db.Preload("Category").Where("category_id = ?", categoryID).Find(&subCategories)

	var subCategoriesResponse []SubCategory
	for _, subCategory := range subCategories {
		subCategoriesResponse = append(subCategoriesResponse, SubCategory{
			ID:   subCategory.SubCategoryID,
			Name: subCategory.Name,
		})
	}

	return subCategoriesResponse
}
