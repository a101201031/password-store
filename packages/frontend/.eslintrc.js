module.exports = {
  root: true,

  extends: ['eslint:recommended', 'prettier'],

  plugins: ['prettier'],

  parserOptions: { ecmaVersion: 2020 },

  rules: {
    'prettier/prettier': 'error',
  },

  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: ['react-app'],
    },
    {
      files: ['*.config.js'],
      parserOptions: {
        sourceType: 'module',
      },
      env: { node: true },
    },
    {
      files: ['*.test.js'],
      env: { jest: true },
    },
    {
      files: ['.eslintrc.js'],
      env: { node: true },
    },
  ],
};
