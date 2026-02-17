import { defineStore } from 'pinia'
import { useTilawahStore } from './tilawah'

export interface Badge {
    id: string
    name: string
    description: string
    icon: string
    requirement: () => boolean
}

export const useBadgesStore = defineStore('badges', {
    getters: {
        badges(): Badge[] {
            const tilawah = useTilawahStore()
            return [
                {
                    id: 'first-juz',
                    name: 'First Juz',
                    description: 'Complete your first juz',
                    icon: '⭐',
                    requirement: () => tilawah.totalJuzDone >= 1,
                },
                {
                    id: 'one-week-strong',
                    name: 'One Week Strong',
                    description: '7 days in a row',
                    icon: '🔥',
                    requirement: () => tilawah.currentStreak >= 7,
                },
                {
                    id: 'halfway-there',
                    name: 'Halfway There',
                    description: '15 juz completed',
                    icon: '🌟',
                    requirement: () => tilawah.totalJuzDone >= 15,
                },
                {
                    id: 'final-push',
                    name: 'Final Push',
                    description: '25 juz completed',
                    icon: '💪',
                    requirement: () => tilawah.totalJuzDone >= 25,
                },
                {
                    id: 'khatam-complete',
                    name: 'Khatam Complete',
                    description: 'All 30 juz done',
                    icon: '🏆',
                    requirement: () => tilawah.totalJuzDone >= 30,
                },
            ]
        },

        earnedBadges(): Badge[] {
            return this.badges.filter(b => b.requirement())
        },

        earnedCount(): number {
            return this.earnedBadges.length
        },
    },
})
