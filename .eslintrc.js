module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "airbnb-base",
        "plugin:vue/vue3-recommended",
    ],
    overrides: [
        {
            env: {
                node: true,
            },
            files: [
                ".eslintrc.{js,cjs}",
            ],
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: [
        "vue",
    ],
    rules: {
        indent: ["error", 4],
        "no-shadow": ["error", { ignoreOnInitialization: true }],
        "import/prefer-default-export": ["off"],
        "max-len": ["error", {
            code: 200,
        }],
        "vue/multi-word-component-names": 0,
        "consistent-return": 0,
        "no-param-reassign": ["error", { props: false }],
        "vue/singleline-html-element-content-newline": ["error", {
            ignoreWhenNoAttributes: true,
            ignoreWhenEmpty: true,
        }],
        "vue/max-attributes-per-line": ["error", {
            singleline: {
                max: 3,
            },
            multiline: {
                max: 1,
            },
        }],
        "vue/html-indent": ["error", 4, {
            alignAttributesVertically: true,
        }],
        "vue/no-v-html": "error", // You can enable this if needed
        quotes: ["error", "double"],
        semi: ["error", "always"],
    },
};
