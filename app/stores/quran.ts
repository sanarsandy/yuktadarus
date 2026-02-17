import { defineStore } from 'pinia'

interface Ayah {
    number: number
    text: string
    numberInSurah: number
    juz: number
    manzil: number
    page: number
    ruku: number
    hizbQuarter: number
    sajda: boolean
    surah: {
        number: number
        name: string
        englishName: string
        englishNameTranslation: string
        revelationType: string
        numberOfAyahs: number
    }
}

interface QuranState {
    currentJuz: number
    juzData: Ayah[]
    isLoading: boolean
    error: string | null
}

export const useQuranStore = defineStore('quran', {
    state: (): QuranState => ({
        currentJuz: 1,
        juzData: [],
        isLoading: false,
        error: null,
    }),

    actions: {
        async fetchJuz(juzNumber: number) {
            if (juzNumber < 1 || juzNumber > 30) {
                this.error = 'Invalid Juz number'
                return
            }

            this.isLoading = true
            this.error = null
            this.currentJuz = juzNumber
            this.juzData = []

            try {
                const response = await fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/quran-uthmani`)
                const data = await response.json()

                if (data.code === 200 && data.data && data.data.ayahs) {
                    this.juzData = data.data.ayahs
                } else {
                    this.error = 'Failed to fetch Quran data'
                }
            } catch (err: any) {
                this.error = err.message || 'An error occurred while fetching data'
            } finally {
                this.isLoading = false
            }
        },

        setJuz(juz: number) {
            this.currentJuz = juz
        }
    },

    // No persistence for Quran text to save space/bandwidth, strictly on-demand
})
