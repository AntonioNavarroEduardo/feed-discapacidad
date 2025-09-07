import { fetchAndStoreFeed } from './src/services/feed-generator';

async function testIntegration() {
  console.log('🚀 Iniciando prueba de integración...');
  
  try {
    // Usar tu DID real
    const testDID = 'did:plc:s664a67tdmo7hrihp3d44zi5';
    
    console.log(`📋 Usando DID: ${testDID}`);
    console.log('⏳ Ejecutando fetchAndStoreFeed...\n');
    
    await fetchAndStoreFeed(testDID);
    
    console.log('\n🎉 ¡Integración completada con éxito!');
    
  } catch (error) {
    console.error('❌ Error en la integración:', error);
    console.error('Stack trace:', error.stack);
  }
}

console.log('📄 Script iniciado');
testIntegration()
  .then(() => console.log('✅ Script terminado'))
  .catch((error) => console.error('💥 Error no capturado:', error));
