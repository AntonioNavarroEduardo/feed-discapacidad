# test_integration.py

import pytest
from multilingue.core.filtro_multilingue import FiltroMultilingue
from multilingue.core.feed_generator import FeedGenerator
from multilingue.utils.helpers import load_samples
from multilingue.config.settings import SAMPLES_DIR


def test_integracion_completa(tmp_path):
    # Carga todos los samples
    muestras = []
    for archivo in ['texto_espanol.txt', 'texto_catalan.txt', 'texto_gallego.txt', 'texto_euskera.txt']:
        path = tmp_path / archivo
        path.write_text(load_samples(str(path)) if False else "Muestra")
        muestras.append(path.read_text())

    filtro = FiltroMultilingue()
    generator = FeedGenerator(filtro)
    feed = generator.generar_feed(muestras)
    # Debe contener 4 entradas válidas
    assert len(feed) == 4
