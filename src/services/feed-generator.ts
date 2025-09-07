import { getCursor, upsertCursor, insertPost } from '../lib/database';
import { detectarIdioma } from '../algos/filtro-espanol';
import { esRelevante } from '../algos/filtro-discapacidad';
import { getDiscapacidadFeed } from '../lib/bluesky';

export async function fetchAndStoreFeed(did: string): Promise<void> {
  try {
    const lastCursor = getCursor(did);
    
    console.log('🔍 Obteniendo posts reales de Bluesky...');
    
    // Reemplazar mockPosts por datos reales
    const realPosts = await getDiscapacidadFeed();
    
    console.log(`📊 Procesando ${realPosts.length} posts encontrados...`);
    
    let postsInserted = 0;
    
    for (const item of realPosts) {
      const text = item.text;
      const lang = detectarIdioma(text);
      
      // Aplicar filtros: idioma español y relevancia para discapacidad
      if (lang === 'spa' && esRelevante(text)) {
        try {
          insertPost({
            id: item.uri,
            did,
            author: item.author.did,
            content: text,
            lang: 'es',
            createdAt: item.createdAt,
          });
          postsInserted++;
        } catch (error) {
          // Ignorar errores de duplicados (UNIQUE constraint)
          if (!error.message?.includes('UNIQUE constraint')) {
            console.error('Error insertando post:', error);
          }
        }
      }
    }
    
    console.log(`✅ Se insertaron ${postsInserted} posts relevantes en español`);
    
    // Actualizar cursor con timestamp actual
    const newCursor = `cursor_${Date.now()}`;
    upsertCursor(did, newCursor);
    
  } catch (error) {
    console.error('❌ Error fetching feed:', error);
    throw error;
  }
}
