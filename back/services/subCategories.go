package services

import (
	"ingsoft/internal/models"

	"gorm.io/gorm"
)

type SubCategoryService struct {
	db *gorm.DB
}

type SubCategory struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func (subCat *SubCategoryService) InitService(database *gorm.DB) {
	subCat.db = database
	subCat.db.AutoMigrate(&models.SubCategory{})
}

func (subCat *SubCategoryService) GetSubCategoriesService() []SubCategory {

	var subCategories []models.SubCategory
	subCat.db.Find(&subCategories)

	var subCategoriesResponse []SubCategory
	for _, subCategory := range subCategories {
		subCategoriesResponse = append(subCategoriesResponse, SubCategory{
			ID:   subCategory.SubCategoryID,
			Name: subCategory.Name,
		})
	}

	return subCategoriesResponse
}
