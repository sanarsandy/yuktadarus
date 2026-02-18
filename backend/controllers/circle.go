package controllers

import (
	"net/http"
	"odoj-backend/models"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type CircleController struct{}

// --- Input structs ---

type CreateCircleInput struct {
	Name        string `json:"name" binding:"required"`
	Description string `json:"description"`
	Scheme      string `json:"scheme"`
}

type JoinCircleInput struct {
	InviteCode string `json:"invite_code" binding:"required"`
}

type AssignJuzInput struct {
	UserID    uint `json:"user_id" binding:"required"`
	JuzNumber int  `json:"juz_number" binding:"required,min=1,max=30"`
}

type SetSchemeInput struct {
	Scheme string `json:"scheme" binding:"required"`
}

type UpdateStatusInput struct {
	Status string `json:"status" binding:"required"`
}

type DailyAssignInput struct {
	Assignments []struct {
		UserID    uint `json:"user_id"`
		JuzNumber int  `json:"juz_number"`
	} `json:"assignments" binding:"required"`
	DayNumber int `json:"day_number"`
}

// --- Helpers ---

func getUserID(c *gin.Context) uint {
	return c.MustGet("userID").(uint)
}

func awardXP(circleID uint, userID uint, amount int) {
	var memberXP models.MemberXP
	err := models.DB.Where("circle_id = ? AND user_id = ?", circleID, userID).First(&memberXP).Error
	if err != nil {
		memberXP = models.MemberXP{
			CircleID: circleID,
			UserID:   userID,
			XP:       amount,
			Level:    models.CalculateLevel(amount),
		}
		models.DB.Create(&memberXP)
	} else {
		memberXP.XP += amount
		memberXP.Level = models.CalculateLevel(memberXP.XP)
		models.DB.Save(&memberXP)
	}

	// Update circle total XP
	var stats models.CircleStats
	err = models.DB.Where("circle_id = ?", circleID).First(&stats).Error
	if err != nil {
		now := time.Now()
		stats = models.CircleStats{
			CircleID:       circleID,
			TotalXP:        amount,
			CircleStreak:   1,
			LastActiveDate: &now,
		}
		models.DB.Create(&stats)
	} else {
		stats.TotalXP += amount
		now := time.Now()
		// Update streak
		if stats.LastActiveDate != nil {
			daysSince := int(now.Sub(*stats.LastActiveDate).Hours() / 24)
			if daysSince <= 1 {
				if daysSince == 1 {
					stats.CircleStreak++
				}
			} else {
				stats.CircleStreak = 1
			}
		}
		stats.LastActiveDate = &now
		models.DB.Save(&stats)
	}
}

func checkCircleKhatam(circleID uint) {
	var circle models.Circle
	models.DB.First(&circle, circleID)

	if circle.Scheme == models.SchemeKhatamBersama {
		var totalAssigned int64
		models.DB.Model(&models.JuzAssignment{}).Where("circle_id = ?", circleID).Count(&totalAssigned)
		var totalCompleted int64
		models.DB.Model(&models.JuzAssignment{}).Where("circle_id = ? AND status = ?", circleID, models.StatusCompleted).Count(&totalCompleted)

		if totalAssigned > 0 && totalCompleted == totalAssigned {
			var stats models.CircleStats
			if err := models.DB.Where("circle_id = ?", circleID).First(&stats).Error; err == nil {
				stats.KhatamCount++
				models.DB.Save(&stats)
			}
			// Award milestone XP to all members
			var members []models.CircleMember
			models.DB.Where("circle_id = ?", circleID).Find(&members)
			for _, m := range members {
				awardXP(circleID, m.UserID, 50) // Khatam milestone bonus
			}
		}
	}
}

// --- Handlers ---

// CreateCircle creates a new circle and makes the creator an admin member
func (cc *CircleController) CreateCircle(c *gin.Context) {
	var input CreateCircleInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": formatValidationError(err)})
		return
	}

	userID := getUserID(c)

	scheme := input.Scheme
	if scheme == "" {
		scheme = models.SchemeKhatamBersama
	}

	// Generate unique invite code
	var code string
	for i := 0; i < 10; i++ {
		code = models.GenerateInviteCode()
		var count int64
		models.DB.Model(&models.Circle{}).Where("invite_code = ?", code).Count(&count)
		if count == 0 {
			break
		}
	}

	circle := models.Circle{
		Name:        input.Name,
		Description: input.Description,
		AdminID:     userID,
		InviteCode:  code,
		Scheme:      scheme,
	}

	if err := models.DB.Create(&circle).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create circle"})
		return
	}

	// Add creator as admin member
	member := models.CircleMember{
		CircleID: circle.ID,
		UserID:   userID,
		Role:     "admin",
	}
	models.DB.Create(&member)

	// Initialize circle stats
	now := time.Now()
	stats := models.CircleStats{
		CircleID:       circle.ID,
		LastActiveDate: &now,
	}
	models.DB.Create(&stats)

	// Initialize member XP
	memberXP := models.MemberXP{
		CircleID: circle.ID,
		UserID:   userID,
	}
	models.DB.Create(&memberXP)

	models.DB.Preload("Members.User").First(&circle, circle.ID)

	c.JSON(http.StatusCreated, gin.H{"circle": circle})
}

