const path = require('path');
const PATH_TO_TW_CONFIG = path.join(__dirname, 'tailwind.config.js');

module.exports = {
  plugins: {
    tailwindcss: PATH_TO_TW_CONFIG,
    autoprefixer: {},
  },
};
