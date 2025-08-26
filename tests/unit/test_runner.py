#!/usr/bin/env python3
import sys
sys.path.append('src')

from multilingue.core.filtro_multilingue import FiltroMultilingue
from multilingue.core.feed_generator import FeedGenerator

def test_filtro():
    print("=== Test Filtro Multilingüe ===")
    filtro = FiltroMultilingue()
    
    tests = [
        ("Hola, ¿cómo estás?", "español"),
        ("Bon dia, com estàs?", "catalán"),  
        ("Bos días", "gallego"),
        ("Kaixo", "euskera")
    ]
    
    for texto, esperado in tests:
        resultado = filtro.detectar_idioma(texto)
        status = "✅" if resultado == esperado else "❌"
        print(f"{status} {texto} -> {resultado} (esperado: {esperado})")

def test_generator():
    print("\n=== Test Feed Generator ===")
    filtro = FiltroMultilingue()
    generator = FeedGenerator(filtro)
    
    textos = [
        "Hola mundo",
        "Bon dia món", 
        "Hello world"
    ]
    
    feed = generator.generar_feed(textos)
    print(f"✅ Feed generado con {len(feed)} entradas")
    for entrada in feed:
        print(f"  - {entrada['contenido']} ({entrada['idioma']})")

if __name__ == "__main__":
    test_filtro()
    test_generator()
    print("\n✅ Todos los tests completados!")
