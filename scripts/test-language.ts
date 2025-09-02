import { esIdiomaAceptado } from '../src/algos/filtro-espanol';

export function testLanguageDetection(): void {
  const testCases = [
    'Este es un texto en español sobre discapacidad',
    'This is English text about accessibility',
    'Hau testu euskeraz desgaitasunari buruz',
    'Aquest és un text en català sobre accessibilitat'
  ];

  testCases.forEach(text => {
    const language = esIdiomaAceptado(text);
    console.log(`Texto: "${text}" -> Idioma: ${language}`);
  });
}

if (require.main === module) {
  testLanguageDetection();
}
