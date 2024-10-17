package models

type Category struct {
	CategoryID int    `json:"id" gorm:"primaryKey;autoIncrement;not null"`
	Name       string `json:"name"`

	// Relaciones
	Activities []*Activity `gorm:"foreignKey:CategoryID" json:"activities"`
}
