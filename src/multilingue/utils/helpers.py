# helpers.py

def normalize_text(text):
    """
    Normaliza el texto eliminando espacios excesivos y unificando mayúsculas/mínusculas.
    """
    return ' '.join(text.strip().split()).lower()


def load_samples(path):
    """
    Carga muestras de texto desde un archivo.
    :param path: Ruta al archivo de muestra.
    :return: Lista de líneas de texto.
    """
    with open(path, 'r', encoding='utf-8') as f:
        return [line.strip() for line in f if line.strip()]
