// tailwind config is required for editor support

const sharedConfig = require('tailwind-config/tailwind.config.js');

module.exports = {
  content: [`${__dirname}/app/**/*.{js,ts,jsx,tsx}`],
  presets: [sharedConfig],
};
