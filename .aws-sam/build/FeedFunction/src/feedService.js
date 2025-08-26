const db = require('./db');

async function getFeed() {
  const res = await db.query('SELECT id, title, description, published_at AS "publishedAt" FROM feed_items ORDER BY published_at DESC');
  return res.rows;
}

module.exports = { getFeed };
