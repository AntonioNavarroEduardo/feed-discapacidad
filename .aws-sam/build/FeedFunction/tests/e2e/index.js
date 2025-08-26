// Soporte global para Cypress E2E
Cypress.on('uncaught:exception', (err, runnable) => {
  // Evitar fallo de test por excepciones no manejadas de la aplicación
  return false;
});
