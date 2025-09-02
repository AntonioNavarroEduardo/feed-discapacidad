import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const TEST_DB = path.resolve(__dirname, '../.test.db');

// Mock del módulo database para que use la BD de test
jest.mock('../../src/lib/database', () => {
  const db = new Database(TEST_DB);
  
  // Crear tablas
  db.prepare(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      did TEXT NOT NULL,
      author TEXT,
      content TEXT,
      lang TEXT,
      createdAt TEXT,
      indexedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS cursors (
      did TEXT PRIMARY KEY,
      cursor TEXT
    )
  `).run();

  return {
    upsertCursor: (did: string, cursor: string) => {
      const stmt = db.prepare(`
        INSERT INTO cursors (did, cursor) VALUES (?, ?)
        ON CONFLICT(did) DO UPDATE SET cursor=excluded.cursor
      `);
      stmt.run(did, cursor);
    },
    
    getCursor: (did: string) => {
      const stmt = db.prepare(`SELECT cursor FROM cursors WHERE did = ?`);
      const row = stmt.get(did) as { cursor: string } | undefined;
      return row ? row.cursor : null;
    },
    
    insertPost: (post: any) => {
      const stmt = db.prepare(`
        INSERT OR IGNORE INTO posts (id, did, author, content, lang, createdAt)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      stmt.run(post.id, post.did, post.author, post.content, post.lang, post.createdAt);
    },
    
    getPosts: (did: string, limit = 50) => {
      const stmt = db.prepare(`
        SELECT id, author, content, lang, createdAt
        FROM posts
        WHERE did = ?
        ORDER BY createdAt DESC
        LIMIT ?
      `);
      return stmt.all(did, limit);
    }
  };
});

import {
  upsertCursor,
  getCursor,
  insertPost,
  getPosts
} from '../../src/lib/database';

beforeEach(() => {
  // Limpiar datos antes de cada test
  if (fs.existsSync(TEST_DB)) {
    const db = new Database(TEST_DB);
    db.prepare('DELETE FROM cursors').run();
    db.prepare('DELETE FROM posts').run();
    db.close();
  }
});

afterAll(() => {
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
});

describe('Database layer', () => {
  const did = 'did:test';
  
  it('should upsert and retrieve cursor', () => {
    expect(getCursor(did)).toBeNull();
    upsertCursor(did, 'cursor1');
    expect(getCursor(did)).toBe('cursor1');
    upsertCursor(did, 'cursor2');
    expect(getCursor(did)).toBe('cursor2');
  });

  it('should insert and retrieve posts', () => {
    const post = {
      id: 'post1',
      did,
      author: 'author1',
      content: 'Contenido de prueba',
      lang: 'es',
      createdAt: new Date().toISOString()
    };
    insertPost(post);
    const posts = getPosts(did, 10);
    expect(posts).toHaveLength(1);
    expect(posts[0]).toMatchObject({
      id: 'post1',
      author: 'author1',
      content: 'Contenido de prueba',
      lang: 'es'
    });
  });

  it('should limit returned posts', () => {
    for (let i = 1; i <= 12; i++) {
      insertPost({ 
        id: `post${i}`, 
        did, 
        author: `a${i}`, 
        content: 'x', 
        lang: 'es', 
        createdAt: new Date(Date.now() + i).toISOString() 
      });
    }
    const limited = getPosts(did, 5);
    expect(limited).toHaveLength(5);
  });
});
