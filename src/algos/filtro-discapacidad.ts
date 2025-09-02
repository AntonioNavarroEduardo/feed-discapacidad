// Palabras clave relacionadas con discapacidad por idioma
const palabrasClaveEs = [
  'discapacidad', 'accesibilidad', 'inclusion', 'diversidad funcional',
  'autonomia personal', 'barreras arquitectonicas', 'vida independiente',
  'lengua de signos', 'braille', 'silla de ruedas', 'baston blanco',
  'perro guia', 'tecnologia asistiva', 'diseño universal', 'lectura facil',
  'once', 'cermi', 'dependencia', 'apoyo', 'integracion', 'normalizacion'
];

const palabrasClaveCA = [
  'discapacitat', 'accessibilitat', 'inclusio', 'diversitat funcional',
  'autonomia personal', 'barreres arquitectoniques', 'vida independent',
  'llengua de signes', 'braille', 'cadira de rodes', 'bastó blanc',
  'gos guia', 'tecnologia assistiva', 'disseny universal', 'lectura facil'
];

const hashtagsEs = [
  '#discapacidad', '#accesibilidad', '#inclusion', '#diversidadfuncional',
  '#vidaindependiente', '#lenguadesignos', '#braille', '#sillaruedas'
];

const hashtagsCA = [
  '#discapacitat', '#accessibilitat', '#inclusio', '#diversitatfuncional',
  '#vidaindependent', '#llenguadesignes', '#braille', '#cadirarodes'  
];

export function contienePalabrasClavePorIdioma(texto: string, idioma: string): boolean {
  if (!texto || typeof texto !== 'string') {
    return false;
  }

  const textoLower = texto.toLowerCase();
  
  if (idioma === 'spa' || idioma === 'es') {
    // Verificar palabras clave en español
    for (const palabra of palabrasClaveEs) {
      if (textoLower.includes(palabra.toLowerCase())) {
        return true;
      }
    }
    
    // Verificar hashtags en español
    for (const hashtag of hashtagsEs) {
      if (textoLower.includes(hashtag.toLowerCase())) {
        return true;
      }
    }
  }
  
  if (idioma === 'cat' || idioma === 'ca') {
    // Verificar palabras clave en catalán
    for (const palabra of palabrasClaveCA) {
      if (textoLower.includes(palabra.toLowerCase())) {
        return true;
      }
    }
    
    // Verificar hashtags en catalán
    for (const hashtag of hashtagsCA) {
      if (textoLower.includes(hashtag.toLowerCase())) {
        return true;
      }
    }
  }
  
  return false;
}

export function esRelevante(texto: string): boolean {
  return contienePalabrasClavePorIdioma(texto, 'spa');
}

// Funciones de compatibilidad con tests existentes
export const isRelevant = esRelevante;
