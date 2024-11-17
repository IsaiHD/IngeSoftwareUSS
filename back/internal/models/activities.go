package models

import (
	"time"
)

type Activity struct {
	ActivityID  int       `json:"id" gorm:"primaryKey;autoIncrement;not null"`
	Image       []byte    `json:"image" gorm:"type:varbinary(MAX)"`
	Name        string    `json:"name" binding:"required"` // Nombre de la actividad
	Description string    `json:"description" binding:"required"`
	StartDate   time.Time `json:"startDate"`
	EndDate     time.Time `json:"endDate"`
	Place       string    `json:"place" binding:"required"`
	Users       []*User   `gorm:"many2many:user_activities;constraint:OnDelete:CASCADE;" json:"users"`
	Category    int       `json:"type" binding:"required"`
	SubCategory int       `json:"subtype" binding:"required"`
}
