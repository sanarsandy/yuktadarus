import { defineStore } from 'pinia'
import { useUserStore } from './user'

export interface CircleMember {
    id: number
    user_id: number
    circle_id: number
    role: string
    user: {
        id: number
        name: string
        email: string
    }
    total_juz_done?: number
    xp?: number
    level?: number
    level_title?: string
}

export interface JuzAssignment {
    id: number
    circle_id: number
    user_id: number
    juz_number: number
    status: 'pending' | 'in_progress' | 'completed'
    day_number: number
    deadline?: string
    completed_at?: string
    user: {
        id: number
        name: string
    }
}

export interface Circle {
    id: number
    name: string
    description: string
    invite_code: string
    admin_id: number
    scheme: 'khatam_bersama' | 'tartil_harian' | 'khatam_race'
    members: CircleMember[]
    assignments?: JuzAssignment[]
    created_at: string
}

export interface CircleStats {
    id: number
    circle_id: number
    total_xp: number
    circle_streak: number
    khatam_count: number
    last_active_date: string | null
}

export interface LeaderboardEntry {
    rank: number
    user_id: number
    name: string
    total_juz_done: number
    role: string
    xp: number
    level: number
    level_title: string
}

export interface MemberXPEntry {
    user_id: number
    name: string
    xp: number
    level: number
    level_title: string
}

interface CircleState {
    myCircles: Circle[]
    activeCircle: Circle | null
    activeMembers: CircleMember[]
    leaderboard: LeaderboardEntry[]
    assignments: JuzAssignment[]
    myAssignments: JuzAssignment[]
    stats: CircleStats | null
    memberXPs: MemberXPEntry[]
    completionPct: number
    isLoading: boolean
    error: string | null
}

// XP thresholds for XP bar rendering
export const LEVEL_THRESHOLDS = [0, 0, 30, 80, 150, 250, 400, 600, 850, 1200, 1600]

export const SCHEME_LABELS: Record<string, string> = {
    khatam_bersama: 'Khatam Bersama',
    tartil_harian: 'Tartil Harian',
    khatam_race: 'Khatam Race',
}

export const SCHEME_DESCRIPTIONS: Record<string, string> = {
    khatam_bersama: '30 juz dibagi rata ke anggota',
    tartil_harian: 'Jadwal harian bergilir',
    khatam_race: 'Lomba khatam 30 juz',
}

