describe('API Health Check (E2E)', () => {
  it('debe cargar la ruta /api/health exitosamente', () => {
    cy.request('/api/health')
      .its('status').should('eq', 200);
    cy.request('/api/health')
      .its('body.status').should('eq', 'ok');
  });
});
