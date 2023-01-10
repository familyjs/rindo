module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jsdoc'],
  extends: [
    // including prettier here ensures that we don't set any rules which will conflict
    // with Prettier's formatting. Keep it last in the list so that nothing else messes
    // with it!
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', {
      "argsIgnorePattern": "^_",
      // TODO: Investigate using eslint-plugin-react to remove the need for varsIgnorePattern
      "varsIgnorePattern": "^(h|Fragment)$"
    }],
    /**
     * Configuration for the JSDoc plugin rules can be found at:
     * https://github.com/gajus/eslint-plugin-jsdoc
     */
    // validates that the name immediately following `@param` matches the parameter name in the function signature
    // this works in conjunction with "jsdoc/require-param"
    "jsdoc/check-param-names": [
      "error", {
        // if `checkStructured` is `true`, it asks that the JSDoc describe the fields being destructured.
        // turn this off to not leak function internals/discourage describing them
        checkDestructured: false,
      }],
    // require that jsdoc attached to a method/function require one `@param` per parameter
    "jsdoc/require-param": ["off"],
    // rely on TypeScript types to be the source of truth, minimize verbosity in comments
    "jsdoc/require-param-type": ["off"],
    "jsdoc/require-param-description": ["error"],
    'prefer-const': 'error',
    'no-var': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
  },
};
