module.exports = {
    preset: "jest-expo",
    setupFilesAfterEnv: [
      "@testing-library/jest-native/extend-expect",
      "jest-styled-components"
    ],
    testPathIgnorePatterns: [
      "/node_modules",
      "/android",
      "/ios"
    ],
   setupFiles: ["./jestSetupFile.js"]
  }