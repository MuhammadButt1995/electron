const path = require('path');
const PATH_TO_TW_CONFIG = path.join(__dirname, 'tailwind.config.js');

module.exports = {
  plugins: {
    tailwindcss: PATH_TO_TW_CONFIG,
    autoprefixer: {},
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
  },
};
