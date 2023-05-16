const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    // app content
    'app/**/*.{js,ts,jsx,tsx}',
    'src/**/*.{js,ts,jsx,tsx}',
    // include packages if not transpiling
    // "../../packages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          white: '#FFFFFF',
          gray: '#EDEBE9',
          blue: '#085280',
          navy: '#05314D',
          black: '#121212',
        },
        'brand-blue': {
          50: '#509ED5',
          100: '#1C6FA3',
          200: '#085280',
          300: '#063C5E',
          400: '#05314D',
        },
        'brand-teal': {
          50: '#8DE1E2',
          100: '#5DC7D0',
          200: '#238196',
          300: '#026C84',
          400: '#005065',
        },
        'brand-orange': {
          50: '#FF9C66',
          100: '#E66E39',
          200: '#C55422',
          300: '#B34718',
          400: '#8F2400',
        },
        'brand-yellow': {
          50: '#FFD260',
          100: '#FFC13B',
          200: '#FFB400',
          300: '#EE9B09',
          400: '#CA7C1D',
        },
        'brand-green': {
          50: '#71A679',
          100: '#418152',
          200: '#2C6937',
          300: '#2559C2',
          400: '#1C4621',
        },
        'brand-magenta': {
          50: '#F29AC9',
          100: '#C44786',
          200: '#911A5B',
          300: '#761148',
          400: '#5A0030',
        },
      },
    },
  },
  plugins: [],
};
