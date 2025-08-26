# settings.py

import os

# Rutas de modelos y datos
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, '..', '..', 'data', 'models')
SAMPLES_DIR = os.path.join(BASE_DIR, '..', '..', 'data', 'samples')

# Idiomas soportados
SUPPORTED_LANGUAGES = {
    'es': 'español',
    'ca': 'catalán',
    'gl': 'gallego',
    'eu': 'euskera'
}
