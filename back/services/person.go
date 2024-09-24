package services

import (
	"log"

	"gorm.io/gorm"
)

type PersonService struct {
	db *gorm.DB
}

type User struct {
	UserID   int    `json:"userid"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Username string `json:"username"`
	// Password string     `json:"password"`
	// RoleID   int        `json:"roleid"`
	Activity []Activity `json:"activity"`
}

func (per *PersonService) InitService(database *gorm.DB) {
	per.db = database
}

func (per *PersonService) GetPersonService() []User {
	if per.db == nil {
		log.Fatal("Database connection is not initialized")
	}

	var persons []User
	err := per.db.Model(&User{}).Find(&persons).Error
	if err != nil {
		log.Fatal("Error getting persons")
	}
	var personsResponse []User
	for _, person := range persons {
		personsResponse = append(personsResponse, User{
			UserID:   person.UserID,
			Name:     person.Name,
			Email:    person.Email,
			Username: person.Username,
		})
	}

	return personsResponse
}
