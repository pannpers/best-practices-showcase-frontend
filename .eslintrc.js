module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module', // allow for the use of imports
    project: './tsconfig.json',
    tsconfigRootDir: '.',
  },
  plugins: [
    '@typescript-eslint',
    // https://remarkablemark.org/blog/2020/01/12/eslint-sort-imports/
    'simple-import-sort',
  ],
  extends: [
    // https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base
    'airbnb-base',
    // https://github.com/typescript-eslint/typescript-eslint/blob/ecc96318f47d821c19513652f262b47b15fd8257/packages/eslint-plugin/src/configs/recommended.json
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    // https://prettier.io/docs/en/integrating-with-linters.html
    'prettier',
    'prettier/@typescript-eslint', // disable ESLint rules that would conflict with prettier.
  ],
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.ts', 'd.ts'],
      },
    },
  },
  rules: {
    // https://github.com/lydell/eslint-plugin-simple-import-sort#usage
    'simple-import-sort/sort': 'error',
    'sort-imports': 'off',
    'import/order': 'off',
    'lines-between-class-members': 'off',
    'no-bitwise': 'off',
    'no-shadow': 'off',
    'no-useless-constructor': 'off',
    'no-unused-expressions': 'warn',
    'no-param-reassign': 'warn',
    'no-empty-function': 'off',
    'class-methods-use-this': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
  },
}
