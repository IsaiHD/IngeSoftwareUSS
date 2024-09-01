package services

import (
	"ingsoft/internal/models"
	"log"
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

	if acti.db == nil {
		log.Fatal("Database connection is not initialized")
	}

	var activities []models.Activity
	acti.db.Find(&activities)

	var activitiesResponse []Activity
	for _, activity := range activities {
		activitiesResponse = append(activitiesResponse, Activity{
			ID:          activity.ID,
			Name:        activity.Name,
			Description: activity.Description,
			StartDate:   activity.StartDate.Format("2006-01-02"),
			EndDate:     activity.EndDate.Format("2006-01-02"),
			Place:       activity.Place,
		})
	}

	return activitiesResponse
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

func (acti *ActivityService) UpdateActivityService(id int, Name string, Description string, StartDate time.Time, EndDate time.Time, Place string) (*models.Activity, error) {
	activity := &models.Activity{
		ID:          id,
		Name:        Name,
		Description: Description,
		StartDate:   StartDate,
		EndDate:     EndDate,
		Place:       Place,
	}

	if err := acti.db.Save(activity).Error; err != nil {
		return nil, err
	}

	return activity, nil
}

func (acti *ActivityService) DeleteActivityService(id int) error {
	if err := acti.db.Delete(&models.Activity{}, id).Error; err != nil {
		return err
	}

	return nil
}
