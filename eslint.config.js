import globals from "globals";
import eslint from "@eslint/js";
import babelParser from "@babel/eslint-parser";

export default [
  {
    // Ignores specific files and directories
    ignores: [
      "node_modules/",
      "dist/",
      "lib/"
    ]
  },
  {
    // Applies a recommended set of rules
    ...eslint.configs.recommended,

    files: ["**/*.js", "**/*.jsx"],

    // Defines the environment and global variables
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021 // Use es2021 instead of es6 for a broader set of globals
      },
      // Sets the parser and its options
      parser: babelParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: false,
        },
        requireConfigFile: false,
      }
    },

    // Defines custom rules
    rules: {
      "indent": [
        "error",
        4
      ],
      "linebreak-style": [
        "error",
        "unix"
      ],
      "quotes": [
        "error",
        "single"
      ],
      "semi": [
        "error",
        "always"
      ]
    }
  }
];