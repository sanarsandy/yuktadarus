import type { Config } from 'tailwindcss'

export default <Config>{
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './composables/**/*.{js,ts}',
        './plugins/**/*.{js,ts}',
        './app.vue',
    ],
    theme: {
        extend: {
            colors: {
                cream: {
                    50: '#FDFCF9',
                    100: '#F9F7F2',
                    200: '#F3EFE7',
                    300: '#E8E4DD',
                    400: '#D4CFC5',
                },
                emerald: {
                    DEFAULT: '#2D5A43',
                    50: '#E8F0EC',
                    100: '#D1E1D9',
                    200: '#A3C3B3',
                    300: '#75A58D',
                    400: '#478767',
                    500: '#2D5A43',
                    600: '#244836',
                    700: '#1B3628',
                    800: '#12241B',
                    900: '#09120D',
                },
                gold: {
                    DEFAULT: '#C4A962',
                    50: '#FBF7ED',
                    100: '#F2EACD',
                    200: '#E5D59B',
                    300: '#D8C069',
                    400: '#C4A962',
                    500: '#A8904A',
                    600: '#8C7638',
                    700: '#6F5D28',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                arabic: ['Amiri', 'serif'],
            },
            boxShadow: {
                'neu': '8px 8px 16px #E6E1D6, -8px -8px 16px #ffffff',
                'neu-sm': '4px 4px 8px #E6E1D6, -4px -4px 8px #ffffff',
                'neu-lg': '12px 12px 24px #E6E1D6, -12px -12px 24px #ffffff',
                'neu-inset': 'inset 4px 4px 8px #E6E1D6, inset -4px -4px 8px #ffffff',
                'neu-pressed': 'inset 6px 6px 12px #E6E1D6, inset -6px -6px 12px #ffffff',
                'neu-btn': '5px 5px 10px #E6E1D6, -5px -5px 10px #ffffff',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
                '4xl': '2rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out',
                'fade-up': 'fadeUp 0.6s ease-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
                'bounce-in': 'bounceIn 0.5s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' },
                },
                pulseSoft: {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.02)' },
                },
                bounceIn: {
                    '0%': { transform: 'scale(0.3)', opacity: '0' },
                    '50%': { transform: 'scale(1.05)' },
                    '70%': { transform: 'scale(0.9)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
