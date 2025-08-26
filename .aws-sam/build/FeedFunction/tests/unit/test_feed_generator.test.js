const { generateFeed } = require('../../src/feed_generator');

describe('generateFeed()', () => {
  it('debe retornar un array de posts con las propiedades esperadas', () => {
    const sampleData = [
      { id: 1, text: 'Hola mundo', lang: 'es' },
      { id: 2, text: 'Hello world', lang: 'en' }
    ];

    const feed = generateFeed(sampleData);

    // Validar que devuelve un array
    expect(Array.isArray(feed)).toBe(true);

    // Validar longitud
    expect(feed.length).toBe(2);

    // Validar estructura de cada item
    feed.forEach((post, index) => {
      expect(post).toHaveProperty('id', sampleData[index].id);
      expect(post).toHaveProperty('content', sampleData[index].text);
      expect(post).toHaveProperty('language', sampleData[index].lang);
      expect(post).toHaveProperty('timestamp');
      expect(typeof post.timestamp).toBe('string');
    });
  });

  it('debe manejar lista vacía sin errores', () => {
    const feed = generateFeed([]);
    expect(Array.isArray(feed)).toBe(true);
    expect(feed.length).toBe(0);
  });
});
