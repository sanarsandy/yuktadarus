/**
 * Quran data: all 114 surahs with juz mapping
 */
export interface Surah {
    number: number
    name: string       // Arabic transliteration
    nameAr: string     // Arabic script
    meaning: string    // Indonesian meaning
    ayahs: number      // Total ayahs
    type: 'Makkiyah' | 'Madaniyah'
    juz: number[]      // Which juz(es) this surah spans
}

const surahs: Surah[] = [
    { number: 1, name: "Al-Fatihah", nameAr: "الفاتحة", meaning: "Pembukaan", ayahs: 7, type: "Makkiyah", juz: [1] },
    { number: 2, name: "Al-Baqarah", nameAr: "البقرة", meaning: "Sapi Betina", ayahs: 286, type: "Madaniyah", juz: [1, 2, 3] },
    { number: 3, name: "Ali 'Imran", nameAr: "آل عمران", meaning: "Keluarga Imran", ayahs: 200, type: "Madaniyah", juz: [3, 4] },
    { number: 4, name: "An-Nisa'", nameAr: "النساء", meaning: "Wanita", ayahs: 176, type: "Madaniyah", juz: [4, 5, 6] },
    { number: 5, name: "Al-Ma'idah", nameAr: "المائدة", meaning: "Hidangan", ayahs: 120, type: "Madaniyah", juz: [6, 7] },
    { number: 6, name: "Al-An'am", nameAr: "الأنعام", meaning: "Binatang Ternak", ayahs: 165, type: "Makkiyah", juz: [7, 8] },
    { number: 7, name: "Al-A'raf", nameAr: "الأعراف", meaning: "Tempat Tertinggi", ayahs: 206, type: "Makkiyah", juz: [8, 9] },
    { number: 8, name: "Al-Anfal", nameAr: "الأنفال", meaning: "Rampasan Perang", ayahs: 75, type: "Madaniyah", juz: [9, 10] },
    { number: 9, name: "At-Taubah", nameAr: "التوبة", meaning: "Pengampunan", ayahs: 129, type: "Madaniyah", juz: [10, 11] },
    { number: 10, name: "Yunus", nameAr: "يونس", meaning: "Yunus", ayahs: 109, type: "Makkiyah", juz: [11] },
    { number: 11, name: "Hud", nameAr: "هود", meaning: "Hud", ayahs: 123, type: "Makkiyah", juz: [11, 12] },
    { number: 12, name: "Yusuf", nameAr: "يوسف", meaning: "Yusuf", ayahs: 111, type: "Makkiyah", juz: [12, 13] },
    { number: 13, name: "Ar-Ra'd", nameAr: "الرعد", meaning: "Guruh", ayahs: 43, type: "Madaniyah", juz: [13] },
    { number: 14, name: "Ibrahim", nameAr: "إبراهيم", meaning: "Ibrahim", ayahs: 52, type: "Makkiyah", juz: [13] },
    { number: 15, name: "Al-Hijr", nameAr: "الحجر", meaning: "Batu Karang", ayahs: 99, type: "Makkiyah", juz: [14] },
    { number: 16, name: "An-Nahl", nameAr: "النحل", meaning: "Lebah", ayahs: 128, type: "Makkiyah", juz: [14] },
    { number: 17, name: "Al-Isra'", nameAr: "الإسراء", meaning: "Perjalanan Malam", ayahs: 111, type: "Makkiyah", juz: [15] },
    { number: 18, name: "Al-Kahfi", nameAr: "الكهف", meaning: "Gua", ayahs: 110, type: "Makkiyah", juz: [15, 16] },
    { number: 19, name: "Maryam", nameAr: "مريم", meaning: "Maryam", ayahs: 98, type: "Makkiyah", juz: [16] },
    { number: 20, name: "Taha", nameAr: "طه", meaning: "Taha", ayahs: 135, type: "Makkiyah", juz: [16] },
    { number: 21, name: "Al-Anbiya'", nameAr: "الأنبياء", meaning: "Para Nabi", ayahs: 112, type: "Makkiyah", juz: [17] },
    { number: 22, name: "Al-Hajj", nameAr: "الحج", meaning: "Haji", ayahs: 78, type: "Madaniyah", juz: [17] },
    { number: 23, name: "Al-Mu'minun", nameAr: "المؤمنون", meaning: "Orang Beriman", ayahs: 118, type: "Makkiyah", juz: [18] },
    { number: 24, name: "An-Nur", nameAr: "النور", meaning: "Cahaya", ayahs: 64, type: "Madaniyah", juz: [18] },
    { number: 25, name: "Al-Furqan", nameAr: "الفرقان", meaning: "Pembeda", ayahs: 77, type: "Makkiyah", juz: [18, 19] },
    { number: 26, name: "Asy-Syu'ara'", nameAr: "الشعراء", meaning: "Para Penyair", ayahs: 227, type: "Makkiyah", juz: [19] },
    { number: 27, name: "An-Naml", nameAr: "النمل", meaning: "Semut", ayahs: 93, type: "Makkiyah", juz: [19, 20] },
    { number: 28, name: "Al-Qasas", nameAr: "القصص", meaning: "Kisah-Kisah", ayahs: 88, type: "Makkiyah", juz: [20] },
    { number: 29, name: "Al-'Ankabut", nameAr: "العنكبوت", meaning: "Laba-Laba", ayahs: 69, type: "Makkiyah", juz: [20, 21] },
    { number: 30, name: "Ar-Rum", nameAr: "الروم", meaning: "Bangsa Romawi", ayahs: 60, type: "Makkiyah", juz: [21] },
    { number: 31, name: "Luqman", nameAr: "لقمان", meaning: "Luqman", ayahs: 34, type: "Makkiyah", juz: [21] },
    { number: 32, name: "As-Sajdah", nameAr: "السجدة", meaning: "Sujud", ayahs: 30, type: "Makkiyah", juz: [21] },
    { number: 33, name: "Al-Ahzab", nameAr: "الأحزاب", meaning: "Golongan", ayahs: 73, type: "Madaniyah", juz: [21, 22] },
    { number: 34, name: "Saba'", nameAr: "سبأ", meaning: "Saba'", ayahs: 54, type: "Makkiyah", juz: [22] },
    { number: 35, name: "Fatir", nameAr: "فاطر", meaning: "Pencipta", ayahs: 45, type: "Makkiyah", juz: [22] },
    { number: 36, name: "Yasin", nameAr: "يس", meaning: "Yasin", ayahs: 83, type: "Makkiyah", juz: [22, 23] },
    { number: 37, name: "As-Saffat", nameAr: "الصافات", meaning: "Yang Bersaf", ayahs: 182, type: "Makkiyah", juz: [23] },
    { number: 38, name: "Sad", nameAr: "ص", meaning: "Sad", ayahs: 88, type: "Makkiyah", juz: [23] },
    { number: 39, name: "Az-Zumar", nameAr: "الزمر", meaning: "Rombongan", ayahs: 75, type: "Makkiyah", juz: [23, 24] },
    { number: 40, name: "Ghafir", nameAr: "غافر", meaning: "Pengampun", ayahs: 85, type: "Makkiyah", juz: [24] },
    { number: 41, name: "Fussilat", nameAr: "فصلت", meaning: "Yang Dijelaskan", ayahs: 54, type: "Makkiyah", juz: [24, 25] },
    { number: 42, name: "Asy-Syura", nameAr: "الشورى", meaning: "Musyawarah", ayahs: 53, type: "Makkiyah", juz: [25] },
    { number: 43, name: "Az-Zukhruf", nameAr: "الزخرف", meaning: "Perhiasan", ayahs: 89, type: "Makkiyah", juz: [25] },
    { number: 44, name: "Ad-Dukhan", nameAr: "الدخان", meaning: "Kabut", ayahs: 59, type: "Makkiyah", juz: [25] },
    { number: 45, name: "Al-Jasiyah", nameAr: "الجاثية", meaning: "Yang Berlutut", ayahs: 37, type: "Makkiyah", juz: [25] },
    { number: 46, name: "Al-Ahqaf", nameAr: "الأحقاف", meaning: "Bukit Pasir", ayahs: 35, type: "Makkiyah", juz: [26] },
    { number: 47, name: "Muhammad", nameAr: "محمد", meaning: "Muhammad", ayahs: 38, type: "Madaniyah", juz: [26] },
    { number: 48, name: "Al-Fath", nameAr: "الفتح", meaning: "Kemenangan", ayahs: 29, type: "Madaniyah", juz: [26] },
    { number: 49, name: "Al-Hujurat", nameAr: "الحجرات", meaning: "Kamar-Kamar", ayahs: 18, type: "Madaniyah", juz: [26] },
    { number: 50, name: "Qaf", nameAr: "ق", meaning: "Qaf", ayahs: 45, type: "Makkiyah", juz: [26] },
    { number: 51, name: "Az-Zariyat", nameAr: "الذاريات", meaning: "Angin", ayahs: 60, type: "Makkiyah", juz: [26, 27] },
    { number: 52, name: "At-Tur", nameAr: "الطور", meaning: "Bukit Sinai", ayahs: 49, type: "Makkiyah", juz: [27] },
    { number: 53, name: "An-Najm", nameAr: "النجم", meaning: "Bintang", ayahs: 62, type: "Makkiyah", juz: [27] },
    { number: 54, name: "Al-Qamar", nameAr: "القمر", meaning: "Bulan", ayahs: 55, type: "Makkiyah", juz: [27] },
    { number: 55, name: "Ar-Rahman", nameAr: "الرحمن", meaning: "Maha Pengasih", ayahs: 78, type: "Madaniyah", juz: [27] },
    { number: 56, name: "Al-Waqi'ah", nameAr: "الواقعة", meaning: "Yang Terjadi", ayahs: 96, type: "Makkiyah", juz: [27] },
    { number: 57, name: "Al-Hadid", nameAr: "الحديد", meaning: "Besi", ayahs: 29, type: "Madaniyah", juz: [27] },
    { number: 58, name: "Al-Mujadalah", nameAr: "المجادلة", meaning: "Gugatan", ayahs: 22, type: "Madaniyah", juz: [28] },
    { number: 59, name: "Al-Hasyr", nameAr: "الحشر", meaning: "Pengusiran", ayahs: 24, type: "Madaniyah", juz: [28] },
    { number: 60, name: "Al-Mumtahanah", nameAr: "الممتحنة", meaning: "Wanita Diuji", ayahs: 13, type: "Madaniyah", juz: [28] },
    { number: 61, name: "As-Saff", nameAr: "الصف", meaning: "Barisan", ayahs: 14, type: "Madaniyah", juz: [28] },
    { number: 62, name: "Al-Jumu'ah", nameAr: "الجمعة", meaning: "Jumat", ayahs: 11, type: "Madaniyah", juz: [28] },
    { number: 63, name: "Al-Munafiqun", nameAr: "المنافقون", meaning: "Orang Munafik", ayahs: 11, type: "Madaniyah", juz: [28] },
    { number: 64, name: "At-Tagabun", nameAr: "التغابن", meaning: "Pengungkapan", ayahs: 18, type: "Madaniyah", juz: [28] },
    { number: 65, name: "At-Talaq", nameAr: "الطلاق", meaning: "Talak", ayahs: 12, type: "Madaniyah", juz: [28] },
    { number: 66, name: "At-Tahrim", nameAr: "التحريم", meaning: "Pengharaman", ayahs: 12, type: "Madaniyah", juz: [28] },
    { number: 67, name: "Al-Mulk", nameAr: "الملك", meaning: "Kerajaan", ayahs: 30, type: "Makkiyah", juz: [29] },
    { number: 68, name: "Al-Qalam", nameAr: "القلم", meaning: "Pena", ayahs: 52, type: "Makkiyah", juz: [29] },
    { number: 69, name: "Al-Haqqah", nameAr: "الحاقة", meaning: "Hari Kiamat", ayahs: 52, type: "Makkiyah", juz: [29] },
    { number: 70, name: "Al-Ma'arij", nameAr: "المعارج", meaning: "Tempat Naik", ayahs: 44, type: "Makkiyah", juz: [29] },
    { number: 71, name: "Nuh", nameAr: "نوح", meaning: "Nuh", ayahs: 28, type: "Makkiyah", juz: [29] },
    { number: 72, name: "Al-Jinn", nameAr: "الجن", meaning: "Jin", ayahs: 28, type: "Makkiyah", juz: [29] },
    { number: 73, name: "Al-Muzzammil", nameAr: "المزمل", meaning: "Berselimut", ayahs: 20, type: "Makkiyah", juz: [29] },
    { number: 74, name: "Al-Muddassir", nameAr: "المدثر", meaning: "Berselubung", ayahs: 56, type: "Makkiyah", juz: [29] },
    { number: 75, name: "Al-Qiyamah", nameAr: "القيامة", meaning: "Kiamat", ayahs: 40, type: "Makkiyah", juz: [29] },
    { number: 76, name: "Al-Insan", nameAr: "الإنسان", meaning: "Manusia", ayahs: 31, type: "Madaniyah", juz: [29] },
    { number: 77, name: "Al-Mursalat", nameAr: "المرسلات", meaning: "Yang Diutus", ayahs: 50, type: "Makkiyah", juz: [29] },
    { number: 78, name: "An-Naba'", nameAr: "النبأ", meaning: "Berita Besar", ayahs: 40, type: "Makkiyah", juz: [30] },
    { number: 79, name: "An-Nazi'at", nameAr: "النازعات", meaning: "Yang Mencabut", ayahs: 46, type: "Makkiyah", juz: [30] },
    { number: 80, name: "'Abasa", nameAr: "عبس", meaning: "Bermuka Masam", ayahs: 42, type: "Makkiyah", juz: [30] },
    { number: 81, name: "At-Takwir", nameAr: "التكوير", meaning: "Menggulung", ayahs: 29, type: "Makkiyah", juz: [30] },
    { number: 82, name: "Al-Infitar", nameAr: "الانفطار", meaning: "Terbelah", ayahs: 19, type: "Makkiyah", juz: [30] },
    { number: 83, name: "Al-Mutaffifin", nameAr: "المطففين", meaning: "Curang", ayahs: 36, type: "Makkiyah", juz: [30] },
    { number: 84, name: "Al-Insyiqaq", nameAr: "الانشقاق", meaning: "Terbelah", ayahs: 25, type: "Makkiyah", juz: [30] },
    { number: 85, name: "Al-Buruj", nameAr: "البروج", meaning: "Gugusan Bintang", ayahs: 22, type: "Makkiyah", juz: [30] },
    { number: 86, name: "At-Tariq", nameAr: "الطارق", meaning: "Yang Datang Malam", ayahs: 17, type: "Makkiyah", juz: [30] },
    { number: 87, name: "Al-A'la", nameAr: "الأعلى", meaning: "Maha Tinggi", ayahs: 19, type: "Makkiyah", juz: [30] },
    { number: 88, name: "Al-Gasyiyah", nameAr: "الغاشية", meaning: "Peristiwa Besar", ayahs: 26, type: "Makkiyah", juz: [30] },
    { number: 89, name: "Al-Fajr", nameAr: "الفجر", meaning: "Fajar", ayahs: 30, type: "Makkiyah", juz: [30] },
    { number: 90, name: "Al-Balad", nameAr: "البلد", meaning: "Negeri", ayahs: 20, type: "Makkiyah", juz: [30] },
    { number: 91, name: "Asy-Syams", nameAr: "الشمس", meaning: "Matahari", ayahs: 15, type: "Makkiyah", juz: [30] },
    { number: 92, name: "Al-Lail", nameAr: "الليل", meaning: "Malam", ayahs: 21, type: "Makkiyah", juz: [30] },
    { number: 93, name: "Ad-Duha", nameAr: "الضحى", meaning: "Waktu Duha", ayahs: 11, type: "Makkiyah", juz: [30] },
    { number: 94, name: "Asy-Syarh", nameAr: "الشرح", meaning: "Lapang", ayahs: 8, type: "Makkiyah", juz: [30] },
    { number: 95, name: "At-Tin", nameAr: "التين", meaning: "Buah Tin", ayahs: 8, type: "Makkiyah", juz: [30] },
    { number: 96, name: "Al-'Alaq", nameAr: "العلق", meaning: "Segumpal Darah", ayahs: 19, type: "Makkiyah", juz: [30] },
    { number: 97, name: "Al-Qadr", nameAr: "القدر", meaning: "Kemuliaan", ayahs: 5, type: "Makkiyah", juz: [30] },
    { number: 98, name: "Al-Bayyinah", nameAr: "البينة", meaning: "Bukti Nyata", ayahs: 8, type: "Madaniyah", juz: [30] },
    { number: 99, name: "Az-Zalzalah", nameAr: "الزلزلة", meaning: "Guncangan", ayahs: 8, type: "Madaniyah", juz: [30] },
    { number: 100, name: "Al-'Adiyat", nameAr: "العاديات", meaning: "Kuda Perang", ayahs: 11, type: "Makkiyah", juz: [30] },
    { number: 101, name: "Al-Qari'ah", nameAr: "القارعة", meaning: "Hari Kiamat", ayahs: 11, type: "Makkiyah", juz: [30] },
    { number: 102, name: "At-Takasur", nameAr: "التكاثر", meaning: "Bermegah-megahan", ayahs: 8, type: "Makkiyah", juz: [30] },
    { number: 103, name: "Al-'Asr", nameAr: "العصر", meaning: "Masa", ayahs: 3, type: "Makkiyah", juz: [30] },
    { number: 104, name: "Al-Humazah", nameAr: "الهمزة", meaning: "Pencela", ayahs: 9, type: "Makkiyah", juz: [30] },
    { number: 105, name: "Al-Fil", nameAr: "الفيل", meaning: "Gajah", ayahs: 5, type: "Makkiyah", juz: [30] },
    { number: 106, name: "Quraisy", nameAr: "قريش", meaning: "Kaum Quraisy", ayahs: 4, type: "Makkiyah", juz: [30] },
    { number: 107, name: "Al-Ma'un", nameAr: "الماعون", meaning: "Barang Berguna", ayahs: 7, type: "Makkiyah", juz: [30] },
    { number: 108, name: "Al-Kausar", nameAr: "الكوثر", meaning: "Nikmat Berlimpah", ayahs: 3, type: "Makkiyah", juz: [30] },
    { number: 109, name: "Al-Kafirun", nameAr: "الكافرون", meaning: "Orang Kafir", ayahs: 6, type: "Makkiyah", juz: [30] },
    { number: 110, name: "An-Nasr", nameAr: "النصر", meaning: "Pertolongan", ayahs: 3, type: "Madaniyah", juz: [30] },
    { number: 111, name: "Al-Lahab", nameAr: "المسد", meaning: "Gejolak Api", ayahs: 5, type: "Makkiyah", juz: [30] },
    { number: 112, name: "Al-Ikhlas", nameAr: "الإخلاص", meaning: "Ikhlas", ayahs: 4, type: "Makkiyah", juz: [30] },
    { number: 113, name: "Al-Falaq", nameAr: "الفلق", meaning: "Subuh", ayahs: 5, type: "Makkiyah", juz: [30] },
    { number: 114, name: "An-Nas", nameAr: "الناس", meaning: "Manusia", ayahs: 6, type: "Madaniyah", juz: [30] },
]

