import { defineStore } from 'pinia'
import { useUserStore } from './user'

interface TilawahState {
    /** Array of 30 booleans — true = juz completed */
    completedJuz: boolean[]
    /** Date strings of completion, indexed by juz number (0-29) */
    completionDates: (string | null)[]
    /** Consecutive days streak */
    lastCompletedDate: string | null
    /** Last read position */
    lastRead: {
        juz: number
        ayah: number
        surah: string
    } | null
}

export const useTilawahStore = defineStore('tilawah', {
    state: (): TilawahState => ({
        completedJuz: Array(30).fill(false),
        completionDates: Array(30).fill(null),
        lastCompletedDate: null,
        lastRead: null,
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
            if (!state.lastCompletedDate) return 0

            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const lastDate = new Date(state.lastCompletedDate)
            lastDate.setHours(0, 0, 0, 0)

            const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

            // If last completion was more than 1 day ago, streak is broken
            if (diffDays > 1) return 0

            // Count consecutive completed juz from the end
            let streak = 0
            for (let i = state.completedJuz.length - 1; i >= 0; i--) {
                if (state.completedJuz[i] && state.completionDates[i]) {
                    streak++
                } else {
                    break
                }
            }

            // Simpler approach: count from the first completed sequentially
            streak = 0
            for (let i = 0; i < state.completedJuz.length; i++) {
                if (state.completedJuz[i]) {
                    streak++
                } else {
                    break
                }
            }

            return streak
        },

        dayOfRamadan(): number {
            // For demo purposes, use the tilawah progress as the day
            return Math.max(1, this.currentJuzNumber)
        },

        isJuzCompletedToday(state): boolean {
            const today = new Date().toDateString()
            return state.completionDates.some(d => d && new Date(d).toDateString() === today)
        },

        getJuzStatus(state) {
            return (juzIndex: number): 'done' | 'today' | 'upcoming' => {
                if (state.completedJuz[juzIndex]) return 'done'
                if (juzIndex === state.completedJuz.findIndex(j => !j)) return 'today'
                return 'upcoming'
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
                    // Reset local state
                    this.completedJuz = Array(30).fill(false)
                    this.completionDates = Array(30).fill(null)

                    // Update from backend
                    data.data.forEach((p: any) => {
                        const index = p.juz_number - 1
                        if (index >= 0 && index < 30) {
                            this.completedJuz[index] = p.is_read
                            if (p.is_read) {
                                // Use updated_at as completion date
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

            // Sync with backend
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
                }
            } catch (e) {
                console.error("Failed to sync progress", e)
                // Revert if failed?
                this.completedJuz[index] = !newStatus
            }
        },

        markJuzComplete(juzNumber: number) {
            this.toggleJuz(juzNumber)
        },

        async updateLastRead(juz: number, ayah: number, surah: string) {
            // Local update
            this.lastRead = { juz, ayah, surah }

            // Sync with backend
            // We'll sync immediately for simplicity, component handles debounce logic if needed
            // But actually debounce is better handled here if we call it frequently? 
            // Better to just call this action debounced from component.
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

        resetProgress() {
            this.completedJuz = Array(30).fill(false)
            this.completionDates = Array(30).fill(null)
            this.lastCompletedDate = null
            this.lastRead = null
        },
    },

    persist: true,
})
