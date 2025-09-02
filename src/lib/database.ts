import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.env.FEEDGEN_SQLITE_LOCATION || path.resolve(__dirname, '../../.feed.db');
const db = new Database(DB_PATH);

// Inicializar tablas si no existen
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

// Inserta o actualiza un cursor
export function upsertCursor(did: string, cursor: string): void {
  const stmt = db.prepare(`
    INSERT INTO cursors (did, cursor) VALUES (?, ?)
    ON CONFLICT(did) DO UPDATE SET cursor=excluded.cursor
  `);
  stmt.run(did, cursor);
}

// Obtiene cursor por DID
export function getCursor(did: string): string | null {
  const stmt = db.prepare(`SELECT cursor FROM cursors WHERE did = ?`);
  const row = stmt.get(did) as { cursor: string } | undefined;
  return row ? row.cursor : null;
}

// Inserta un post si no existe
export function insertPost(post: {
  id: string;
  did: string;
  author: string;
  content: string;
  lang: string;
  createdAt: string;
}): void {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO posts (id, did, author, content, lang, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  stmt.run(post.id, post.did, post.author, post.content, post.lang, post.createdAt);
}

// Recupera los últimos N posts para un DID
export function getPosts(did: string, limit = 50): Array<{
  id: string;
  author: string;
  content: string;
  lang: string;
  createdAt: string;
}> {
  const stmt = db.prepare(`
    SELECT id, author, content, lang, createdAt
    FROM posts
    WHERE did = ?
    ORDER BY createdAt DESC
    LIMIT ?
  `);
  return stmt.all(did, limit) as Array<{
    id: string;
    author: string;
    content: string;
    lang: string;
    createdAt: string;
  }>;
}
