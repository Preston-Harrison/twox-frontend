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
        'coral-blue': '#1A1A26',
        'coral-dark-grey': '#373746',
        'coral-grey': 'rgba(110, 110, 110, 1)',
        'coral-light-grey': '#BBBBBB',
        'coral-green': 'rgba(84, 178, 131, 1)',
        'coral-red': 'rgba(236, 96, 90, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
