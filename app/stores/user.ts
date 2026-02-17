import { defineStore } from 'pinia'
import { useTilawahStore } from './tilawah'

interface UserState {
    name: string
    email: string
    referralCode: string
    isOnboarded: boolean
    joinedDate: string
    isLoggedIn: boolean
    isLoading: boolean
    error: string | null
    token: string | null
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        name: '',
        email: '',
        referralCode: generateReferralCode(),
        isOnboarded: false,
        joinedDate: new Date().toISOString(),
        isLoggedIn: false,
        isLoading: false,
        error: null,
        token: null,
    }),

    actions: {
        completeOnboarding() {
            this.isOnboarded = true
        },
        setUser(name: string, email: string) {
            this.name = name
            this.email = email
        },
        // Auth Actions
        async login(email: string, password: string) {
            this.isLoading = true
            this.error = null
            try {
                const response = await $fetch<{ token: string, user: { name: string, email: string } }>('/api/auth/login', {
                    method: 'POST',
                    body: { email, password }
                })

                this.token = response.token
                this.name = response.user.name
                this.email = response.user.email
                this.isLoggedIn = true
                this.isOnboarded = true

                const tilawahStore = useTilawahStore()
                await tilawahStore.fetchProgress()
            } catch (e: any) {
                console.error(e)
                this.error = e.data?.error || 'Login failed'
                throw e
            } finally {
                this.isLoading = false
            }
        },
        async register(name: string, email: string, password: string) {
            this.isLoading = true
            this.error = null
            try {
                const response = await $fetch<{ token: string, user: { name: string, email: string } }>('/api/auth/register', {
                    method: 'POST',
                    body: { name, email, password }
                })

                this.token = response.token
                this.name = response.user.name
                this.email = response.user.email
                this.isLoggedIn = true
                this.isOnboarded = true

                const tilawahStore = useTilawahStore()
                await tilawahStore.fetchProgress()
            } catch (e: any) {
                console.error(e)
                this.error = e.data?.error || 'Registration failed'
                throw e
            } finally {
                this.isLoading = false
            }
        },
        async loginWithGoogle() {
            // Mock Google login for now
            this.name = 'Google User'
            this.email = 'user@gmail.com'
            this.isLoggedIn = true
            this.isOnboarded = true
        },
        logout() {
            this.isLoggedIn = false
            this.name = ''
            this.email = ''
            this.token = null

            const tilawahStore = useTilawahStore()
            tilawahStore.resetProgress()
        }
    },

    persist: true,
})

function generateReferralCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
}
