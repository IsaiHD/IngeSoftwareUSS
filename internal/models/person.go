package models

type Person struct {
	ID      int    `gorm:"primary_key" json:"id"`
	Name    string `json:"name"`
	Age     int    `json:"age"`
	Email   string `json:"email"`
	Phone   string `json:"phone"`
	Address string `json:"address"`
}
