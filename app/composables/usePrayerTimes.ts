/**
 * usePrayerTimes composable
 * Fetches Hijri date + prayer times from Aladhan API (free, no key needed)
 * Uses Jakarta coordinates by default
 */
export function usePrayerTimes() {
    const hijriDate = ref('')
    const hijriMonth = ref('')
    const hijriYear = ref('')
    const hijriDay = ref('')
    const gregorianFormatted = ref('')
    const prayerTimes = ref<Record<string, string>>({})
    const loading = ref(true)
    const error = ref(false)

    // Jakarta coordinates
    const latitude = -6.2088
    const longitude = 106.8456
    const method = 20 // MUI (Kemenag RI) method

    async function fetchData() {
        loading.value = true
        error.value = false
        try {
            const today = new Date()
            const dd = String(today.getDate()).padStart(2, '0')
            const mm = String(today.getMonth() + 1).padStart(2, '0')
            const yyyy = today.getFullYear()
            const dateStr = `${dd}-${mm}-${yyyy}`

            const res: any = await $fetch(
                `https://api.aladhan.com/v1/timings/${dateStr}`, {
                params: {
                    latitude,
                    longitude,
                    method,
                    adjustment: -1, // Sesuaikan tanggal Hijriyah dengan keputusan Kemenag RI
                }
            }
            )

            if (res?.data) {
                // Hijri date
                const hijri = res.data.date.hijri
                hijriDay.value = hijri.day
                hijriMonth.value = hijri.month.en
                hijriYear.value = hijri.year
                hijriDate.value = `${hijri.day} ${hijri.month.en} ${hijri.year} H`

                // Gregorian formatted
                const greg = res.data.date.gregorian
                gregorianFormatted.value = `${greg.weekday.en}, ${greg.day} ${greg.month.en} ${greg.year}`

                // Prayer times
                prayerTimes.value = res.data.timings
            }
        } catch (e) {
            console.error('Failed to fetch prayer times', e)
            error.value = true
        } finally {
            loading.value = false
        }
    }

    // Computed helpers
    const imsak = computed(() => prayerTimes.value?.Imsak || '--:--')
    const subuh = computed(() => prayerTimes.value?.Fajr || '--:--')
    const maghrib = computed(() => prayerTimes.value?.Maghrib || '--:--')
    const isya = computed(() => prayerTimes.value?.Isha || '--:--')

    // Sahur = before Imsak, Berbuka = Maghrib
    const sahur = computed(() => imsak.value)
    const berbuka = computed(() => maghrib.value)

    onMounted(() => {
        fetchData()
    })

    return {
        hijriDate,
        hijriDay,
        hijriMonth,
        hijriYear,
        gregorianFormatted,
        prayerTimes,
        loading,
        error,
        imsak,
        subuh,
        maghrib,
        isya,
        sahur,
        berbuka,
        fetchData,
    }
}
