package models

import (
	"time"

	"gorm.io/gorm"
)

// ReadingPosition stores per-juz reading position for each user
type ReadingPosition struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	UserID    uint           `json:"user_id" gorm:"uniqueIndex:idx_user_juz"`
	JuzNumber int            `json:"juz_number" gorm:"uniqueIndex:idx_user_juz"`
	Ayah      int            `json:"ayah"`
	Surah     string         `json:"surah"`
}

// Goal type constants
const (
	GoalFree       = "free"        // No target, just track reading
	GoalKhatam30   = "khatam_30"   // 1 juz per day (30 day khatam)
	GoalKhatam60   = "khatam_60"   // 0.5 juz per day
	GoalAyat       = "ayat"        // X ayat per day
	GoalCustom     = "custom"      // Custom juz per day
)
