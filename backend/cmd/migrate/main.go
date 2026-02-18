package main

import (
	"log"
	"macaquran-backend/models"

	"github.com/joho/godotenv"
)

func main() {
	// Load .env if exists (for local testing)
	godotenv.Load()

	log.Println("Starting database migration...")
	
	// This function connects to DB and runs AutoMigrate
	models.ConnectDatabase()
	
	log.Println("Database migration completed successfully.")
}
