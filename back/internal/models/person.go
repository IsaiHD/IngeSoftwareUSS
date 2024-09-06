package models

type Person struct {
	ID      int    `gorm:"primaryKey" json:"id"`
	Name    string `json:"name"`
	Age     int    `json:"age"`
	Email   string `json:"email"`
	Phone   string `json:"phone"`
	Address string `json:"address"`

	// Relaciones
	Posts []Post `json:"posts"`
}
