interface DailyVerse {
    arabic: string
    translation: string
    reference: string
}

const verses: DailyVerse[] = [
    {
        arabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
        translation: 'Read in the name of your Lord who created.',
        reference: "Al-'Alaq 96:1",
    },
    {
        arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
        translation: 'Indeed, with hardship comes ease.',
        reference: 'Ash-Sharh 94:6',
    },
    {
        arabic: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ',
        translation: 'And your Lord is going to give you, and you will be satisfied.',
        reference: 'Ad-Duha 93:5',
    },
    {
        arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ',
        translation: 'So remember Me; I will remember you.',
        reference: 'Al-Baqarah 2:152',
    },
    {
        arabic: 'وَتَوَكَّلْ عَلَى اللَّهِ ۚ وَكَفَىٰ بِاللَّهِ وَكِيلًا',
        translation: 'And rely upon Allah; and sufficient is Allah as Disposer of affairs.',
        reference: 'Al-Ahzab 33:3',
    },
    {
        arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي',
        translation: 'My Lord, expand for me my breast.',
        reference: 'Taha 20:25',
    },
    {
        arabic: 'إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
        translation: 'Indeed, Allah is with the patient.',
        reference: 'Al-Baqarah 2:153',
    },
    {
        arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ',
        translation: 'And whoever relies upon Allah – then He is sufficient for him.',
        reference: 'At-Talaq 65:3',
    },
    {
        arabic: 'ادْعُونِي أَسْتَجِبْ لَكُمْ',
        translation: 'Call upon Me; I will respond to you.',
        reference: 'Ghafir 40:60',
    },
    {
        arabic: 'فَإِنَّ ذِكْرَى تَنفَعُ الْمُؤْمِنِينَ',
        translation: 'And remind, for indeed, the reminder benefits the believers.',
        reference: 'Adh-Dhariyat 51:55',
    },
    {
        arabic: 'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ',
        translation: 'And do not despair of the mercy of Allah.',
        reference: 'Yusuf 12:87',
    },
    {
        arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً',
        translation: 'Our Lord, give us in this world good and in the Hereafter good.',
        reference: 'Al-Baqarah 2:201',
    },
    {
        arabic: 'وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ',
        translation: 'And Allah loves the doers of good.',
        reference: "Ali 'Imran 3:134",
    },
    {
        arabic: 'إِنَّ رَحْمَتَ اللَّهِ قَرِيبٌ مِّنَ الْمُحْسِنِينَ',
        translation: 'Indeed, the mercy of Allah is near to the doers of good.',
        reference: "Al-A'raf 7:56",
    },
    {
        arabic: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ',
        translation: 'And He is with you wherever you are.',
        reference: 'Al-Hadid 57:4',
    },
    {
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        translation: 'Say, He is Allah, the One.',
        reference: 'Al-Ikhlas 112:1',
    },
    {
        arabic: 'إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا',
        translation: 'Indeed, We have given you a clear conquest.',
        reference: 'Al-Fath 48:1',
    },
    {
        arabic: 'سَيَجْعَلُ اللَّهُ بَعْدَ عُسْرٍ يُسْرًا',
        translation: 'Allah will bring about, after hardship, ease.',
        reference: 'At-Talaq 65:7',
    },
    {
        arabic: 'وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ',
        translation: 'And We send down of the Quran that which is healing and mercy for the believers.',
        reference: "Al-Isra' 17:82",
    },
    {
        arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
        translation: 'And say, My Lord, increase me in knowledge.',
        reference: 'Taha 20:114',
    },
    {
        arabic: 'وَلَذِكْرُ اللَّهِ أَكْبَرُ',
        translation: 'And the remembrance of Allah is greater.',
        reference: "Al-'Ankabut 29:45",
    },
    {
        arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ',
        translation: 'O you who believe, seek help through patience and prayer.',
        reference: 'Al-Baqarah 2:153',
    },
    {
        arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
        translation: 'And whoever fears Allah – He will make a way out for him.',
        reference: 'At-Talaq 65:2',
    },
    {
        arabic: 'رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ',
        translation: 'Our Lord, accept from us. Indeed You are the Hearing, the Knowing.',
        reference: 'Al-Baqarah 2:127',
    },
    {
        arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
        translation: 'Verily, in the remembrance of Allah do hearts find rest.',
        reference: "Ar-Ra'd 13:28",
    },
    {
        arabic: 'كُنتُمْ خَيْرَ أُمَّةٍ أُخْرِجَتْ لِلنَّاسِ',
        translation: 'You are the best nation produced for mankind.',
        reference: "Ali 'Imran 3:110",
    },
    {
        arabic: 'وَاللَّهُ خَيْرُ الرَّازِقِينَ',
        translation: 'And Allah is the best of providers.',
        reference: 'Al-Jumu\'ah 62:11',
    },
    {
        arabic: 'فَسَتَذْكُرُونَ مَا أَقُولُ لَكُمْ',
        translation: 'And you will remember what I say to you.',
        reference: 'Ghafir 40:44',
    },
    {
        arabic: 'إِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ',
        translation: 'Indeed, Allah does not allow to be lost the reward of the doers of good.',
        reference: 'Yusuf 12:90',
    },
    {
        arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
        translation: 'Blessed is He in whose hand is dominion, and He is over all things competent.',
        reference: 'Al-Mulk 67:1',
    },
]

export function useDailyVerse() {
    const getVerseForDay = (dayNumber: number): DailyVerse => {
        const index = ((dayNumber - 1) % verses.length + verses.length) % verses.length
        return verses[index]
    }

    const todayVerse = computed(() => {
        const dayOfYear = Math.floor(
            (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
        )
        return getVerseForDay(dayOfYear)
    })

    return {
        getVerseForDay,
        todayVerse,
        totalVerses: verses.length,
    }
}
