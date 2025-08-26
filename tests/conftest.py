# conftest.py

import pytest
from multilingue.core.filtro_multilingue import FiltroMultilingue

@pytest.fixture(scope='session')
def filtro():
    return FiltroMultilingue()

@pytest.fixture(scope='function')
def sample_texts(tmp_path):
    # Crea muestras temporales para pruebas
    textos = {
        'texto_espanol.txt': 'Hola, ¿cómo estás?\n',
        'texto_catalan.txt': 'Bon dia, com estàs?\n',
        'texto_gallego.txt': 'Bos días, como estás?\n',
        'texto_euskera.txt': 'Kaixo, zer moduz?\n'
    }
    files = []
    for name, content in textos.items():
        file = tmp_path / name
        file.write_text(content, encoding='utf-8')
        files.append(str(file))
    return files
