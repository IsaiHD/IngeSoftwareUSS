package services

import (
	"errors"
	"ingsoft/internal/models"
	"ingsoft/internal/utils"

	"gorm.io/gorm"
)

type AuthService struct {
	db *gorm.DB
}

func InitAuthService(db *gorm.DB) *AuthService {
	db.AutoMigrate(&models.User{})
	db.AutoMigrate(&models.Role{})
	return &AuthService{db: db}
}

func (as *AuthService) Login(email *string, password *string, username *string) (*models.User, error) {
	if password == nil {
		return nil, errors.New("password is required")
	}

	var user models.User

	if err := as.db.Where("email = ?", *email).First(&user).Error; err != nil {
		return nil, errors.New("user not found")
	}

	if !utils.CheckPasswordHash(*password, user.Password) {
		return nil, errors.New("invalid password")
	}

	return &user, nil
}

func (as *AuthService) Register(name *string, email *string, password *string, nickname *string, roleID *int) (*models.User, error) {
	if name == nil {
		return nil, errors.New("name is required")
	}
	if email == nil {
		return nil, errors.New("email is required")
	}
	if password == nil {
		return nil, errors.New("password is required")
	}
	if nickname == nil {
		return nil, errors.New("nickname is required")
	}
	if roleID == nil {
		return nil, errors.New("roleID is required")
	}

	var role models.Role
	if err := as.db.First(&role, roleID).Error; err != nil {
		return nil, errors.New("role not found")
	}

	if err := as.db.Where("email = ? OR username = ?", *email, *nickname).First(&models.User{}).Error; err == nil {
		return nil, errors.New("user already exists")
	}

	hashedPassword, err := utils.HashPassword(*password)
	if err != nil {
		return nil, err
	}

	user := models.User{
		Name:     *name,
		Email:    *email,
		Password: hashedPassword,
		Username: *nickname,
		RoleID:   *roleID,
	}

	if err := as.db.Create(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}
