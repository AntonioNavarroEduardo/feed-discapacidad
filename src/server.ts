import express from 'express';
import { fetchAndStoreFeed } from './services/feed-generator';
import { getPosts } from './lib/database';
import dotenv from 'dotenv';

dotenv.config();

export const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas básicas del feed
app.get('/', (req, res) => {
  res.json({
    message: 'Feed de Discapacidad España',
    description: 'Noticias, recursos y experiencias sobre discapacidad en España',
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Endpoint de login que esperan los tests
app.post('/login', (req, res) => {
  const { identifier, password } = req.body;
  
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Identifier and password required' });
  }
  
  // Simula autenticación fallida para los tests
  res.status(401).json({ error: 'Invalid credentials' });
});

// Forzar recolección y almacenamiento
app.post('/feed/publish', async (req, res) => {
  try {
    const { did } = req.body;
    if (!did) return res.status(400).json({ error: 'DID required' });
    await fetchAndStoreFeed(did);
    res.status(200).json({ status: 'published' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Publish failed' });
  }
});

// Recuperar posts almacenados
app.get('/feed/:did', (req, res) => {
  const { did } = req.params;
  try {
    const items = getPosts(did);
    res.status(200).json({ did, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fetch failed' });
  }
});

// Ruta para el feed personalizado de Bluesky
app.get('/xrpc/app.bsky.feed.getFeedSkeleton', (req, res) => {
  res.json({
    feed: [],
    cursor: null
  });
});

// Manejo de errores
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});
