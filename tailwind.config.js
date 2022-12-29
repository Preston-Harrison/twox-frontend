/* eslint-disable @typescript-eslint/no-var-requires */
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Inter', ...fontFamily.sans],
      },
      colors: {
        'coral-dark-blue': 'rgba(21, 21, 33, 1)',
        'coral-blue': '#1C1C2A', // old color: #1A1A26
        'coral-light-blue': 'rgba(104, 102, 246, 1)',
        'coral-dark-grey': '#373746',
        'coral-grey': 'rgba(110, 110, 110, 1)',
        'coral-light-grey': '#BBBBBB',
        'coral-green': 'rgba(84, 178, 131, 1)',
        'coral-red': 'rgba(236, 96, 90, 1)',
      },
    },
    fontSize: {
      sm: '0.8rem',
      base: 'var(--text-base)',
      xl: '1rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
    },
    screens: {
      'tablet': '640px',
      'laptop': '1024px',
      'desktop': '1280px',
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
