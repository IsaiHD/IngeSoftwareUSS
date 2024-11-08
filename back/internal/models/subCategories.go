package models

type SubCategory struct {
	SubCategoryID int      `json:"id" gorm:"primaryKey;autoIncrement;not null"`
	Name          string   `json:"name"`
	CategoryID    int      `json:"category_id" gorm:"not null"`
	Category      Category `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"` // Define la relación y restricciones
}
