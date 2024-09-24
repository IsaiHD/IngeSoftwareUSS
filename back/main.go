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

	// Creación de las instancias de los servicios
	activityService := &services.ActivityService{}
	activityService.InitService(db)
	activitiesController := &controllers.ActivityController{}
	activitiesController.InitActivityControllerRouters(router, *activityService)

	// Creación de las instancias de auth
	authService := services.InitAuthService(db)

	// Creación de las instancias de los servicios personas
	personService := &services.PersonService{}
	personService.InitService(db)
	personController := &controllers.PersonController{}
	personController.InitPersonControllerRouters(router, *personService)

	authController := controllers.InitAuthController(authService)
	authController.InitRoutes(router)

	// router.Use(gin.Recovery(), gin.Logger(), middleware.AuthMiddleware())

	router.Run()
}
