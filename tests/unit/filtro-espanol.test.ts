import { esIdiomaAceptado } from '../../src/algos/filtro-espanol';

// Mock correcto para franc-min
jest.mock('franc-min', () => jest.fn());

const franc = require('franc-min');

describe('esIdiomaAceptado', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe detectar español y devolver spa', () => {
    franc.mockReturnValue('spa');
    const result = esIdiomaAceptado('Hola mundo');
    expect(result).toBe('spa');
  });

  it('debe detectar catalán y devolver cat', () => {
    franc.mockReturnValue('cat');
    const result = esIdiomaAceptado('Hola món');
    expect(result).toBe('cat');
  });

  it('debe detectar gallego y devolver glg', () => {
    franc.mockReturnValue('glg');
    const result = esIdiomaAceptado('Ola mundo');
    expect(result).toBe('glg');
  });

  it('debe detectar euskera y devolver eus', () => {
    franc.mockReturnValue('eus');
    const result = esIdiomaAceptado('Kaixo mundua');
    expect(result).toBe('eus');
  });

  it('debe devolver null cuando franc devuelve idioma no aceptado', () => {
    franc.mockReturnValue('eng');
    const result = esIdiomaAceptado('Hello world');
    expect(result).toBeNull();
  });

  it('debe devolver null cuando franc devuelve idioma desconocido', () => {
    franc.mockReturnValue('und');
    const result = esIdiomaAceptado('xyz123');
    expect(result).toBeNull();
  });

  it('debe devolver null para texto vacío', () => {
    franc.mockReturnValue('und');
    const result = esIdiomaAceptado('');
    expect(result).toBeNull();
  });
});
