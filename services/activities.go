package services

import (
	"ingsoft/internal/models"
	"time"

	"gorm.io/gorm"
)

type ActivityService struct {
	db *gorm.DB
}

type Activity struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	StartDate   string `json:"startDate"`
	EndDate     string `json:"endDate"`
	Place       string `json:"place"`
}

func (acti *ActivityService) InitService(database *gorm.DB) {
	acti.db = database
	acti.db.AutoMigrate(&models.Activity{})
}

func (acti *ActivityService) GetActivitiesService() []Activity {
	data := []Activity{
		{ID: 1, Name: "Activity 1", Description: "Description 1", StartDate: "2021-01-01", EndDate: "2021-01-02", Place: "Place 1"},
		{ID: 2, Name: "Activity 2", Description: "Description 2", StartDate: "2021-01-03", EndDate: "2021-01-04", Place: "Place 2"},
		{ID: 3, Name: "Activity 3", Description: "Description 3", StartDate: "2021-01-05", EndDate: "2021-01-06", Place: "Place 3"},
	}
	return data
}

func (acti *ActivityService) CreateActivityService(Name string, Description string, StartDate time.Time, EndDate time.Time, Place string) (*models.Activity, error) {
	activity := &models.Activity{
		Name:        Name,
		Description: Description,
		StartDate:   StartDate,
		EndDate:     EndDate,
		Place:       Place,
	}

	if err := acti.db.Create(activity).Error; err != nil {
		return nil, err
	}
	return activity, nil
}
