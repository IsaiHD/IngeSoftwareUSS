package initializers

import (
	"log"

	"github.com/joho/godotenv"
	"gorm.io/driver/sqlserver"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	pass := godotenv.Get("DB_PASSWORD")
	var err error
	// Connect to database
	dsn := "sqlserver://sa:" + pass + "@localhost:1433?database=master"
	DB, err = gorm.Open(sqlserver.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("failed to connect database: ", err)
	}

	log.Println("Successfully connected to the database")
}
