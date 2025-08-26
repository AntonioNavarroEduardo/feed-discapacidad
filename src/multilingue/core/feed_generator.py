# feed_generator.py
from .filtro_multilingue import FiltroMultilingue

class FeedGenerator:
    def __init__(self, filtro_multilingue, idioma_prioritario='español'):
        self.filtro = filtro_multilingue
        self.idioma_prioritario = idioma_prioritario

    def generar_feed(self, textos):
        filtrados = self.filtro.filtrar(textos)
        # Priorizar idioma configurado
        prioritarios = [x for x in filtrados if x['idioma'] == self.idioma_prioritario]
        no_prioritarios = [x for x in filtrados if x['idioma'] != self.idioma_prioritario]
        # Etiquetar y formar feed
        feed = []
        for entrada in prioritarios + no_prioritarios:
            feed.append({
                'contenido': entrada['texto'],
                'idioma': entrada['idioma'],
                'prioridad': entrada['idioma'] == self.idioma_prioritario
            })
        return feed
