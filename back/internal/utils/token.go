package utils

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt"
)

const secretKey = "supersecret"

func GenerateToken(email string, id int) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": email,
		"id":    id,
		"nbf":   time.Now().Unix(), // Actualiza `nbf` al tiempo actual
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(secretKey))

	return tokenString, err
}

func parseToken(tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(secretKey), nil
	})

	if err != nil {
		fmt.Println("Error parsing token:", err) // Imprimir el error para depuración
		return nil, err
	}

	return token, nil
}

func TokenCheck(tokenString string) (interface{}, error) {
	token, err := parseToken(tokenString)
	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// fmt.Println("Claims extracted successfully:", claims) // Imprimir las claims para depuración
		return claims, nil
	} else {
		return nil, fmt.Errorf("unable to map claims or token is invalid")
	}
}
