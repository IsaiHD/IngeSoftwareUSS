package models

type SubCategory struct {
	SubCategoryID int        `json:"id" gorm:"primaryKey;autoIncrement;not null"`
	Name          string     `json:"name"`
	Activity      []Activity `gorm:"foreignKey:SubCategoryID" json:"activities"`
}
