package main

import (
	"ingsoft/controllers"
	"ingsoft/internal/initializers"
	"ingsoft/middleware"
	"ingsoft/services"
	"io"
	"os"

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
	db := initializers.InitDB()

	println("DB: ", db)

	if db == nil {
		return
	}

	activityService := &services.ActivityService{}
	activityService.InitService(db)

	router.Use(gin.Recovery(), middleware.Logger(), middleware.BasicAuth())

	router.Use(gin.Logger())

	activitiesController := &controllers.ActivityController{}
	activitiesController.InitActivityControllerRouters(router, *activityService)

	router.Run()
}
