import * as dotenv from 'dotenv';
import { obtenerFeedAutor } from '../src/services/bluesky';

dotenv.config();

export async function publishFeed(): Promise<void> {
  try {
    const handle = process.env.BLUESKY_IDENTIFIER || '';
    const posts = await obtenerFeedAutor(handle);
    console.log(`Feed publicado con ${posts.length} posts`);
  } catch (error) {
    console.error('Error publicando feed:', error);
  }
}

if (require.main === module) {
  publishFeed();
}
