package models

import "time"

type User struct {
	UserID    int       `json:"userid" gorm:"primaryKey;autoIncrement;not null"`
	Name      string    `json:"name"`
	Email     string    `json:"email" gorm:"unique;not null" binding:"required"`
	Username  string    `json:"username"`
	Password  string    `json:"password"`
	RoleID    int       `json:"roleid"`
	CreatedAt time.Time `json:"createdat"`
	UpdatedAt time.Time `json:"updatedat"`
	// LastLogin       time.Time   `json:"lastlogin"`
	Active      bool   `json:"active"`
	Image       string `json:"image"`
	Place       string `json:"place"`
	PhoneNumber string `json:"phonenumber"`
	Bio         string `json:"bio"`
	// IsEmailVerified bool        `json:"isemailverified"`
	// TwoFactorEnabled bool       `json:"twofactor_enabled"`
	Status      string      `json:"status"`
	Preferences string      `json:"preferences"`
	IsDeleted   bool        `json:"isdeleted"`
	Activities  []*Activity `gorm:"many2many:user_activities;constraint:OnDelete:CASCADE;" json:"activities"`
}

func (User) TableName() string {
	return "users"
}
