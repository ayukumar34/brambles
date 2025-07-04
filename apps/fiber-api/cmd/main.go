package main

import (
	"log"
	"os"

	"github.com/ayukumar34/brambles/packages/database"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: Could not load .env file:", err)
	}

	// Get database connection string
	dsn := os.Getenv("SUPABASE_DATABASE_CONNECTION_STRING")
	if dsn == "" {
		log.Fatalf("SUPABASE_DATABASE_CONNECTION_STRING is not set")
	}

	// Connect to database
	db, err := database.ConnectToDatabase(dsn)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Run database migrations
	log.Println("Running database migrations...")
	if err := database.Migrate(db); err != nil {
		log.Fatalf("Failed to run database migrations: %v", err)
	}
	log.Println("Database migrations completed successfully!")

	// Initialize app
	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, Fiber! Database connected and migrated!")
	})

	// Add health check endpoint
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":   "healthy",
			"database": "connected",
		})
	})

	log.Println("Server starting on port 8080...")
	if err := app.Listen(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
