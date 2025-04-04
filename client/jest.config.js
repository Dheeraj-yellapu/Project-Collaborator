module.exports = {
    roots: ['<rootDir>/src'], // Look for tests in src/
    testMatch: ['**/?(*.)+(test).js?(x)'], // Match .js and .jsx test files
    moduleDirectories: ['node_modules', '<rootDir>/src'], // Resolve imports from src/
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'], // Recognize .jsx files
    setupFilesAfterEnv: ['<rootDir>/setupTests.js'], // Load jest-dom
  };