declare module 'franc-min' {
  /**
   * Detecta el idioma de un texto.
   * @param text Texto a analizar.
   * @returns Código ISO 639-3 del idioma.
   */
  function franc(text: string): string;
  export = franc;
}
