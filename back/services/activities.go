package services

import (
	"errors"
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
	Atype       string `json:"type"`
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
			ID:          activity.ActivityID,
			Name:        activity.Name,
			Atype:       activity.Atype,
			Description: activity.Description,
			StartDate:   activity.StartDate.Format("2006-01-02"),
			EndDate:     activity.EndDate.Format("2006-01-02"),
			Place:       activity.Place,
		})
	}

	return activitiesResponse
}

// func (acti *ActivityService) GetActivitiesByUser(userID int) ([]models.Activity, error) {
// 	var activities []models.Activity

// 	// Obtener las actividades basadas en el UserID
// 	if err := acti.db.Where("user_id = ?", userID).Find(&activities).Error; err != nil {
// 		return nil, err
// 	}

// 	return activities, nil
// }

func (acti *ActivityService) GetUserActivities(userID int) ([]models.Activity, error) {
	var activities []models.Activity

	if err := acti.db.Table("user_activities").
		Select("activities.activity_id, activities.name, activities.atype, activities.description, activities.start_date, activities.end_date, activities.place").
		Joins("JOIN activities ON activities.activity_id = user_activities.activity_activity_id").
		Where("user_activities.user_user_id = ?", userID).
		Scan(&activities).Error; err != nil {
		return nil, err
	}

	return activities, nil
}

func (acti *ActivityService) JoinActivity(userID, activityID int) error {
	var activity models.Activity
	if err := acti.db.First(&activity, activityID).Error; err != nil {
		return err // Actividad no encontrada
	}

	// Verificar si ya está asociado a la actividad
	var user models.User
	if err := acti.db.Where("user_id = ? AND activity_id = ?", userID, activityID).First(&user).Error; err == nil {
		return errors.New("ya estás asociado a esta actividad")
	}

	// Verificar horarios
	var conflictingActivities []models.Activity
	if err := acti.db.Where("user_id = ? AND (start_date < ? AND end_date > ?)", userID, activity.EndDate, activity.StartDate).Find(&conflictingActivities).Error; err != nil {
		return err
	}
	if len(conflictingActivities) > 0 {
		return errors.New("no puedes unirte a esta actividad, hay conflictos de horario")
	}

	// Asociar al usuario con la actividad
	if err := acti.db.Model(&activity).Association("Users").Append(&user); err != nil {
		return err
	}

	return nil
}

func (acti *ActivityService) CreateActivityService(name, description, atype string, startDate, endDate time.Time, place string, userID int) (*models.Activity, error) {
	// Crear la actividad
	activity := models.Activity{
		Name:        name,
		Description: description,
		Atype:       atype,
		StartDate:   startDate,
		EndDate:     endDate,
		Place:       place,
	}

	// Guardar la actividad en la base de datos
	if err := acti.db.Create(&activity).Error; err != nil {
		return nil, err
	}

	// Cargar el usuario para asociarlo a la actividad
	var user models.User
	if err := acti.db.First(&user, userID).Error; err != nil {
		return nil, err
	}

	// Asociar el usuario a la actividad
	if err := acti.db.Model(&activity).Association("Users").Append(&user); err != nil {
		return nil, err
	}

	return &activity, nil
}

func (acti *ActivityService) UpdateActivityService(id int, Name string, Description string, ActivityType string, StartDate time.Time, EndDate time.Time, Place string) (*models.Activity, error) {
	activity := &models.Activity{
		ActivityID:  id,
		Name:        Name,
		Description: Description,
		Atype:       ActivityType,
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
	var activity models.Activity
	if err := acti.db.First(&activity, id).Error; err != nil {
		return err
	}

	if err := acti.db.Delete(&activity).Error; err != nil {
		return err
	}

	return nil
}
