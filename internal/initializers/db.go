package initializers

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/sqlserver"
	"gorm.io/gorm"
)

func InitDB() *gorm.DB {
	// Cargar las variables de entorno desde el archivo .env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file:", err)
	}

	// Leer credenciales de la base de datos desde las variables de entorno
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	// Validar que las variables de entorno requeridas no estén vacías
	if dbUser == "" || dbPassword == "" || dbHost == "" || dbPort == "" || dbName == "" {
		log.Fatal("Missing required environment variables: DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME")
	}

	// Construir el DSN usando las variables de entorno
	dsn := os.Getenv("DSN")
	if dsn == "" {
		dsn = fmt.Sprintf("sqlserver://%s:%s@%s:%s?database=%s", dbUser, dbPassword, dbHost, dbPort, dbName)
	}

	// Abrir la conexión a la base de datos usando GORM
	db, err := gorm.Open(sqlserver.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Error connecting to database:", err)
	}

	return db
}
