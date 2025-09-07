import { fetchAndStoreFeed } from '../services/feed-generator';

export const handler = async () => {
  try {
    const DID = process.env.BLUESKY_DID!;
    console.log('🚀 Lambda ejecutando fetchAndStoreFeed...');
    
    await fetchAndStoreFeed(DID);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Feed actualizado correctamente' })
    };
  } catch (error) {
    console.error('❌ Error en Lambda:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
