package main

import (
	"log"
	"odoj-backend/controllers"
	"odoj-backend/middleware"
	"odoj-backend/models"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env if exists (local dev)
	godotenv.Load()

	// Connect to Database
	models.ConnectDatabase()

	// Initialize Router
	r := gin.Default()

	// CORS Configuration
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true // For development. In production, be specific.
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	r.Use(cors.New(config))

	// Routes
	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", controllers.Register)
			auth.POST("/login", controllers.Login)
		}

		// Tilawah Routes (Protected)
		tilawah := api.Group("/tilawah")
		tilawah.Use(middleware.JwtAuthMiddleware())
		{
			tilawahController := controllers.TilawahController{}
			tilawah.GET("", tilawahController.GetProgress)
			tilawah.POST("", tilawahController.ToggleJuz)
			tilawah.PUT("/position", tilawahController.UpdatePosition)
			tilawah.GET("/positions", tilawahController.GetReadingPositions)
			tilawah.PUT("/goal", tilawahController.SetGoal)
			tilawah.GET("/goal", tilawahController.GetGoal)
		}

		// Circle Routes (Protected)
		circles := api.Group("/circles")
		circles.Use(middleware.JwtAuthMiddleware())
		{
			circleController := controllers.CircleController{}
			circles.POST("", circleController.CreateCircle)
			circles.GET("/my", circleController.GetMyCircles)
			circles.GET("/:id", circleController.GetCircleDetail)
			circles.POST("/join", circleController.JoinCircle)
			circles.DELETE("/:id/leave", circleController.LeaveCircle)
			circles.POST("/:id/assign", circleController.AssignJuz)
			circles.GET("/:id/leaderboard", circleController.GetLeaderboard)
			circles.PUT("/:id/scheme", circleController.SetScheme)
			circles.POST("/:id/auto-assign", circleController.AutoAssign)
			circles.PUT("/:id/assign/:assignId/status", circleController.UpdateAssignmentStatus)
			circles.GET("/:id/stats", circleController.GetCircleStats)
			circles.GET("/:id/my-assignments", circleController.GetMyAssignments)
			circles.POST("/:id/daily-assign", circleController.DailyAssign)
		}
	}

	// Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("Server running on port " + port)
	r.Run(":" + port)
}
