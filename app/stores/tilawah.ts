import { defineStore } from 'pinia'
import { useUserStore } from './user'

interface ReadingPosition {
    id: number
    juz_number: number
    ayah: number
    surah: string
    updated_at: string
}

interface Goal {
    type: string  // 'free' | 'khatam_30' | 'khatam_60' | 'ayat' | 'custom'
    target: number
}

export interface QuranPreferences {
    /** Arabic script edition */
    script: 'quran-uthmani' | 'quran-simple' | 'quran-tajweed'
    /** Translation edition (empty = disabled) */
    translation: '' | 'id.indonesian' | 'id.muntakhab' | 'id.jalalayn'
    /** Font size in pixels */
    fontSize: number
}

interface TilawahState {
    /** Array of 30 booleans — true = juz completed */
    completedJuz: boolean[]
    /** Date strings of completion, indexed by juz number (0-29) */
    completionDates: (string | null)[]
    /** Consecutive days streak */
    lastCompletedDate: string | null
    /** Last read position (global) */
    lastRead: {
        juz: number
        ayah: number
        surah: string
    } | null
    /** Per-juz reading positions */
    readingPositions: ReadingPosition[]
    /** User's reading goal */
    goal: Goal
    /** Quran display preferences */
    quranPreferences: QuranPreferences
}

