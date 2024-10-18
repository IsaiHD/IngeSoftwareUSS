package models

import (
	"time"
)

type Activity struct {
	ActivityID int    `json:"id" gorm:"primaryKey;autoIncrement;not null"`
	Image      []byte `json:"image" gorm:"type:varbinary(MAX)"`
	Name       string `json:"name"`
	Atype      string `json:"type"`
	Asubtype   string `json:"subtype"`
	//Personas Máximas
	Description string    `json:"description"`
	StartDate   time.Time `json:"startDate"`
	EndDate     time.Time `json:"endDate"`
	Place       string    `json:"place"`
	Users       []*User   `gorm:"many2many:user_activities;" json:"users"` // Relación muchos a muchos
}
