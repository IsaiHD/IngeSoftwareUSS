package models

type Event struct {
	ID          int    `gorm:"primaryKey" json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Location    string `json:"location"`
	Valoracion  int    `json:"valoracion"`
	// Price       int    `json:"price"`
	// Relaciones
	// User User `gorm:"foreignKey:UserID" json:"user"`
}
