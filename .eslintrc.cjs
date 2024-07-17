/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    root: true,
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/eslint-config-prettier',
    ],
    env: {
        'vue/setup-compiler-macros': true,
        jest: true,
        es6: true,
    },
    parserOptions: {
        ecmaVersion: 13,
    },
    rules: {
        'vue/multi-word-component-names': 'off',
        'max-len': [
            1,
            90,
            2,
            {
                ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreComments: true,
            },
        ],
    },
    overrides: [
        {
            files: ['*.spec.js'],
            rules: {
                'max-len': 0,
            },
        },
    ],
};
