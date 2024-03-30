module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'prettier'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': [1, { allow: ['error', 'info', 'warning'] }],
    'no-shadow': 0,
    'consistent-return': 0,
    '@typescript-eslint/no-shadow': 'warn',
    'import/prefer-default-export': 0,
    'import/extensions': 0,
    'no-await-in-loop': 0,
    'no-restricted-syntax': 0,
    'no-plusplus': 0,
    'no-empty-pattern': ['error', { allowObjectPatternsAsParameters: true }],
    'lines-between-class-members': [
      'error',
      {
        enforce: [{ blankLine: 'always', prev: 'method', next: 'method' }],
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
