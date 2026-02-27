/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    500: '#ef4444',
                    600: '#dc2626',
                    700: '#b91c1c',
                    900: '#7f1d1d',
                },
                brand: {
                    DEFAULT: '#C0392B',
                    dark: '#962d22',
                    light: '#e74c3c',
                },
                surface: '#0F0F0F',
                card: '#1A1A1A',
                border: '#2A2A2A',
            },
        },
    },
    plugins: [],
};
