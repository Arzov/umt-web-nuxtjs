module.exports = {
    root: true,

    env: {
        browser : true,
        node    : true
    },

    parserOptions: {
        parser: 'babel-eslint'
    },

    extends: [
        '@nuxtjs',
        'plugin:nuxt/recommended'
    ],

    plugins: [],

    // custom rules

    rules: {
        indent                      : ['error', 4],
        'vue/html-indent'           : ['error', 4],
        'brace-style'               : 'off',
        'no-multiple-empty-lines'   : 'off',
        'key-spacing'               : 'off',
        'padded-blocks'             : 'off'
    }
}
