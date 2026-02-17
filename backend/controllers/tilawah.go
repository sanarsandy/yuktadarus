package controllers

import (
	"net/http"
	"odoj-backend/models"

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

	// Fetch user for last read position
	var user models.User
	if err := models.DB.First(&user, userId).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user data"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": progress,
		"last_read": gin.H{
			"juz":   user.LastReadJuz,
			"ayah":  user.LastReadAyah,
			"surah": user.LastReadSurah,
		},
	})
}

func (c *TilawahController) ToggleJuz(ctx *gin.Context) {
	userId, _ := ctx.Get("userID")
	
	// Parse JSON body: { "juz_number": 1, "is_read": true }
	var input struct {
		JuzNumber int  `json:"juz_number" binding:"required"`
		IsRead    bool `json:"is_read"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate Juz Number
	if input.JuzNumber < 1 || input.JuzNumber > 30 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Juz number must be between 1 and 30"})
		return
	}

	var progress models.JuzProgress
	// Check if already exists
	err := models.DB.Where("user_id = ? AND juz_number = ?", userId, input.JuzNumber).First(&progress).Error
	
	if err != nil {
		// New record
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
		// Update existing
		progress.IsRead = input.IsRead
		if saveErr := models.DB.Save(&progress).Error; saveErr != nil {
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update progress"})
			return
		}
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Progress updated", "data": progress})
}

type PositionInput struct {
	JuzNumber  int    `json:"juz_number" binding:"required"`
	AyahNumber int    `json:"ayah_number" binding:"required"`
	SurahName  string `json:"surah_name" binding:"required"`
}

func (c *TilawahController) UpdatePosition(ctx *gin.Context) {
	userId, exists := ctx.Get("userID")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var input PositionInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update User model directly
	if err := models.DB.Model(&models.User{}).Where("id = ?", userId).Updates(map[string]interface{}{
		"last_read_juz":   input.JuzNumber,
		"last_read_ayah":  input.AyahNumber,
		"last_read_surah": input.SurahName,
	}).Error; err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update position"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Position updated"})
}