// GetMyCircles returns all circles the user is a member of
func (cc *CircleController) GetMyCircles(c *gin.Context) {
	userID := getUserID(c)

	var memberships []models.CircleMember
	models.DB.Where("user_id = ?", userID).Find(&memberships)

	circleIDs := make([]uint, len(memberships))
	for i, m := range memberships {
		circleIDs[i] = m.CircleID
	}

	var circles []models.Circle
	if len(circleIDs) > 0 {
		models.DB.Preload("Members.User").Where("id IN ?", circleIDs).Find(&circles)
	}

	c.JSON(http.StatusOK, gin.H{"circles": circles})
}

// GetCircleDetail returns full circle info with members, progress, XP, and stats
func (cc *CircleController) GetCircleDetail(c *gin.Context) {
	circleID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid circle ID"})
		return
	}

	userID := getUserID(c)

	var membership models.CircleMember
	if err := models.DB.Where("circle_id = ? AND user_id = ?", circleID, userID).First(&membership).Error; err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not a member of this circle"})
		return
	}

	var circle models.Circle
	if err := models.DB.Preload("Members.User").Preload("Assignments.User").First(&circle, circleID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Circle not found"})
		return
	}

	// Get progress + XP for each member
	type MemberWithProgress struct {
		models.CircleMember
		TotalJuzDone int    `json:"total_juz_done"`
		XP           int    `json:"xp"`
		Level        int    `json:"level"`
		LevelTitle   string `json:"level_title"`
	}

	membersWithProgress := make([]MemberWithProgress, len(circle.Members))
	for i, m := range circle.Members {
		var juzCount int64
		models.DB.Model(&models.JuzProgress{}).Where("user_id = ? AND is_read = true", m.UserID).Count(&juzCount)

		var memberXP models.MemberXP
		xp, level := 0, 1
		if err := models.DB.Where("circle_id = ? AND user_id = ?", circleID, m.UserID).First(&memberXP).Error; err == nil {
			xp = memberXP.XP
			level = memberXP.Level
		}

		membersWithProgress[i] = MemberWithProgress{
			CircleMember: m,
			TotalJuzDone: int(juzCount),
			XP:           xp,
			Level:        level,
			LevelTitle:   models.LevelTitles[level],
		}
	}

	// Get circle stats
	var stats models.CircleStats
	models.DB.Where("circle_id = ?", circleID).First(&stats)

	// Calculate circle completion
	var totalAssigned int64
	var totalCompleted int64
	models.DB.Model(&models.JuzAssignment{}).Where("circle_id = ?", circleID).Count(&totalAssigned)
	models.DB.Model(&models.JuzAssignment{}).Where("circle_id = ? AND status = ?", circleID, models.StatusCompleted).Count(&totalCompleted)

	completionPct := 0
	if totalAssigned > 0 {
		completionPct = int(float64(totalCompleted) / float64(totalAssigned) * 100)
	}

	c.JSON(http.StatusOK, gin.H{
		"circle":         circle,
		"members":        membersWithProgress,
		"stats":          stats,
		"completion_pct": completionPct,
	})
}

