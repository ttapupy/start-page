/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'papirus': '#D9D8C7',
        'retro_green': '#9ABA8F',
        'retro_blue': '#698C9E',
        'retro_red': '#C64D4D',
        'retro_orange': '#DA925E',
        'crt_background': 'hsl(109, 29%, 8%)',
        'crt_background_darker': 'hsl(109, 16%, 8%)',
        'crt_foreground': 'hsl(159, 12%, 85%)',
        'crt_amber': 'hsl(48, 19%, 87%)',
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
        montserrat: ['var(--font-montserrat)'],
      },
    },
  },
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/forms')
  ],
}
