/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  coveragePathIgnorePatterns: [
    "<rootDir>/test/",
    "<rootDir>/__tests__/",
    "<rootDir>/tests/",
    // Add other patterns as needed
  ],
};
