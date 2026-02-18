package models

import (
	"math/rand"
	"time"

	"gorm.io/gorm"
)

// Scheme constants
const (
	SchemeKhatamBersama = "khatam_bersama"
	SchemeTartilHarian  = "tartil_harian"
	SchemeKhatamRace    = "khatam_race"
)

// Assignment status constants
const (
	StatusPending    = "pending"
	StatusInProgress = "in_progress"
	StatusCompleted  = "completed"
)

type Circle struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
	Name        string         `json:"name"`
	InviteCode  string         `json:"invite_code" gorm:"uniqueIndex;size:6"`
	AdminID     uint           `json:"admin_id"`
	Description string         `json:"description"`
	Scheme      string         `json:"scheme" gorm:"default:khatam_bersama"`
	Members     []CircleMember  `json:"members" gorm:"foreignKey:CircleID"`
	Assignments []JuzAssignment `json:"assignments,omitempty" gorm:"foreignKey:CircleID"`
}

type CircleMember struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
	CircleID  uint           `json:"circle_id"`
	UserID    uint           `json:"user_id"`
	User      User           `json:"user" gorm:"foreignKey:UserID"`
	Role      string         `json:"role" gorm:"default:member"` // admin | member
}

type JuzAssignment struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
	CircleID    uint           `json:"circle_id"`
	UserID      uint           `json:"user_id"`
	User        User           `json:"user" gorm:"foreignKey:UserID"`
	JuzNumber   int            `json:"juz_number"`
	Status      string         `json:"status" gorm:"default:pending"` // pending | in_progress | completed
	DayNumber   int            `json:"day_number"`                    // For tartil_harian: day of rotation
	Deadline    *time.Time     `json:"deadline,omitempty"`
	CompletedAt *time.Time     `json:"completed_at,omitempty"`
}

type CircleStats struct {
	ID             uint       `gorm:"primaryKey" json:"id"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      time.Time  `json:"updated_at"`
	CircleID       uint       `json:"circle_id" gorm:"uniqueIndex"`
	TotalXP        int        `json:"total_xp" gorm:"default:0"`
	CircleStreak   int        `json:"circle_streak" gorm:"default:0"`
	KhatamCount    int        `json:"khatam_count" gorm:"default:0"`
	LastActiveDate *time.Time `json:"last_active_date"`
}

type MemberXP struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	CircleID  uint      `json:"circle_id"`
	UserID    uint      `json:"user_id"`
	User      User      `json:"user" gorm:"foreignKey:UserID"`
	XP        int       `json:"xp" gorm:"default:0"`
	Level     int       `json:"level" gorm:"default:1"`
}

// XP thresholds for each level
var LevelThresholds = []int{0, 0, 30, 80, 150, 250, 400, 600, 850, 1200, 1600}

// LevelTitles maps level number to display name
var LevelTitles = map[int]string{
	1:  "Pemula",
	2:  "Rajin",
	3:  "Istiqomah",
	4:  "Penghafal",
	5:  "Hafiz",
	6:  "Qori",
	7:  "Mujahid",
	8:  "Khatam Master",
	9:  "Ulama",
	10: "Imam",
}

// CalculateLevel returns the level for a given XP amount
func CalculateLevel(xp int) int {
	level := 1
	for i := len(LevelThresholds) - 1; i >= 1; i-- {
		if xp >= LevelThresholds[i] {
			level = i
			break
		}
	}
	return level
}

// GenerateInviteCode creates a unique 6-char uppercase invite code
func GenerateInviteCode() string {
	const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // No ambiguous chars
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	code := make([]byte, 6)
	for i := range code {
		code[i] = charset[r.Intn(len(charset))]
	}
	return string(code)
}
