/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

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
        'wall': "url('../public/wall.jpg')",
      },
      colors: {
        'papirus': '#E0E0DE',
        'papirus_light': '#efefee',
        'retro_green': '#9ABA8F',
        'retro_greener': '#569441',
        'retro_blue': '#698C9E',
        'retro_bluer': '#4F839E',
        'retro_red': '#C64D4D',
        'retro_orange': '#DA925E',
        'crt_background': 'rgb(39, 50, 56)',
        'crt_background_darker': 'hsl(109, 16%, 8%)',
        'crt_foreground': 'hsl(159, 12%, 85%)',
        'crt_amber': 'hsl(48, 19%, 87%)',
      },
      fontFamily: {
        'dark_font': ['var(--font-figtree)', ...defaultTheme.fontFamily.sans],
        'light_font': defaultTheme.fontFamily.sans,
      },
    },
  },
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/forms')
  ],
}