export interface SearchResult {
    surah: Surah
    ayah?: number  // if user searched for specific ayah
}

export function useQuranData() {
    const allSurahs = surahs

    function getSurahsByJuz(juzNumber: number): Surah[] {
        return surahs.filter(s => s.juz.indexOf(juzNumber) !== -1)
    }

    function getSurahByNumber(num: number): Surah | undefined {
        return surahs.find(s => s.number === num)
    }

    function getSurahByName(name: string): Surah | undefined {
        const n = name.toLowerCase().replace(/['\-]/g, '')
        return surahs.find(s =>
            s.name.toLowerCase().replace(/['\-]/g, '') === n ||
            s.name.toLowerCase().replace(/['\-]/g, '').indexOf(n) === 0
        )
    }

    function searchSurahs(query: string): SearchResult[] {
        if (!query.trim()) return surahs.map(s => ({ surah: s }))
        const q = query.trim()
        const qLow = q.toLowerCase()

        // Pattern: "surah:ayah" or "surah ayah" — e.g. "2:255", "Al-Baqarah:255", "Al-Baqarah 255"
        const ayahPattern = q.match(/^(.+?)[\s:]+(\d+)$/)
        if (ayahPattern) {
            const surahPart = ayahPattern[1].trim()
            const ayahNum = parseInt(ayahPattern[2])
            let found: Surah | undefined

            // Try number first
            if (/^\d+$/.test(surahPart)) {
                found = getSurahByNumber(parseInt(surahPart))
            } else {
                found = getSurahByName(surahPart)
            }

            if (found && ayahNum >= 1 && ayahNum <= found.ayahs) {
                return [{ surah: found, ayah: ayahNum }]
            }
            // If ayah out of range but surah found, show surah anyway
            if (found) {
                return [{ surah: found }]
            }
        }

        // Search by juz number
        const juzMatch = qLow.match(/^juz\s*(\d+)$/i)
        if (juzMatch) {
            return getSurahsByJuz(parseInt(juzMatch[1])).map(s => ({ surah: s }))
        }

        // Search by surah number only
        if (/^\d+$/.test(qLow)) {
            const num = parseInt(qLow)
            return surahs
                .filter(s => s.number === num || s.juz.indexOf(num) !== -1)
                .map(s => ({ surah: s }))
        }

        // Search by name / meaning / Arabic
        return surahs
            .filter(s =>
                s.name.toLowerCase().indexOf(qLow) !== -1 ||
                s.meaning.toLowerCase().indexOf(qLow) !== -1 ||
                s.nameAr.indexOf(q) !== -1
            )
            .map(s => ({ surah: s }))
    }

    return {
        allSurahs,
        getSurahsByJuz,
        getSurahByNumber,
        searchSurahs,
    }
}
