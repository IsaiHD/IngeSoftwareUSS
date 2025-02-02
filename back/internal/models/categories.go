package models

type Category struct {
	CategoryID  int           `json:"id" gorm:"primaryKey;autoIncrement;not null"`
	Name        string        `json:"name"`
	SubCategory []SubCategory `gorm:"foreignKey:CategoryID"` // Define la relación de clave foránea
}
