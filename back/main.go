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
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowWildcard:    true,
		MaxAge:           12 * 3600,
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

	// Creación de las instancias de los servicios categorias
	categoriesService := &services.CategoriesService{}
	categoriesService.InitService(db)

	categoriesController := &controllers.CategoriesController{}
	categoriesController.InitCategoriesControllerRouters(router, *categoriesService)

	// Creación de las instancias de los servicios subCategorias

	subCategoriesService := &services.SubCategoriesService{}
	subCategoriesService.InitSubCategoriesService(db)

	subCategoriesController := &controllers.SubCategoriesController{}
	subCategoriesController.InitSubCategoriesControllerRouters(router, *subCategoriesService)

	// Configuración para HTTPS
	// certFile := "C:\\Users\\seba1\\Desktop\\Certificado SSL\\Certificado SSL\\certificate.crt"
	// keyFile := "C:\\Users\\seba1\\Desktop\\Certificado SSL\\Certificado SSL\\private.key"

	// router.RunTLS(":443", certFile, keyFile)
	router.Run(":8080")
}
