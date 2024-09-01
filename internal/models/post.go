package models

import "time"

type Post struct {
	ID        int       `gorm:"primaryKey" json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	AuthorID  int       `json:"authorID"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`

	// Relaciones
	Comments []Comment `json:"comments"`
	Ratings  []Rating  `json:"ratings"`
	Author   Person    `json:"author"`
}