export const useCircleStore = defineStore('circle', {
    state: (): CircleState => ({
        myCircles: [],
        activeCircle: null,
        activeMembers: [],
        leaderboard: [],
        assignments: [],
        myAssignments: [],
        stats: null,
        memberXPs: [],
        completionPct: 0,
        isLoading: false,
        error: null,
    }),

    getters: {
        circleCount: (state) => state.myCircles.length,
        isAdmin: (state) => {
            const userStore = useUserStore()
            if (!state.activeCircle) return false
            return state.activeMembers.some(
                m => m.role === 'admin' && m.user?.email === userStore.email
            )
        },
        pendingAssignments: (state) => state.myAssignments.filter(a => a.status === 'pending'),
        inProgressAssignments: (state) => state.myAssignments.filter(a => a.status === 'in_progress'),
        completedAssignments: (state) => state.myAssignments.filter(a => a.status === 'completed'),
    },

    actions: {
        getAuthHeaders() {
            const userStore = useUserStore()
            return {
                Authorization: `Bearer ${userStore.token}`,
            }
        },

        async fetchMyCircles() {
            this.isLoading = true
            this.error = null
            try {
                const data = await $fetch<{ circles: Circle[] }>('/api/circles/my', {
                    headers: this.getAuthHeaders(),
                })
                this.myCircles = data.circles || []
            } catch (e: any) {
                this.error = e.data?.error || 'Failed to fetch circles'
            } finally {
                this.isLoading = false
            }
        },

        async createCircle(name: string, description: string = '', scheme: string = 'khatam_bersama') {
            this.isLoading = true
            this.error = null
            try {
                const data = await $fetch<{ circle: Circle }>('/api/circles', {
                    method: 'POST',
                    headers: this.getAuthHeaders(),
                    body: { name, description, scheme },
                })
                this.myCircles.push(data.circle)
                return data.circle
            } catch (e: any) {
                this.error = e.data?.error || 'Failed to create circle'
                throw e
            } finally {
                this.isLoading = false
            }
        },

        async joinCircle(inviteCode: string) {
            this.isLoading = true
            this.error = null
            try {
                const data = await $fetch<{ circle: Circle }>('/api/circles/join', {
                    method: 'POST',
                    headers: this.getAuthHeaders(),
                    body: { invite_code: inviteCode.toUpperCase() },
                })
                this.myCircles.push(data.circle)
                return data.circle
            } catch (e: any) {
                this.error = e.data?.error || 'Failed to join circle'
                throw e
            } finally {
                this.isLoading = false
            }
        },

        async fetchCircleDetail(id: number) {
            this.isLoading = true
            this.error = null
            try {
                const data = await $fetch<{
                    circle: Circle
                    members: CircleMember[]
                    stats: CircleStats
                    completion_pct: number
                }>(`/api/circles/${id}`, { headers: this.getAuthHeaders() })
                this.activeCircle = data.circle
                this.activeMembers = data.members || []
                this.assignments = data.circle.assignments || []
                this.stats = data.stats
                this.completionPct = data.completion_pct || 0
            } catch (e: any) {
                this.error = e.data?.error || 'Failed to fetch circle detail'
            } finally {
                this.isLoading = false
            }
        },

        async fetchLeaderboard(id: number) {
            try {
                const data = await $fetch<{ leaderboard: LeaderboardEntry[] }>(
                    `/api/circles/${id}/leaderboard`,
                    { headers: this.getAuthHeaders() }
                )
                this.leaderboard = data.leaderboard || []
            } catch (e: any) {
                console.error('Failed to fetch leaderboard', e)
            }
        },

        async fetchMyAssignments(circleId: number) {
            try {
                const data = await $fetch<{ assignments: JuzAssignment[] }>(
                    `/api/circles/${circleId}/my-assignments`,
                    { headers: this.getAuthHeaders() }
                )
                this.myAssignments = data.assignments || []
            } catch (e: any) {
                console.error('Failed to fetch my assignments', e)
            }
        },

        async fetchStats(circleId: number) {
            try {
                const data = await $fetch<{ stats: CircleStats; member_xps: MemberXPEntry[] }>(
                    `/api/circles/${circleId}/stats`,
                    { headers: this.getAuthHeaders() }
                )
                this.stats = data.stats
                this.memberXPs = data.member_xps || []
            } catch (e: any) {
                console.error('Failed to fetch stats', e)
            }
        },

        async setScheme(circleId: number, scheme: string) {
            try {
                const data = await $fetch<{ circle: Circle }>(
                    `/api/circles/${circleId}/scheme`,
                    {
                        method: 'PUT',
                        headers: this.getAuthHeaders(),
                        body: { scheme },
                    }
                )
                if (this.activeCircle) {
                    this.activeCircle.scheme = data.circle.scheme as any
                }
            } catch (e: any) {
                this.error = e.data?.error || 'Failed to update scheme'
                throw e
            }
        },

        async autoAssign(circleId: number) {
            this.isLoading = true
            try {
                const data = await $fetch<{ assignments: JuzAssignment[] }>(
                    `/api/circles/${circleId}/auto-assign`,
                    {
                        method: 'POST',
                        headers: this.getAuthHeaders(),
                    }
                )
                this.assignments = data.assignments || []
            } catch (e: any) {
                this.error = e.data?.error || 'Failed to auto-assign'
                throw e
            } finally {
                this.isLoading = false
            }
        },

        async updateAssignmentStatus(circleId: number, assignId: number, status: string) {
            try {
                await $fetch(`/api/circles/${circleId}/assign/${assignId}/status`, {
                    method: 'PUT',
                    headers: this.getAuthHeaders(),
                    body: { status },
                })
                // Refresh data
                await this.fetchCircleDetail(circleId)
                await this.fetchMyAssignments(circleId)
                await this.fetchLeaderboard(circleId)
            } catch (e: any) {
                this.error = e.data?.error || 'Failed to update status'
                throw e
            }
        },

        async leaveCircle(id: number) {
            this.isLoading = true
            try {
                await $fetch(`/api/circles/${id}/leave`, {
                    method: 'DELETE',
                    headers: this.getAuthHeaders(),
                })
                this.myCircles = this.myCircles.filter(c => c.id !== id)
                this.activeCircle = null
            } catch (e: any) {
                this.error = e.data?.error || 'Failed to leave circle'
                throw e
            } finally {
                this.isLoading = false
            }
        },

        async assignJuz(circleId: number, userId: number, juzNumber: number) {
            try {
                const data = await $fetch<{ assignments: JuzAssignment[] }>(
                    `/api/circles/${circleId}/assign`,
                    {
                        method: 'POST',
                        headers: this.getAuthHeaders(),
                        body: { user_id: userId, juz_number: juzNumber },
                    }
                )
                this.assignments = data.assignments || []
            } catch (e: any) {
                this.error = e.data?.error || 'Failed to assign juz'
                throw e
            }
        },
    },
})
