# filtro_multilingue.py (versión alternativa con langdetect)
from langdetect import detect

class FiltroMultilingue:
    SUPPORTED_LANGS = {'es': 'español', 'ca': 'catalán', 'gl': 'gallego', 'eu': 'euskera'}

    def __init__(self):
        # No necesitamos cargar modelo con langdetect
        pass

    def detectar_idioma(self, texto):
        try:
            lang_code = detect(texto)
            return self.SUPPORTED_LANGS.get(lang_code, 'otro')
        except:
            return 'otro'

    def filtrar(self, textos):
        resultado = []
        for t in textos:
            idioma = self.detectar_idioma(t)
            if idioma != 'otro':
                resultado.append({'texto': t, 'idioma': idioma})
        return resultado
