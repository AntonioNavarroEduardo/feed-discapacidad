import { contienePalabrasClavePorIdioma } from '../src/algos/filtro-discapacidad';

export function testKeywordDetection(): void {
  const testCases = [
    { text: 'Texto sobre discapacidad y accesibilidad', lang: 'spa' },
    { text: 'Information about wheelchairs', lang: 'eng' },
    { text: 'Texto sobre accessibilitat', lang: 'cat' },
    { text: 'Información sobre desgaitasuna', lang: 'eus' }
  ];

  testCases.forEach(({ text, lang }) => {
    const hasKeywords = contienePalabrasClavePorIdioma(text, lang);
    console.log(`Texto: "${text}" (${lang}) -> Contiene palabras clave: ${hasKeywords}`);
  });
}

if (require.main === module) {
  testKeywordDetection();
}
