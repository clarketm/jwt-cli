module.exports = {
  collectCoverageFrom: ["(bin|lib)/**/*.{js,jsx,mjs}"],
  testMatch: [
    "<rootDir>/**/__tests__/**/*.{js,jsx,mjs}",
    "<rootDir>/**/?(*.)(spec|test).{js,jsx,mjs}"
  ],
  testEnvironment: "node",
  testURL: "http://0.0.0.0",
  transform: {
    "^.+\\.(js|jsx|mjs)$": "<rootDir>/node_modules/babel-jest"
  },
  transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$"],
  moduleFileExtensions: ["web.js", "js", "json", "web.jsx", "jsx", "node", "mjs"]
};
