import request from 'supertest';
import { app } from '../../src/server';
import * as service from '../../src/services/feed-generator';
import * as db from '../../src/lib/database';

// Mock de los servicios
jest.mock('../../src/services/feed-generator');
jest.mock('../../src/lib/database');

describe('Feed E2E tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle feed requests successfully', async () => {
    // Mock successful database response
    (db.getPosts as jest.Mock).mockReturnValue([
      { id: '1', author: 'test', content: 'test content', lang: 'es', createdAt: '2023-01-01' }
    ]);

    const response = await request(app)
      .get('/feed/test-did')
      .expect(200);
    
    expect(response.body).toHaveProperty('did');
    expect(response.body).toHaveProperty('items');
    expect(Array.isArray(response.body.items)).toBe(true);
  });

  it('should handle publish requests', async () => {
    (service.fetchAndStoreFeed as jest.Mock).mockResolvedValue(undefined);

    const response = await request(app)
      .post('/feed/publish')
      .send({ did: 'test-did' })
      .expect(200);
    
    expect(response.body).toEqual({ status: 'published' });
    expect(service.fetchAndStoreFeed).toHaveBeenCalledWith('test-did');
  });

  it('should handle database errors gracefully', async () => {
    (db.getPosts as jest.Mock).mockImplementation(() => {
      throw new Error('boom');
    });

    const response = await request(app)
      .get('/feed/test-did')
      .expect(500);
    
    expect(response.body).toHaveProperty('error');
  });
});
