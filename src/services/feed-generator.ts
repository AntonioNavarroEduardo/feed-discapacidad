import { getCursor, upsertCursor, insertPost } from '../lib/database';
import { AtpAgent } from '@atproto/api';
import { detectarIdioma } from '../algos/filtro-espanol';
import { esRelevante } from '../algos/filtro-discapacidad';

const agent = new AtpAgent({ service: 'https://bsky.social' });

export async function fetchAndStoreFeed(did: string): Promise<void> {
  try {
    const lastCursor = getCursor(did);
    
    // Simulamos datos ya que necesitaríamos autenticación real para Bluesky
    const mockPosts = [
      {
        post: {
          uri: 'at://example.com/post/1',
          author: { did: 'did:example:author1' },
          record: { 
            text: 'Información sobre accesibilidad en espacios públicos',
            lang: 'es',
            createdAt: new Date().toISOString()
          },
          indexedAt: new Date().toISOString()
        }
      }
    ];

    for (const item of mockPosts) {
      const record = item.post.record;
      const text = record.text;
      
      if (detectarIdioma(text) === 'spa' && esRelevante(text)) {
        insertPost({
          id: item.post.uri,
          did,
          author: item.post.author.did,
          content: text,
          lang: record.lang || 'es',
          createdAt: record.createdAt,
        });
      }
    }
    
    // Simular nuevo cursor
    const newCursor = `cursor_${Date.now()}`;
    upsertCursor(did, newCursor);
    
  } catch (error) {
    console.error('Error fetching feed:', error);
    throw error;
  }
}
