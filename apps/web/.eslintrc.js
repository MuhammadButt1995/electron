module.exports = {
  extends: ['custom/eslint-next'],
  parserOptions: {
    root: true,
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  ignorePatterns: ['app/components/ui/*'],
};
