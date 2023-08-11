module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        "airbnb-base",
        "plugin:vue/vue3-essential",
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
        "no-prototype-buildins": "off",
        "no-console": "off",
        "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
        indent: ["error", 4],
        "no-shadow": ["error", { ignoreOnInitialization: true }],
        "max-len": ["error", {
            code: 200,
        }],
        "import/prefer-default-export": ["off"],
        "vue/multi-word-component-names": 0,
        "no-param-reassign": ["error", { props: false }],
        "consistent-return": 0,
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
        "vue/no-v-html": "error",
        quotes: ["error", "double"],
        semi: ["error", "always"],
    },
};
