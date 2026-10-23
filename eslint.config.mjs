import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';

export default defineConfig({
  files: ['src/**/*.ts'],
  extends: [js.configs.recommended, ts.configs.recommended],
  languageOptions: { globals: { ...globals.node, ...globals.browser } },
  rules: {
    'class-methods-use-this': 'error',
    'no-nested-ternary': 'error',
    'no-restricted-globals': ['error', 'location'],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-empty-pattern': ['error', { allowObjectPatternsAsParameters: true }],
  },
});
