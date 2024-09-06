package utils

import (
	"time"

	"github.com/golang-jwt/jwt"
)

const secretKey = "secret"

func GenerateToken(email string, id int, username string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email":    email,
		"id":       id,
		"username": username,
		"nbf":      time.Date(2024, 10, 10, 12, 0, 0, 0, time.UTC).Unix(),
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(secretKey))

	return tokenString, err
}

func ParseToken(tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(secretKey), nil
	})

	if err != nil {
		return nil, err
	}

	return token, nil
}

func TokenCheck(tokenString string) (interface{}, error) {
	token, err := ParseToken(tokenString)
	if err != nil {
		return nil, err
	}

	data, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, err
	}

	return data, nil
}
