module.exports = {
  env: {
    node: true,
    jest: true,
    es2021: true,
    commonjs: true,
  },
  extends: [
    "airbnb-base",
    "prettier",
    "plugin:security-node/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ["prettier", "security-node"],
  rules: {
    "prettier/prettier": ["error"],
    "linebreak-style": 0,
    "func-names": 0,
    "class-methods-use-this": 0,
    "no-param-reassign": 0,
    "no-underscore-dangle": "off",
    indent: "off",
    "padding-line-between-statements": [
      "error",
      {
        blankLine: "always",
        prev: ["const", "let", "var", "if", "case"],
        next: "*",
      },
      {
        blankLine: "any",
        prev: ["const", "let", "var"],
        next: ["const", "let", "var"],
      },
    ],
    // TODO: We need to remove "off" and fix these
    "import/extensions": ["off"],
    "import/no-unresolved": ["off"],
    "@typescript-eslint/no-explicit-any": ["off"],
  },
};
