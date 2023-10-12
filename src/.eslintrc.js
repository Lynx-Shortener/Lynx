module.exports = {
    env: {
        node: true,
        es2021: true,
    },
    extends: [
        "airbnb-base",
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
    rules: {
        "no-underscore-dangle": ["error", { allow: ["_id"] }],
        "global-require": "off",
        "no-prototype-buildins": "off",
        "no-console": "off",
        indent: ["error", 4],
        "no-shadow": ["error", { ignoreOnInitialization: true }],
        "max-len": ["error", {
            code: 200,
            ignoreStrings: true,
            ignoreTemplateLiterals: true
        }],
        "import/prefer-default-export": ["off"],
        "consistent-return": 0,
        "no-param-reassign": ["error", { props: false }],
        quotes: ["error", "double"],
        semi: ["error", "always"],
    },
};
