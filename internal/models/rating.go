package models

type Rating struct {
	ID     int `gorm:"primaryKey" json:"id"`
	Stars  int `json:"stars"`
	PostID int `json:"postID"`

	// Relaciones
	Post Post `gorm:"foreignKey:PostID" json:"post"`
}
