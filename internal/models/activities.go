package models

import "time"

type Activity struct {
	ID          int       `gorm:"primaryKey" json:"id"`
	Name        string    `json:"name"`
	Atype       string    `json:"type"`
	Description string    `json:"description"`
	StartDate   time.Time `json:"startDate"`
	EndDate     time.Time `json:"endDate"`
	Place       string    `json:"place"`
}
