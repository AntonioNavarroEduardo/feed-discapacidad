import { contienePalabrasClavePorIdioma } from '../../src/algos/filtro-discapacidad';

describe('contienePalabrasClavePorIdioma', () => {
  it('debe encontrar palabra clave en español', () => {
    const text = 'La discapacidad es un derecho humano';
    expect(contienePalabrasClavePorIdioma(text, 'spa')).toBe(true);
  });

  it('debe retornar false si no hay keywords', () => {
    const text = 'Texto sin relación';
    expect(contienePalabrasClavePorIdioma(text, 'spa')).toBe(false);
  });

  it('debe retornar false para texto vacío', () => {
    expect(contienePalabrasClavePorIdioma('', 'spa')).toBe(false);
  });

  it('debe manejar mayúsculas y minúsculas', () => {
    const text = 'DISCAPACIDAD Y ACCESIBILIDAD';
    expect(contienePalabrasClavePorIdioma(text, 'spa')).toBe(true);
  });

  it('debe soportar catalán', () => {
    const text = 'Accessibilitat per a tots';
    expect(contienePalabrasClavePorIdioma(text, 'cat')).toBe(true);
  });

  it('debe retornar false si idioma no soportado', () => {
    const text = 'Some random text';
    expect(contienePalabrasClavePorIdioma(text, 'eng')).toBe(false);
  });
});
