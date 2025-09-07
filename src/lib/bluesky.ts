import { BskyAgent } from '@atproto/api';

const agent = new BskyAgent({ service: 'https://bsky.social' });

export async function initAgent() {
  if (!agent.session) {
    await agent.login({
      identifier: 'antonio--navarro.bsky.social',
      password: 'abdz-ahm4-et2c-sw5q',
    });
  }
  return agent;
}

export async function postStatus(text: string) {
  const agent = await initAgent();
  const result = await agent.post({
    text,
    createdAt: new Date().toISOString(),
  });
  return { uri: result.uri, cid: result.cid };
}

// Leer timeline público
export async function getTimeline(limit = 50) {
  const agent = await initAgent();
  const result = await agent.getTimeline({ limit });
  return result.data.feed;
}

// Filtrar posts del timeline por palabras clave
export async function getDiscapacidadFeed() {
  const keywords = [
    'discapacidad', 'accesibilidad', 'inclusión', 'diversidad funcional',
    'barreras', 'autonomía', 'integración', 'apoyo', 'derechos',
    'diversidad', 'accesible', 'incluir', 'barrier', 'accessibility'
  ];
  
  try {
    console.log('📥 Obteniendo timeline público...');
    const timeline = await getTimeline(100); // Obtener más posts para filtrar
    
    console.log(`📊 Analizando ${timeline.length} posts...`);
    
    const filteredPosts = timeline.filter(item => {
      const text = item.post.record.text.toLowerCase();
      return keywords.some(keyword => 
        text.includes(keyword.toLowerCase())
      );
    });
    
    console.log(`✅ Encontrados ${filteredPosts.length} posts relevantes`);
    
    return filteredPosts.map(item => ({
      uri: item.post.uri,
      author: item.post.author,
      text: item.post.record.text,
      createdAt: item.post.record.createdAt,
      likeCount: item.post.likeCount,
      repostCount: item.post.repostCount,
      replyCount: item.post.replyCount,
    }));
    
  } catch (error) {
    console.error('❌ Error al obtener el feed:', error);
    return [];
  }
}
