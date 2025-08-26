# test_filtro_multilingue.py
import pytest
from filtro_multilingue import FiltroMultilingue

@pytest.fixture
def filtro():
    return FiltroMultilingue()

def test_detectar_espanol(filtro):
    assert filtro.detectar_idioma("Hola, ¿cómo estás?") == "español"

def test_detectar_catalan(filtro):
    assert filtro.detectar_idioma("Bon dia, com estàs?") == "catalán"

def test_detectar_gallego(filtro):
    assert filtro.detectar_idioma("Bos días, como estás?") == "gallego"

def test_detectar_euskera(filtro):
    assert filtro.detectar_idioma("Kaixo, zer moduz?") == "euskera"

def test_filtrar_multiples_textos(filtro):
    textos = [
        "Esto es español",
        "Això és català",
        "Isto é galego",
        "Hau euskara da",
        "Hello, this is English"
    ]
    resultado = filtro.filtrar(textos)
    assert len(resultado) == 4
    assert all(r['idioma'] in FiltroMultilingue.SUPPORTED_LANGS.values() for r in resultado)
