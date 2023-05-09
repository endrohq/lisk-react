module.exports = {
  extends: [
    `@hallarhq/eslint-config`,
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
  ],
  plugins: ['@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['**/*.cy.ts'],
  settings: {
    react: {
      version: `detect`,
    },
  },
  overrides: [
    {
      files: ['*.tsx', '*.ts'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
};
