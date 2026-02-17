package models

import (
	"time"

	"gorm.io/gorm"
)

type JuzProgress struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	UserID    uint           `json:"user_id"`
	JuzNumber int            `json:"juz_number"` // 1-30
	IsRead    bool           `json:"is_read" gorm:"default:false"`
}
