package services

import (
	"errors"
	"ingsoft/internal/models"

	"gorm.io/gorm"
)

type AuthService struct {
	db *gorm.DB
}

func InitAuthService(db *gorm.DB) *AuthService {
	return &AuthService{db: db}
}

func (as *AuthService) Login(email string, password string, nickname string) (*models.User, error) {
	if email == nil	{
		return nil, errors.New("Email is required")
	}
	if password == nil {
		return nil, errors.New("Password is required")
	}
	if nickname == nil {
		return nil, errors.New("Nickname is required")
	}
	var user models.User
	if err := as.db.Where("email = ? AND password = ? AND username = ?", email, password, nickname).Find(&user).Error; if err != nil {
		return nil, errors.New("User not found")
	}

	return &user, nil
}

func (as *AuthService) Register(email string, password string, nickname string) (*models.User, error) {
	if email == nil	{
		return nil, errors.New("Email is required")
	}
	if password == nil {
		return nil, errors.New("Password is required")
	}
	if nickname == nil {
		return nil, errors.New("Nickname is required")
	}
	var user models.User
	if err := as.db.Create(&user).Error; if err != nil {
		return nil, errors.New("User not found")
	}

	return &user, nil
}
