package main

import (
	"ingsoft/controllers"
	"ingsoft/internal/initializers"
	"ingsoft/services"
	"io"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func setupLogOutput() {
	f, _ := os.Create("gin.log")
	gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
}

func main() {
	setupLogOutput()

	// gin.SetMode(gin.ReleaseMode)
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://127.0.0.1:5500"}, // Cambia esto según tu necesidad
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
	}))

	db := initializers.InitDB()

	println("DB: ", db)

	if db == nil {
		return
	}

	activityService := &services.ActivityService{}
	activityService.InitService(db)

	activitiesController := &controllers.ActivityController{}
	activitiesController.InitActivityControllerRouters(router, *activityService)

	// router.Use(gin.Recovery(), middleware.Logger(), middleware.BasicAuth())

	// router.Use(gin.Logger())

	router.Run()
}
