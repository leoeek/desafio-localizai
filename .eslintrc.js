module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'camelcase': 'off',
    "vue/no-use-v-if-with-v-for": 'off'
  },
  overrides: [
    {
      files: [
        '**/*.spec.js'
      ],
      env: {
        jest: true
      }
    }
  ]
}
