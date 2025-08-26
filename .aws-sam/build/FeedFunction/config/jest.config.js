/** @type {import('jest').Config} */
module.exports = {
  rootDir: '../',                       // Ajusta el directorio raíz al nivel del proyecto
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.{js,jsx}',
    '<rootDir>/tests/integration/**/*.test.{js,jsx}'
  ],
  testEnvironment: 'node',
  coverageDirectory: '<rootDir>/coverage',
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