// JoinCircle allows a user to join a circle via invite code
func (cc *CircleController) JoinCircle(c *gin.Context) {
	var input JoinCircleInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invite code is required"})
		return
	}

	userID := getUserID(c)

	var circle models.Circle
	if err := models.DB.Where("invite_code = ?", input.InviteCode).First(&circle).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Invalid invite code"})
		return
	}

	var existing models.CircleMember
	if err := models.DB.Where("circle_id = ? AND user_id = ?", circle.ID, userID).First(&existing).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You are already a member of this circle"})
		return
	}

	member := models.CircleMember{
		CircleID: circle.ID,
		UserID:   userID,
		Role:     "member",
	}
	models.DB.Create(&member)

	// Initialize member XP
	memberXP := models.MemberXP{
		CircleID: circle.ID,
		UserID:   userID,
	}
	models.DB.Create(&memberXP)

	models.DB.Preload("Members.User").First(&circle, circle.ID)

	c.JSON(http.StatusOK, gin.H{
		"message": "Joined circle successfully",
		"circle":  circle,
	})
}

// LeaveCircle
func (cc *CircleController) LeaveCircle(c *gin.Context) {
	circleID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid circle ID"})
		return
	}

	userID := getUserID(c)

	var circle models.Circle
	if err := models.DB.First(&circle, circleID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Circle not found"})
		return
	}

	if circle.AdminID == userID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Admin cannot leave the circle. Transfer admin first or delete the circle."})
		return
	}

	models.DB.Where("circle_id = ? AND user_id = ?", circleID, userID).Delete(&models.CircleMember{})
	models.DB.Where("circle_id = ? AND user_id = ?", circleID, userID).Delete(&models.JuzAssignment{})
	models.DB.Where("circle_id = ? AND user_id = ?", circleID, userID).Delete(&models.MemberXP{})

	c.JSON(http.StatusOK, gin.H{"message": "Left circle successfully"})
}

// SetScheme allows admin to change the circle scheme
func (cc *CircleController) SetScheme(c *gin.Context) {
	circleID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid circle ID"})
		return
	}

	var input SetSchemeInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Scheme is required"})
		return
	}

	// Validate scheme
	validSchemes := map[string]bool{
		models.SchemeKhatamBersama: true,
		models.SchemeTartilHarian:  true,
		models.SchemeKhatamRace:    true,
	}
	if !validSchemes[input.Scheme] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid scheme. Must be khatam_bersama, tartil_harian, or khatam_race"})
		return
	}

	userID := getUserID(c)
	var circle models.Circle
	if err := models.DB.First(&circle, circleID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Circle not found"})
		return
	}
	if circle.AdminID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admin can change scheme"})
		return
	}

	circle.Scheme = input.Scheme
	models.DB.Save(&circle)

	c.JSON(http.StatusOK, gin.H{"message": "Scheme updated", "circle": circle})
}

// AutoAssign splits 30 juz evenly among members (for khatam_bersama)
func (cc *CircleController) AutoAssign(c *gin.Context) {
	circleID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid circle ID"})
		return
	}

	userID := getUserID(c)
	var circle models.Circle
	if err := models.DB.First(&circle, circleID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Circle not found"})
		return
	}
	if circle.AdminID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admin can auto-assign"})
		return
	}

	// Clear existing assignments
	models.DB.Where("circle_id = ?", circleID).Delete(&models.JuzAssignment{})

	// Get members
	var members []models.CircleMember
	models.DB.Where("circle_id = ?", circleID).Find(&members)

	if len(members) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No members in circle"})
		return
	}

	// Distribute 30 juz round-robin
	assignments := make([]models.JuzAssignment, 30)
	for juz := 1; juz <= 30; juz++ {
		memberIdx := (juz - 1) % len(members)
		assignments[juz-1] = models.JuzAssignment{
			CircleID:  uint(circleID),
			UserID:    members[memberIdx].UserID,
			JuzNumber: juz,
			Status:    models.StatusPending,
		}
	}

	models.DB.Create(&assignments)

	// Reload
	var result []models.JuzAssignment
	models.DB.Preload("User").Where("circle_id = ?", circleID).Order("juz_number").Find(&result)

	c.JSON(http.StatusOK, gin.H{"assignments": result})
}

