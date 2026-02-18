import { defineStore } from 'pinia'
import { useTilawahStore } from './tilawah'

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
    translationData: Ayah[]
    isLoading: boolean
    error: string | null
}

export const useQuranStore = defineStore('quran', {
    state: (): QuranState => ({
        currentJuz: 1,
        juzData: [],
        translationData: [],
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
            this.translationData = []

            try {
                const tilawahStore = useTilawahStore()
                const prefs = tilawahStore.quranPreferences || {
                    script: 'quran-uthmani',
                    translation: '',
                    fontSize: 28,
                }

                const scriptEdition = prefs.script || 'quran-uthmani'
                const translationEdition = prefs.translation || ''

                console.log('[QuranStore] Fetching juz', juzNumber, 'script:', scriptEdition, 'translation:', translationEdition)

                // Fetch Arabic script
                const scriptRes = await fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/${scriptEdition}`)
                const scriptData = await scriptRes.json()

                if (scriptData.code === 200 && scriptData.data?.ayahs) {
                    this.juzData = scriptData.data.ayahs
                } else {
                    this.error = 'Failed to fetch Quran data'
                    return
                }

                // Fetch Translation (separate request, juz endpoint doesn't support multi-edition)
                if (translationEdition) {
                    try {
                        const transRes = await fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/${translationEdition}`)
                        const transData = await transRes.json()

                        if (transData.code === 200 && transData.data?.ayahs) {
                            this.translationData = transData.data.ayahs
                            console.log('[QuranStore] Translation loaded:', this.translationData.length, 'ayahs')
                        }
                    } catch (e) {
                        console.warn('[QuranStore] Translation fetch failed, continuing without', e)
                    }
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
})
