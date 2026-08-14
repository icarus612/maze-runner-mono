// Re-export of the shared root ESLint config, extended to parse JSX (Phase 3.4, lane 3).
const base = require("../../../eslint.config.js");
module.exports = [
  ...base,
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  { ignores: ["out/**"] },
];