// AssignJuz allows admin to assign a juz to a member
func (cc *CircleController) AssignJuz(c *gin.Context) {
	circleID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid circle ID"})
		return
	}

	var input AssignJuzInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": formatValidationError(err)})
		return
	}

	userID := getUserID(c)

	var circle models.Circle
	if err := models.DB.First(&circle, circleID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Circle not found"})
		return
	}
	if circle.AdminID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admin can assign juz"})
		return
	}

	var member models.CircleMember
	if err := models.DB.Where("circle_id = ? AND user_id = ?", circleID, input.UserID).First(&member).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User is not a member of this circle"})
		return
	}

	var existingAssignment models.JuzAssignment
	if err := models.DB.Where("circle_id = ? AND juz_number = ?", circleID, input.JuzNumber).First(&existingAssignment).Error; err == nil {
		existingAssignment.UserID = input.UserID
		existingAssignment.Status = models.StatusPending
		models.DB.Save(&existingAssignment)
	} else {
		assignment := models.JuzAssignment{
			CircleID:  uint(circleID),
			UserID:    input.UserID,
			JuzNumber: input.JuzNumber,
			Status:    models.StatusPending,
		}
		models.DB.Create(&assignment)
	}

	var assignments []models.JuzAssignment
	models.DB.Preload("User").Where("circle_id = ?", circleID).Order("juz_number").Find(&assignments)

	c.JSON(http.StatusOK, gin.H{"assignments": assignments})
}

// UpdateAssignmentStatus allows a member to update their assignment status
func (cc *CircleController) UpdateAssignmentStatus(c *gin.Context) {
	circleID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid circle ID"})
		return
	}

	assignID, err := strconv.Atoi(c.Param("assignId"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid assignment ID"})
		return
	}

	var input UpdateStatusInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Status is required"})
		return
	}

	// Validate status
	validStatuses := map[string]bool{
		models.StatusPending:    true,
		models.StatusInProgress: true,
		models.StatusCompleted:  true,
	}
	if !validStatuses[input.Status] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status"})
		return
	}

	userID := getUserID(c)

	var assignment models.JuzAssignment
	if err := models.DB.Where("id = ? AND circle_id = ?", assignID, circleID).First(&assignment).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Assignment not found"})
		return
	}

	// Only the assigned user or admin can update
	var circle models.Circle
	models.DB.First(&circle, circleID)
	if assignment.UserID != userID && circle.AdminID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only update your own assignments"})
		return
	}

	wasCompleted := assignment.Status == models.StatusCompleted
	assignment.Status = input.Status

	if input.Status == models.StatusCompleted && !wasCompleted {
		now := time.Now()
		assignment.CompletedAt = &now

		// Award XP: +10 for completion, +5 bonus if before deadline
		xpAmount := 10
		if assignment.Deadline != nil && now.Before(*assignment.Deadline) {
			xpAmount += 5
		}
		awardXP(uint(circleID), assignment.UserID, xpAmount)
	}

	if input.Status != models.StatusCompleted {
		assignment.CompletedAt = nil
	}

	models.DB.Save(&assignment)

	// Check if circle khatam
	if input.Status == models.StatusCompleted {
		checkCircleKhatam(uint(circleID))
	}

	c.JSON(http.StatusOK, gin.H{"assignment": assignment})
}

// GetMyAssignments returns the current user's assignments in a circle
func (cc *CircleController) GetMyAssignments(c *gin.Context) {
	circleID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid circle ID"})
		return
	}

	userID := getUserID(c)

	var assignments []models.JuzAssignment
	models.DB.Where("circle_id = ? AND user_id = ?", circleID, userID).Order("juz_number").Find(&assignments)

	c.JSON(http.StatusOK, gin.H{"assignments": assignments})
}

