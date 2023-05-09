module.exports = {
  extends: ['next', 'turbo', 'airbnb', 'airbnb-typescript', 'prettier'],
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')],
    },
  },
  ignorePatterns: [
    '.eslintrc.js',
    'postcss.config.js',
    'tailwind.config.js',
    'playwright.config.js',
    'next.config.js',
  ],
  rules: {
    // General Rules
    'linebreak-style': 'off',
    'no-console': 'warn',
    // React rules
    'react/react-in-jsx-scope': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-props-no-spreading': 'off',
    // Next rules
    '@next/next/no-html-link-for-pages': 'off',
  },
};
