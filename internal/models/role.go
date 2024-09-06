package models

type Role struct {
	RoleID int    `json:"roleid" gorm:"primaryKey;autoIncrement;not null"`
	Name   string `json:"name"`
}

func (Role) TableName() string {
	return "roles"
}
