/** @type {import('tailwindcss').Config} */

/*
 * Graffiti/Street Art Palette
 * Bold, high-contrast colors inspired by urban art
 */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.css"
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        bg: {
          DEFAULT: '#0d0d0d',
          dark: '#000000',
          light: '#141414',
        },
        // Surface colors for cards/sections
        surface: {
          DEFAULT: '#1a1a1a',
          light: '#252525',
          dark: '#111111',
        },
        // Primary - Electric Pink
        primary: {
          DEFAULT: '#ff2d6a',
          light: '#ff5c8a',
          dark: '#d91a54',
          muted: '#ff2d6a33',
        },
        // Secondary - Neon Yellow
        secondary: {
          DEFAULT: '#f7ff00',
          light: '#faff66',
          dark: '#c5cc00',
          muted: '#f7ff0033',
        },
        // Accent - Cyan
        accent: {
          DEFAULT: '#00e5ff',
          light: '#66f0ff',
          dark: '#00b8cc',
          muted: '#00e5ff33',
        },
        // Text colors
        text: {
          DEFAULT: '#f5f5f5',
          muted: '#888888',
          dark: '#666666',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
        display: ['Asimovian', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