// GetCircleStats returns gamification stats for a circle
func (cc *CircleController) GetCircleStats(c *gin.Context) {
	circleID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid circle ID"})
		return
	}

	userID := getUserID(c)

	// Check membership
	var membership models.CircleMember
	if err := models.DB.Where("circle_id = ? AND user_id = ?", circleID, userID).First(&membership).Error; err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not a member of this circle"})
		return
	}

	var stats models.CircleStats
	models.DB.Where("circle_id = ?", circleID).First(&stats)

	// Get all member XPs
	var memberXPs []models.MemberXP
	models.DB.Preload("User").Where("circle_id = ?", circleID).Order("xp DESC").Find(&memberXPs)

	type MemberXPResponse struct {
		UserID     uint   `json:"user_id"`
		Name       string `json:"name"`
		XP         int    `json:"xp"`
		Level      int    `json:"level"`
		LevelTitle string `json:"level_title"`
	}

	xpList := make([]MemberXPResponse, len(memberXPs))
	for i, mx := range memberXPs {
		xpList[i] = MemberXPResponse{
			UserID:     mx.UserID,
			Name:       mx.User.Name,
			XP:         mx.XP,
			Level:      mx.Level,
			LevelTitle: models.LevelTitles[mx.Level],
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"stats":      stats,
		"member_xps": xpList,
	})
}

// DailyAssign creates daily assignments (for tartil_harian scheme)
func (cc *CircleController) DailyAssign(c *gin.Context) {
	circleID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid circle ID"})
		return
	}

	var input DailyAssignInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": formatValidationError(err)})
		return
	}

	userID := getUserID(c)

	var circle models.Circle
	if err := models.DB.First(&circle, circleID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Circle not found"})
		return
	}
	if circle.AdminID != userID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only admin can set daily assignments"})
		return
	}

	// Set deadline to end of today
	now := time.Now()
	endOfDay := time.Date(now.Year(), now.Month(), now.Day(), 23, 59, 59, 0, now.Location())

	for _, a := range input.Assignments {
		assignment := models.JuzAssignment{
			CircleID:  uint(circleID),
			UserID:    a.UserID,
			JuzNumber: a.JuzNumber,
			Status:    models.StatusPending,
			DayNumber: input.DayNumber,
			Deadline:  &endOfDay,
		}
		models.DB.Create(&assignment)
	}

	var result []models.JuzAssignment
	models.DB.Preload("User").Where("circle_id = ?", circleID).Order("day_number, juz_number").Find(&result)

	c.JSON(http.StatusOK, gin.H{"assignments": result})
}

// GetLeaderboard returns circle members ranked by juz completed
func (cc *CircleController) GetLeaderboard(c *gin.Context) {
	circleID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid circle ID"})
		return
	}

	userID := getUserID(c)

	var membership models.CircleMember
	if err := models.DB.Where("circle_id = ? AND user_id = ?", circleID, userID).First(&membership).Error; err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "You are not a member of this circle"})
		return
	}

	var members []models.CircleMember
	models.DB.Preload("User").Where("circle_id = ?", circleID).Find(&members)

	type LeaderboardEntry struct {
		Rank         int    `json:"rank"`
		UserID       uint   `json:"user_id"`
		Name         string `json:"name"`
		TotalJuzDone int    `json:"total_juz_done"`
		Role         string `json:"role"`
		XP           int    `json:"xp"`
		Level        int    `json:"level"`
		LevelTitle   string `json:"level_title"`
	}

	entries := make([]LeaderboardEntry, len(members))
	for i, m := range members {
		var count int64
		models.DB.Model(&models.JuzProgress{}).Where("user_id = ? AND is_read = true", m.UserID).Count(&count)

		var memberXP models.MemberXP
		xp, level := 0, 1
		if err := models.DB.Where("circle_id = ? AND user_id = ?", circleID, m.UserID).First(&memberXP).Error; err == nil {
			xp = memberXP.XP
			level = memberXP.Level
		}

		entries[i] = LeaderboardEntry{
			UserID:       m.UserID,
			Name:         m.User.Name,
			TotalJuzDone: int(count),
			Role:         m.Role,
			XP:           xp,
			Level:        level,
			LevelTitle:   models.LevelTitles[level],
		}
	}

	// Sort by XP descending
	for i := 0; i < len(entries); i++ {
		for j := i + 1; j < len(entries); j++ {
			if entries[j].XP > entries[i].XP {
				entries[i], entries[j] = entries[j], entries[i]
			}
		}
	}

	for i := range entries {
		entries[i].Rank = i + 1
	}

	c.JSON(http.StatusOK, gin.H{"leaderboard": entries})
}
