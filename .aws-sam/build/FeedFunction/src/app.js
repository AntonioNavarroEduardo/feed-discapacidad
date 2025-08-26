const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'Feed Discapacidad API',
    version: '1.0.0'
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Exportar app para testing
module.exports = app;
