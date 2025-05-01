/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        COLOR_FONDO: '#00ADB5',
        COLOR_SUAVE: '#393E46',
        COLOR_DISTINTIVO: '#00ADB5',
        COLOR_TEXTO: '#EEEEEE',

      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        fadeSlideIn: {
          '0%': { opacity: 0, transform: 'translateY(-8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'dropdown': 'fadeSlideIn 0.2s ease-out forwards',
      },
    },
  },
  plugins: [],
};
