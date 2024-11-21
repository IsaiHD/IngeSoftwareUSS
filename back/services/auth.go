package services

import (
	"encoding/base64"
	"errors"
	"ingsoft/internal/models"
	"ingsoft/internal/utils"
	"time"

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
	if password == nil || *password == "" {
		return nil, errors.New("password is required")
	}

	var user models.User
	var err error

	// Busca al usuario por email o username según cuál esté presente
	if email != nil && *email != "" {
		err = as.db.Where("email = ?", *email).First(&user).Error
	} else if username != nil && *username != "" {
		err = as.db.Where("username = ?", *username).First(&user).Error
	} else {
		return nil, errors.New("email or username is required")
	}

	if err != nil {
		return nil, errors.New("user not found")
	}

	// Verifica la contraseña
	if !utils.CheckPasswordHash(*password, user.Password) {
		return nil, errors.New("invalid password")
	}

	return &user, nil
}

func (as *AuthService) Register(name *string, email *string, password *string, nickname *string, roleID *int) (*models.User, error) {
	// Validación de los campos obligatorios
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

	// Comprobación si el rol existe
	var role models.Role
	if err := as.db.First(&role, roleID).Error; err != nil {
		return nil, errors.New("role not found")
	}

	// Verificar si el correo electrónico o el nombre de usuario ya existen
	if err := as.db.Where("email = ? OR username = ?", *email, *nickname).First(&models.User{}).Error; err == nil {
		return nil, errors.New("user already exists")
	}

	// Cifrado de la contraseña
	hashedPassword, err := utils.HashPassword(*password)
	if err != nil {
		return nil, err
	}

	// Crear el usuario con los valores proporcionados y los valores predeterminados
	user := models.User{
		Name:        *name,
		Email:       *email,
		Password:    hashedPassword,
		Username:    *nickname,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
		RoleID:      *roleID,
		Active:      true,     // valor predeterminado
		Image:       []byte{}, // valor predeterminado (sin imagen por defecto)
		Place:       "",       // valor predeterminado (sin ubicación por defecto)
		PhoneNumber: "",       // valor predeterminado (sin teléfono por defecto)
		Bio:         "",       // valor predeterminado (sin biografía por defecto)
		Status:      "active", // valor predeterminado
		IsDeleted:   false,    // valor predeterminado
	}

	// Guardar el usuario en la base de datos
	if err := as.db.Create(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (as *AuthService) UpdateProfile(userID int, name *string, email *string, nickname *string, place *string, phoneNumber *string, bio *string, image string) (*models.User, error) {
	// Buscar al usuario por el ID proporcionado
	var user models.User
	if err := as.db.First(&user, userID).Error; err != nil {
		return nil, errors.New("user not found")
	}

	// Verificar si email o username ya existen y pertenecen a otro usuario
	var userCheck models.User
	if email != nil || nickname != nil {
		if err := as.db.Where("email = ? OR username = ?", email, nickname).First(&userCheck).Error; err == nil && userCheck.UserID != userID {
			return nil, errors.New("user with the same email or username already exists")
		}
	}

	// Actualizar los campos solo si no son nulos o vacíos
	if name != nil && *name != "" {
		user.Name = *name
	}
	if email != nil && *email != "" {
		user.Email = *email
	}
	if nickname != nil && *nickname != "" {
		user.Username = *nickname
	}
	if place != nil && *place != "" {
		user.Place = *place
	}
	if phoneNumber != nil && *phoneNumber != "" {
		user.PhoneNumber = *phoneNumber
	}
	if bio != nil && *bio != "" {
		user.Bio = *bio
	}
	if image != "" {
		imageData, err := base64.StdEncoding.DecodeString(image)
		if err != nil {
			return nil, err
		}
		user.Image = imageData
	}

	// Actualizar la fecha de modificación
	user.UpdatedAt = time.Now()

	// Guardar los cambios en la base de datos
	if err := as.db.Save(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (as *AuthService) ChangePasswordLogged(userID int, currentPassword *string, newPassword *string) error {
	// Buscar al usuario por el ID proporcionado
	var user models.User
	if err := as.db.First(&user, userID).Error; err != nil {
		return errors.New("user not found")
	}

	// Verificar la contraseña actual
	if !utils.CheckPasswordHash(*currentPassword, user.Password) {
		return errors.New("invalid current password")
	}

	// Cifrar la nueva contraseña
	hashedPassword, err := utils.HashPassword(*newPassword)
	if err != nil {
		return err
	}

	// Actualizar la contraseña en la base de datos
	if err := as.db.Model(&user).Update("password", hashedPassword).Error; err != nil {
		return err
	}

	return nil
}

func (as *AuthService) DeleteAccount(userID int) error {
	// Buscar al usuario por el ID proporcionado
	var user models.User
	if err := as.db.First(&user, userID).Error; err != nil {
		return errors.New("user not found")
	}

	// Actualizar el estado de la cuenta a eliminado
	if err := as.db.Model(&user).Update("is_deleted", true).Error; err != nil {
		return err
	}

	return nil
}

func (as *AuthService) Profile(userID int) (*models.User, error) {
	var user models.User
	// Buscar al usuario por el ID proporcionado
	if err := as.db.First(&user, userID).Error; err != nil {
		return nil, errors.New("user not found")
	}
	return &user, nil
}
