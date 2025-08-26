const request = require('supertest');
const app = require('../../src/app'); // Asegúrate de exportar tu express app en src/app.js

describe('GET /api/health', () => {
  it('debe responder 200 con status ok', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
    expect(typeof response.body.timestamp).toBe('string');
  });
});
