import request from 'supertest';
import { app } from '../../src/server';

describe('Server endpoints', () => {
  it('should handle POST /login', async () => {
    const res = await request(app)
      .post('/login')
      .send({ identifier: 'test', password: 'test' });
    
    expect(res.status).toBe(401); // Expected to fail without proper credentials
  });

  it('should handle GET /feed/:did', async () => {
    const res = await request(app).get('/feed/test-did');
    expect(res.status).toBe(200); // Now returns 200 with empty array
    expect(res.body).toHaveProperty('did');
    expect(res.body).toHaveProperty('items');
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it('should handle POST /feed/publish', async () => {
    const res = await request(app)
      .post('/feed/publish')
      .send({ did: 'test-did' });
    
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'published' });
  });

  it('should return 400 for POST /feed/publish without DID', async () => {
    const res = await request(app)
      .post('/feed/publish')
      .send({});
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
