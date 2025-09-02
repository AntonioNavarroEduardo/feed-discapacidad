# Documentación de la API Feed Discapacidad

## Descripción General
La API Feed Discapacidad proporciona endpoints para gestionar feeds de contenido accesible con soporte multiidioma.

## Base URL
- **Desarrollo**: `https://api-dev.feed-discapacidad.com`
- **Staging**: `https://api-staging.feed-discapacidad.com`
- **Producción**: `https://api.feed-discapacidad.com`

## Autenticación
Actualmente la API es pública. En futuras versiones se implementará autenticación mediante API Key.

## Formatos de Respuesta
Todas las respuestas son en formato JSON con codificación UTF-8.

## Códigos de Estado HTTP
- `200`: Operación exitosa
- `201`: Recurso creado exitosamente
- `400`: Error en los parámetros de entrada
- `404`: Recurso no encontrado
- `500`: Error interno del servidor

## Soporte de Idiomas
La API soporta los siguientes idiomas:
- `es`: Español (por defecto)
- `en`: Inglés
- `fr`: Francés
- `ca`: Catalán

## Categorías de Discapacidad
- `motriz`: Discapacidad motriz
- `visual`: Discapacidad visual
- `auditiva`: Discapacidad auditiva
- `cognitiva`: Discapacidad cognitiva
- `multiple`: Discapacidades múltiples

## Ejemplos de Uso

### Obtener todos los feeds
curl -X GET "https://api.feed-discapacidad.com/feeds?lang=es&category=visual"



### Crear un nuevo feed
curl -X POST "https://api.feed-discapacidad.com/feeds"
-H "Content-Type: application/json"
-d '{
"title": "Tecnologías Asistivas para Discapacidad Visual",
"content": "Contenido del feed...",
"category": "visual",
"language": "es",
"metadata": {
"accessibility_features": ["alt-text", "screen-reader"],
"alt_text_available": true,
"audio_description": false
}
}'



### Obtener un feed específico
curl -X GET "https://api.feed-discapacidad.com/feeds/123e4567-e89b-12d3-a456-426614174000?lang=es"



## Características de Accesibilidad
- Soporte para texto alternativo en imágenes
- Compatibilidad con lectores de pantalla
- Audiodescripciones disponibles
- Estructura semántica de contenido
- Contraste de colores optimizado en respuestas HTML