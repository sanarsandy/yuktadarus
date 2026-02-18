import { defineStore } from 'pinia'
import { useTilawahStore } from './tilawah'
import { useCircleStore } from './circle'

export interface Badge {
    id: string
    name: string
    description: string
    icon: string // SVG icon identifier
    requirement: () => boolean
}

export const useBadgesStore = defineStore('badges', {
    getters: {
        badges(): Badge[] {
            const tilawah = useTilawahStore()
            const circleStore = useCircleStore()

            return [
                // Individual reading badges
                {
                    id: 'first-juz',
                    name: 'Juz Pertama',
                    description: 'Selesaikan juz pertama',
                    icon: 'star',
                    requirement: () => tilawah.totalJuzDone >= 1,
                },
                {
                    id: 'one-week-strong',
                    name: 'Semangat Sepekan',
                    description: '7 hari berturut-turut',
                    icon: 'flame',
                    requirement: () => tilawah.currentStreak >= 7,
                },
                {
                    id: 'halfway-there',
                    name: 'Setengah Perjalanan',
                    description: '15 juz selesai',
                    icon: 'target',
                    requirement: () => tilawah.totalJuzDone >= 15,
                },
                {
                    id: 'final-push',
                    name: 'Sedikit Lagi',
                    description: '25 juz selesai',
                    icon: 'zap',
                    requirement: () => tilawah.totalJuzDone >= 25,
                },
                {
                    id: 'khatam-complete',
                    name: 'Khatam!',
                    description: 'Semua 30 juz selesai',
                    icon: 'trophy',
                    requirement: () => tilawah.totalJuzDone >= 30,
                },
                // Circle gamification badges
                {
                    id: 'circle-joiner',
                    name: 'Anggota Circle',
                    description: 'Gabung circle pertama',
                    icon: 'users',
                    requirement: () => circleStore.myCircles.length >= 1,
                },
                {
                    id: 'circle-assignment',
                    name: 'Tugas Pertama',
                    description: 'Selesaikan 1 tugas circle',
                    icon: 'check-circle',
                    requirement: () => circleStore.completedAssignments.length >= 1,
                },
                {
                    id: 'circle-xp-50',
                    name: 'Pengumpul XP',
                    description: 'Raih 50 XP di circle',
                    icon: 'trending-up',
                    requirement: () => (circleStore.stats?.total_xp || 0) >= 50,
                },
                {
                    id: 'circle-streak-3',
                    name: 'Circle Streak',
                    description: 'Circle aktif 3 hari berturut',
                    icon: 'flame',
                    requirement: () => (circleStore.stats?.circle_streak || 0) >= 3,
                },
                {
                    id: 'circle-khatam',
                    name: 'Khatam Bersama',
                    description: 'Circle selesai khatam',
                    icon: 'trophy',
                    requirement: () => (circleStore.stats?.khatam_count || 0) >= 1,
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
