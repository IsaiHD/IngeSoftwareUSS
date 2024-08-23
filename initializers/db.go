package initializers

import (
	"log"

	"gorm.io/driver/sqlserver"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	var err error
	// Connect to database
	dsn := "sqlserver://gorm:DESKTOP-QBIHNRJ\\INGSOFTWARE@localhost:9930?database=gorm"
	DB, err = gorm.Open(sqlserver.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("failed to connect database")
	}

}
