import { fetchAndStoreFeed } from '../../src/services/feed-generator';
import * as db from '../../src/lib/database';

// Mock de la base de datos
jest.mock('../../src/lib/database');

describe('Feed Generator Service', () => {
  const did = 'did:test';

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock de funciones de base de datos
    (db.getCursor as jest.Mock).mockReturnValue(null);
    (db.insertPost as jest.Mock).mockImplementation(() => {});
    (db.upsertCursor as jest.Mock).mockImplementation(() => {});
  });

  it('should fetch and store feed successfully', async () => {
    await expect(fetchAndStoreFeed(did)).resolves.not.toThrow();
    expect(db.upsertCursor).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    (db.getCursor as jest.Mock).mockImplementation(() => {
      throw new Error('Database error');
    });
    
    await expect(fetchAndStoreFeed(did)).rejects.toThrow('Database error');
  });
});
