package services

import (
	"encoding/base64"
	"errors"
	"fmt"
	"ingsoft/internal/models"
	"log"
	"time"

	"gorm.io/gorm"
)

type ActivityService struct {
	db *gorm.DB
}

type Activity struct {
	ID          int            `json:"id"`
	Name        string         `json:"name"`
	Description string         `json:"description"`
	Category    int            `json:"type"`
	SubCategory int            `json:"subtype"`
	Image       []byte         `json:"image"`
	StartDate   string         `json:"startDate"`
	EndDate     string         `json:"endDate"`
	Place       string         `json:"place"`
	User        []*models.User `json:"user"`
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
	// Preload para cargar los usuarios relacionados con cada actividad
	err := acti.db.Preload("Users", func(db *gorm.DB) *gorm.DB {
		return db.Select("UserID", "Username", "Name") // Solo los campos necesarios
	}).Find(&activities).Error
	if err != nil {
		log.Fatalf("Error fetching activities: %v", err)
	}

	var activitiesResponse []Activity
	for _, activity := range activities {
		// Convertir la actividad a la respuesta esperada
		activitiesResponse = append(activitiesResponse, Activity{
			ID:          activity.ActivityID,
			Name:        activity.Name,
			Category:    activity.Category,
			SubCategory: activity.SubCategory,
			Image:       activity.Image,
			Description: activity.Description,
			StartDate:   activity.StartDate.Format("2006-01-02"), // Asegurando que las fechas estén formateadas
			EndDate:     activity.EndDate.Format("2006-01-02"),   // Asegurando que las fechas estén formateadas
			Place:       activity.Place,
			User:        activity.Users, // Los usuarios asociados ya están cargados
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

func (acti *ActivityService) GetActivitiesByNameFilter(name string) ([]Activity, error) {
	// Verificar que la conexión a la base de datos esté inicializada
	if acti.db == nil {
		return nil, fmt.Errorf("database connection is not initialized")
	}

	var activities []models.Activity
	// Realizar la consulta con un filtro por nombre y preload de usuarios
	err := acti.db.Preload("Users", func(db *gorm.DB) *gorm.DB {
		return db.Select("UserID", "Username", "Name") // Solo cargar campos necesarios de los usuarios
	}).Where("name LIKE ?", "%"+name+"%").Find(&activities).Error
	if err != nil {
		return nil, fmt.Errorf("error fetching activities by name filter: %v", err)
	}

	// Construir la respuesta
	activitiesResponse := make([]Activity, 0, len(activities))
	for _, activity := range activities {
		activitiesResponse = append(activitiesResponse, Activity{
			ID:          activity.ActivityID,
			Name:        activity.Name,
			Category:    activity.Category,
			SubCategory: activity.SubCategory,
			Image:       activity.Image,
			Description: activity.Description,
			StartDate:   activity.StartDate.Format("2006-01-02"), // Formato de fecha
			EndDate:     activity.EndDate.Format("2006-01-02"),   // Formato de fecha
			Place:       activity.Place,
			User:        activity.Users, // Usuarios relacionados
		})
	}

	return activitiesResponse, nil
}

func (acti *ActivityService) GetActivityByTypeFilter(Category string) ([]Activity, error) {
	var activities []models.Activity
	if err := acti.db.Where("Category = ?", Category).Find(&activities).Error; err != nil {
		return nil, err
	}

	activitiesResponse := make([]Activity, 0, len(activities))
	for _, activity := range activities {
		activitiesResponse = append(activitiesResponse, Activity{
			ID:          activity.ActivityID,
			Name:        activity.Name,
			Category:    activity.Category,
			SubCategory: activity.SubCategory,
			Image:       activity.Image,
			Description: activity.Description,
			StartDate:   activity.StartDate.Format("2006-01-02"),
			EndDate:     activity.EndDate.Format("2006-01-02"),
			Place:       activity.Place,
		})
	}

	return activitiesResponse, nil
}

func (acti *ActivityService) GetUserActivities(userID int) ([]models.Activity, error) {
	var activities []models.Activity

	if err := acti.db.Table("user_activities").
		Select("activities.activity_id, activities.name, activities.category, activities.sub_category, activities.description, activities.start_date, activities.end_date, activities.place, activities.image").
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

func (acti *ActivityService) CreateActivityService(name string, description string, Category string, startDate, endDate time.Time, place string, userID int, SubCategory string, image string) (*models.Activity, error) {

	// Decodificar la imagen
	imageData, err := base64.StdEncoding.DecodeString(image)
	if err != nil {
		return nil, err
	}

	var category models.Category
	if err := acti.db.Where("name = ?", Category).First(&category).Error; err != nil {
		return nil, errors.New("category not found")
	}
	var subcategory models.SubCategory
	if err := acti.db.Where("name = ?", SubCategory).First(&subcategory).Error; err != nil {
		return nil, errors.New("subcategory not found")
	}

	// Crear la actividad
	activity := models.Activity{
		Name:        name,
		Description: description,
		Category:    category.CategoryID,
		SubCategory: subcategory.SubCategoryID,
		StartDate:   startDate,
		EndDate:     endDate,
		Place:       place,
		Image:       imageData,
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

func (acti *ActivityService) UpdateActivityService(id int, Name string, Description string, ActivityType string, StartDate time.Time, EndDate time.Time, Place string, SubCategory string, Image string) (*models.Activity, error) {
	// Recuperar la actividad existente para comparación
	var activity models.Activity
	if err := acti.db.First(&activity, id).Error; err != nil {
		return nil, err
	}

	// Si la descripción no está vacía, actualizarla
	if Description != "" {
		activity.Description = Description
	}

	// Si el nombre no está vacío, actualizarlo
	if Name != "" {
		activity.Name = Name
	}

	// Si la categoría no está vacía, actualizarla
	if ActivityType != "" {
		var category models.Category
		if err := acti.db.First(&category, ActivityType).Error; err != nil {
			return nil, errors.New("category not found")
		}
		activity.Category = category.CategoryID
	}

	// Si la subcategoría no está vacía, actualizarla
	if SubCategory != "" {
		var subcategory models.SubCategory
		if err := acti.db.First(&subcategory, SubCategory).Error; err != nil {
			return nil, errors.New("subcategory not found")
		}
		activity.SubCategory = subcategory.SubCategoryID
	}

	// Si la imagen no está vacía, actualizarla
	if Image != "" {
		imageData, err := base64.StdEncoding.DecodeString(Image)
		if err != nil {
			return nil, err
		}
		activity.Image = imageData
	}

	// Si la fecha de inicio no está vacía, actualizarla
	if !StartDate.IsZero() {
		activity.StartDate = StartDate
	}

	// Si la fecha de fin no está vacía, actualizarla
	if !EndDate.IsZero() {
		activity.EndDate = EndDate
	}

	// Si el lugar no está vacío, actualizarlo
	if Place != "" {
		activity.Place = Place
	}

	// Guardar la actividad actualizada en la base de datos
	if err := acti.db.Save(&activity).Error; err != nil {
		return nil, err
	}

	return &activity, nil
}

func (acti *ActivityService) DeleteActivityService(id int) error {
	var activity models.Activity

	if err := acti.db.Exec("DELETE FROM user_activities WHERE activity_activity_id = ?", id).Error; err != nil {
		return err
	}

	if err := acti.db.Delete(&activity, id).Error; err != nil {
		return err
	}

	return nil
}
