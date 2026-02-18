package models

import (
	"fmt"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

type User struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	Name      string         `json:"name"`
	Email     string         `json:"email" gorm:"unique"`
	Password  string         `json:"-"` // Don't return password in JSON

	// Relationships
	JuzProgress      []JuzProgress      `json:"juz_progress" gorm:"foreignKey:UserID"`
	ReadingPositions []ReadingPosition  `json:"reading_positions,omitempty" gorm:"foreignKey:UserID"`

	// Last Read Position (global — for quick access)
	LastReadJuz   int    `json:"last_read_juz"`
	LastReadAyah  int    `json:"last_read_ayah"`
	LastReadSurah string `json:"last_read_surah"`

	// Goal settings
	GoalType   string `json:"goal_type" gorm:"default:free"`   // free, khatam_30, khatam_60, ayat, custom
	GoalTarget int    `json:"goal_target" gorm:"default:0"`    // target value (e.g. ayat count per day)
}

func ConnectDatabase() {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	// Auto Migrate
	database.AutoMigrate(&User{}, &JuzProgress{}, &ReadingPosition{}, &Circle{}, &CircleMember{}, &JuzAssignment{}, &CircleStats{}, &MemberXP{})

	DB = database
}
