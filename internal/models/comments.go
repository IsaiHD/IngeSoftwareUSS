package models

type Comment struct {
	ID      int    `gorm:"primaryKey" json:"id"`
	Content string `json:"content"`
	PostID  int    `json:"postID"`

	// Relaciones
	Post Post `gorm:"foreignKey:PostID" json:"post"`
}
