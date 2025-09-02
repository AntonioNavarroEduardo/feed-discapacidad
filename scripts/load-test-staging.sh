#!/bin/bash

set -e

STAGING_API_URL=${1:-""}
CONCURRENT_USERS=${2:-50}
TEST_DURATION=${3:-300}  # 5 minutos

if [ -z "$STAGING_API_URL" ]; then
    # Obtener URL desde Terraform
    cd infra
    STAGING_API_URL=$(terraform output -raw api_gateway_url)
    cd ..
fi

echo "🚦 Ejecutando load test en: $STAGING_API_URL"
echo "👥 Usuarios concurrentes: $CONCURRENT_USERS"
echo "⏱️ Duración: $TEST_DURATION segundos"

# Generar script de load test con Artillery
cat > load-test-config.yml << EOF
config:
  target: '$STAGING_API_URL'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: $TEST_DURATION
      arrivalRate: $CONCURRENT_USERS
      name: "Load test"
    - duration: 60
      arrivalRate: 5
      name: "Cool down"
  defaults:
    headers:
      User-Agent: "LoadTest/1.0"

scenarios:
  - name: "Health check and feeds"
    weight: 70
    flow:
      - get:
          url: "/health"
          expect:
            - statusCode: 200
      - think: 2
      - get:
          url: "/feeds"
          expect:
            - statusCode: 200

  - name: "Create feed"
    weight: 20
    flow:
      - post:
          url: "/feeds"
          json:
            title: "Load Test Feed {{ \$randomInt(1, 1000) }}"
            content: "Test content for load testing"
            category: "visual"
            language: "es"
          expect:
            - statusCode: [200, 201]

  - name: "Get specific feed"
    weight: 10
    flow:
      - get:
          url: "/feeds/test-feed-id"
          expect:
            - statusCode: [200, 404]
EOF

# Instalar Artillery si no está presente
if ! command -v artillery &> /dev/null; then
    echo "📦 Instalando Artillery..."
    npm install -g artillery
fi

# Ejecutar load test
echo "🎯 Iniciando load test..."
artillery run load-test-config.yml --output load-test-report.json

# Generar reporte HTML
artillery report load-test-report.json --output load-test-report.html

# Extraer métricas clave
echo ""
echo "📊 Resultados del Load Test:"
echo "============================"

# Verificar si el archivo JSON existe y extraer métricas
if [ -f "load-test-report.json" ]; then
    echo "📈 Requests por segundo promedio: $(jq -r '.aggregate.rates.mean' load-test-report.json || echo 'N/A')"
    echo "⚡ Latencia p95: $(jq -r '.aggregate.latencies.p95' load-test-report.json || echo 'N/A')ms"
    echo "❌ Error rate: $(jq -r '.aggregate.errors | length' load-test-report.json || echo '0')%"
    
    # Verificar umbrales críticos
    P95_LATENCY=$(jq -r '.aggregate.latencies.p95' load-test-report.json || echo 0)
    ERROR_COUNT=$(jq -r '.aggregate.errors | length' load-test-report.json || echo 0)
    
    if [ "$P95_LATENCY" -gt 2000 ]; then
        echo "⚠️ ADVERTENCIA: Latencia p95 muy alta: ${P95_LATENCY}ms"
        exit 1
    fi
    
    if [ "$ERROR_COUNT" -gt 10 ]; then
        echo "❌ ERROR: Demasiados errores en el load test: $ERROR_COUNT"
        exit 1
    fi
    
    echo "✅ Load test pasó todos los umbrales críticos"
else
    echo "⚠️ No se pudo generar reporte detallado"
fi

# Limpiar archivos temporales
rm -f load-test-config.yml

echo "📋 Reporte completo disponible en: load-test-report.html"