export const useTilawahStore = defineStore('tilawah', {
    state: (): TilawahState => ({
        completedJuz: Array(30).fill(false),
        completionDates: Array(30).fill(null),
        lastCompletedDate: null,
        lastRead: null,
        readingPositions: [],
        goal: { type: 'free', target: 0 },
        quranPreferences: {
            script: 'quran-uthmani',
            translation: '',
            fontSize: 28,
        },
    }),

    getters: {
        totalJuzDone(state): number {
            return state.completedJuz.filter(Boolean).length
        },

        completionPercentage(): number {
            return Math.round((this.totalJuzDone / 30) * 100)
        },

        currentJuzNumber(state): number {
            const nextIncomplete = state.completedJuz.findIndex(j => !j)
            return nextIncomplete === -1 ? 30 : nextIncomplete + 1
        },

        currentStreak(state): number {
            const completedDays = new Set<string>()
            state.completionDates.forEach(d => {
                if (d) {
                    const date = new Date(d)
                    date.setHours(0, 0, 0, 0)
                    completedDays.add(date.toDateString())
                }
            })

            if (completedDays.size === 0) return 0

            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const todayStr = today.toDateString()
            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)
            const yesterdayStr = yesterday.toDateString()

            if (!completedDays.has(todayStr) && !completedDays.has(yesterdayStr)) return 0

            let streak = 0
            const checkDate = new Date(today)
            for (let i = 0; i < 60; i++) {
                if (completedDays.has(checkDate.toDateString())) {
                    streak++
                    checkDate.setDate(checkDate.getDate() - 1)
                } else {
                    break
                }
            }

            return streak
        },

        dayOfRamadan(): number {
            return Math.max(1, this.currentJuzNumber)
        },

        isJuzCompletedToday(state): boolean {
            const today = new Date().toDateString()
            return state.completionDates.some(d => d && new Date(d).toDateString() === today)
        },

        // Get the most recent reading position (any juz)
        latestPosition(state): ReadingPosition | null {
            if (state.readingPositions.length === 0) return null
            return state.readingPositions[0] // Already sorted by updated_at DESC from backend
        },

        // Get reading position for a specific juz
        getPositionForJuz(state) {
            return (juzNumber: number): ReadingPosition | null => {
                return state.readingPositions.find(p => p.juz_number === juzNumber) || null
            }
        },

        getJuzStatus(state) {
            return (juzIndex: number): 'done' | 'today' | 'upcoming' => {
                if (state.completedJuz[juzIndex]) return 'done'
                if (juzIndex === state.completedJuz.findIndex(j => !j)) return 'today'
                return 'upcoming'
            }
        },

        // Goal description for display
        goalDescription(state): string {
            switch (state.goal.type) {
                case 'khatam_30': return '1 Juz / Hari'
                case 'khatam_60': return '½ Juz / Hari'
                case 'ayat': return `${state.goal.target} Ayat / Hari`
                case 'custom': return `${state.goal.target} Juz / Hari`
                default: return 'Bebas'
            }
        },
    },

    actions: {
        async fetchProgress() {
            try {
                const userStore = useUserStore()
                if (!userStore.token) return

                const data: any = await $fetch('/api/tilawah', {
                    headers: {
                        Authorization: `Bearer ${userStore.token}`
                    }
                })

                if (data.data) {
                    this.completedJuz = Array(30).fill(false)
                    this.completionDates = Array(30).fill(null)

                    data.data.forEach((p: any) => {
                        const index = p.juz_number - 1
                        if (index >= 0 && index < 30) {
                            this.completedJuz[index] = p.is_read
                            if (p.is_read) {
                                this.completionDates[index] = p.updated_at
                            }
                        }
                    })
                }

                // Update Last Read
                if (data.last_read && data.last_read.juz > 0) {
                    this.lastRead = {
                        juz: data.last_read.juz,
                        ayah: data.last_read.ayah,
                        surah: data.last_read.surah
                    }
                }

                // Update reading positions
                if (data.positions) {
                    this.readingPositions = data.positions
                }

                // Update goal
                if (data.goal) {
                    this.goal = data.goal
                }
            } catch (e) {
                console.error("Failed to fetch progress", e)
            }
        },

        async toggleJuz(juzNumber: number) {
            const index = juzNumber - 1
            if (index < 0 || index >= 30) return

            const newStatus = !this.completedJuz[index]

            // Optimistic update
            this.completedJuz[index] = newStatus
            if (newStatus) {
                this.completionDates[index] = new Date().toISOString()
                this.lastCompletedDate = new Date().toISOString()
            } else {
                this.completionDates[index] = null
            }

            try {
                const userStore = useUserStore()
                if (userStore.token) {
                    await $fetch('/api/tilawah', {
                        method: 'POST',
                        body: {
                            juz_number: juzNumber,
                            is_read: newStatus
                        },
                        headers: {
                            Authorization: `Bearer ${userStore.token}`
                        }
                    })

                    // Refresh circle assignments (backend auto-completes them)
                    if (newStatus) {
                        try {
                            const { useCircleStore } = await import('./circle')
                            const circleStore = useCircleStore()
                            if (circleStore.myCircles.length > 0) {
                                await circleStore.fetchMyAssignments(circleStore.myCircles[0].id)
                            }
                        } catch { /* circle store not available */ }
                    }
                }
            } catch (e) {
                console.error("Failed to sync progress", e)
                this.completedJuz[index] = !newStatus
            }
        },

        markJuzComplete(juzNumber: number) {
            this.toggleJuz(juzNumber)
        },

        async updateLastRead(juz: number, ayah: number, surah: string) {
            // Local update
            this.lastRead = { juz, ayah, surah }

            // Also update local positions cache
            const existingIdx = this.readingPositions.findIndex(p => p.juz_number === juz)
            const newPos: ReadingPosition = {
                id: 0,
                juz_number: juz,
                ayah,
                surah,
                updated_at: new Date().toISOString()
            }
            if (existingIdx >= 0) {
                this.readingPositions[existingIdx] = { ...this.readingPositions[existingIdx], ayah, surah, updated_at: newPos.updated_at }
            } else {
                this.readingPositions.unshift(newPos)
            }
            // Re-sort: most recent first
            this.readingPositions.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())

            // Sync with backend
            try {
                const userStore = useUserStore()
                if (userStore.token) {
                    await $fetch('/api/tilawah/position', {
                        method: 'PUT',
                        body: {
                            juz_number: juz,
                            ayah_number: ayah,
                            surah_name: surah
                        },
                        headers: {
                            Authorization: `Bearer ${userStore.token}`
                        }
                    })
                }
            } catch (e) {
                console.error("Failed to sync last read", e)
            }
        },

        async setGoal(goalType: string, goalTarget: number = 0) {
            try {
                const userStore = useUserStore()
                if (!userStore.token) return

                await $fetch('/api/tilawah/goal', {
                    method: 'PUT',
                    body: {
                        goal_type: goalType,
                        goal_target: goalTarget,
                    },
                    headers: {
                        Authorization: `Bearer ${userStore.token}`
                    }
                })

                this.goal = { type: goalType, target: goalTarget }
            } catch (e) {
                console.error("Failed to set goal", e)
            }
        },

        resetProgress() {
            this.completedJuz = Array(30).fill(false)
            this.completionDates = Array(30).fill(null)
            this.lastCompletedDate = null
            this.lastRead = null
            this.readingPositions = []
            this.goal = { type: 'free', target: 0 }
        },
    },

    persist: true,
})
