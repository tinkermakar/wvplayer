module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  rules: {
    // v.1.4 (2021-09-20)
    '@typescript-eslint/no-explicit-any': 0,
    'arrow-parens': [1, 'as-needed'],
    'brace-style': [1, 'stroustrup'],
    'class-methods-use-this': 0,
    'func-names': [1, 'always', { generators: 'never' }],
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    'no-console': [1, { allow: ['error', 'info', 'warning'] }],
    'linebreak-style': 0,
    'object-curly-newline': [
      0,
      {
        ObjectExpression: 'always',
        ObjectPattern: { minProperties: 2 },
      },
    ],
    'no-plusplus': [1, { allowForLoopAfterthoughts: true }],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
