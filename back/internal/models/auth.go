package models

type User struct {
	UserID   int    `json:"userid" gorm:"primaryKey;autoIncrement;not null"`
	Name     string `json:"name"`
	Email    string `json:"email" gorm:"unique;not null" binding:"required"`
	Username string `json:"username"`
	Password string `json:"password"`
	RoleID   int    `json:"roleid"`
	//img usuario
	Activities []*Activity `gorm:"many2many:user_activities;" json:"activities"` // Relación muchos a muchos
}

func (User) TableName() string {
	return "users"
}
