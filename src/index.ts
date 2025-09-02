import { app } from './server';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Feed de discapacidad iniciado en puerto ${PORT}`);
    console.log(`Servidor disponible en http://0.0.0.0:${PORT}`);
  });
}

export { app };
