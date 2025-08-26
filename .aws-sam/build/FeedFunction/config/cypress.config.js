const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'tests/e2e/**/*.cy.{js,jsx}',
    supportFile: false,            // ← importante: desactivar
    video: false,
    screenshotsFolder: 'logs/screenshots',
    videosFolder: 'logs/videos'
  }
});
