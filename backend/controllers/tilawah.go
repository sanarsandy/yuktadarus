package controllers

import (
	"net/http"
	"odoj-backend/models"
	"time"

	"github.com/gin-gonic/gin"
)

type TilawahController struct{}

func (c *TilawahController) GetProgress(ctx *gin.Context) {
	userId, _ := ctx.Get("userID")

	var progress []models.JuzProgress
	if err := models.DB.Where("user_id = ?", userId).Find(&progress).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch progress"})
		return
	}

	// Fetch user for last read position and goal
	var user models.User
	if err := models.DB.First(&user, userId).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user data"})
		return
	}

	// Fetch all reading positions
	var positions []models.ReadingPosition
	models.DB.Where("user_id = ?", userId).Order("updated_at DESC").Find(&positions)

	ctx.JSON(http.StatusOK, gin.H{
		"data": progress,
		"last_read": gin.H{
			"juz":   user.LastReadJuz,
			"ayah":  user.LastReadAyah,
			"surah": user.LastReadSurah,
		},
		"positions": positions,
		"goal": gin.H{
			"type":   user.GoalType,
			"target": user.GoalTarget,
		},
	})
}

func (c *TilawahController) ToggleJuz(ctx *gin.Context) {
	userId, _ := ctx.Get("userID")
	
	var input struct {
		JuzNumber int  `json:"juz_number" binding:"required"`
		IsRead    bool `json:"is_read"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if input.JuzNumber < 1 || input.JuzNumber > 30 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Juz number must be between 1 and 30"})
		return
	}

	var progress models.JuzProgress
	err := models.DB.Where("user_id = ? AND juz_number = ?", userId, input.JuzNumber).First(&progress).Error
	
	if err != nil {
		progress = models.JuzProgress{
			UserID:    userId.(uint),
			JuzNumber: input.JuzNumber,
			IsRead:    input.IsRead,
		}
		if createErr := models.DB.Create(&progress).Error; createErr != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save progress"})
			return
		}
	} else {
		progress.IsRead = input.IsRead
		if saveErr := models.DB.Save(&progress).Error; saveErr != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update progress"})
			return
		}
	}

	// Auto-complete circle assignments when juz is marked as read
	if input.IsRead {
		var assignments []models.JuzAssignment
		models.DB.Where("user_id = ? AND juz_number = ? AND status IN ?",
			userId, input.JuzNumber, []string{"pending", "in_progress"}).Find(&assignments)

		for _, a := range assignments {
			now := time.Now()
			a.Status = "completed"
			a.CompletedAt = &now
			models.DB.Save(&a)

			var memberXP models.MemberXP
			if err := models.DB.Where("circle_id = ? AND user_id = ?", a.CircleID, userId).First(&memberXP).Error; err != nil {
				memberXP = models.MemberXP{CircleID: a.CircleID, UserID: userId.(uint), XP: 0, Level: 1}
				models.DB.Create(&memberXP)
			}
			memberXP.XP += 10
			memberXP.Level = models.CalculateLevel(memberXP.XP)
			models.DB.Save(&memberXP)

			var stats models.CircleStats
			if err := models.DB.Where("circle_id = ?", a.CircleID).First(&stats).Error; err != nil {
				stats = models.CircleStats{CircleID: a.CircleID}
				models.DB.Create(&stats)
			}
			stats.TotalXP += 10
			models.DB.Save(&stats)
		}
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Progress updated", "data": progress})
}

// UpdatePosition saves reading position for a specific juz (per-juz tracking)
func (c *TilawahController) UpdatePosition(ctx *gin.Context) {
	userId, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var input struct {
		JuzNumber  int    `json:"juz_number" binding:"required"`
		AyahNumber int    `json:"ayah_number" binding:"required"`
		SurahName  string `json:"surah_name" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 1. Update global last read (for quick dashboard access)
	if err := models.DB.Model(&models.User{}).Where("id = ?", userId).Updates(map[string]interface{}{
		"last_read_juz":   input.JuzNumber,
		"last_read_ayah":  input.AyahNumber,
		"last_read_surah": input.SurahName,
	}).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update position"})
		return
	}

	// 2. Upsert per-juz reading position
	var pos models.ReadingPosition
	err := models.DB.Where("user_id = ? AND juz_number = ?", userId, input.JuzNumber).First(&pos).Error
	if err != nil {
		// Create new
		pos = models.ReadingPosition{
			UserID:    userId.(uint),
			JuzNumber: input.JuzNumber,
			Ayah:      input.AyahNumber,
			Surah:     input.SurahName,
		}
		models.DB.Create(&pos)
	} else {
		// Update existing
		pos.Ayah = input.AyahNumber
		pos.Surah = input.SurahName
		models.DB.Save(&pos)
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Position updated"})
}

// GetReadingPositions returns all per-juz reading positions for the user
func (c *TilawahController) GetReadingPositions(ctx *gin.Context) {
	userId, _ := ctx.Get("userID")

	var positions []models.ReadingPosition
	if err := models.DB.Where("user_id = ?", userId).Order("updated_at DESC").Find(&positions).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch positions"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"data": positions})
}

// SetGoal updates the user's reading goal
func (c *TilawahController) SetGoal(ctx *gin.Context) {
	userId, _ := ctx.Get("userID")

	var input struct {
		GoalType   string `json:"goal_type" binding:"required"`
		GoalTarget int    `json:"goal_target"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate goal type
	validTypes := map[string]bool{
		"free": true, "khatam_30": true, "khatam_60": true, "ayat": true, "custom": true,
	}
	if !validTypes[input.GoalType] {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid goal type"})
		return
	}

	if err := models.DB.Model(&models.User{}).Where("id = ?", userId).Updates(map[string]interface{}{
		"goal_type":   input.GoalType,
		"goal_target": input.GoalTarget,
	}).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update goal"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "Goal updated",
		"goal": gin.H{
			"type":   input.GoalType,
			"target": input.GoalTarget,
		},
	})
}

// GetGoal returns the user's current goal
func (c *TilawahController) GetGoal(ctx *gin.Context) {
	userId, _ := ctx.Get("userID")

	var user models.User
	if err := models.DB.Select("goal_type", "goal_target").First(&user, userId).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch goal"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"goal": gin.H{
			"type":   user.GoalType,
			"target": user.GoalTarget,
		},
	})
}
