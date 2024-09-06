package models

import "time"

type Activity struct {
	ActivityID  int       `json:"id" gorm:"primaryKey;autoIncrement;not null"`
	Name        string    `json:"name"`
	Atype       string    `json:"type"`
	Description string    `json:"description"`
	StartDate   time.Time `json:"startDate"`
	EndDate     time.Time `json:"endDate"`
	Place       string    `json:"place"`
}
