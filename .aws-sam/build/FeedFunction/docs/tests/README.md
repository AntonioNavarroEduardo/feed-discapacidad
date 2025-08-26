# Flujo de Pruebas

Este documento detalla el alcance y criterios de las suites de pruebas.

## 1. Tests Unitarios

Alcance:
- Lógica de negocio pura (servicios, utilidades, validaciones).

Herramientas:
- Jest

Criterios de cobertura:
- 100% de statements en módulos críticos.
- ≥ 80% de branches.

Ubicación de archivos:
- \`tests/unitarios/\`

## 2. Tests de Integración

Alcance:
- Interacción entre controladores, servicios y BD.

Herramientas:
- Supertest + Jest
- Base de datos en memoria (SQLite)

Escenarios:
- CRUD completo para cada modelo.
- Errores de validación.

Ubicación de archivos:
- \`tests/integracion/\`

## 3. Tests E2E

Alcance:
- Flujo HTTP completo simulando cliente real.

Herramientas:
- Playwright

Flujos críticos:
- Registro y login.
- Creación y consulta de ítems.
- Permisos y errores.

Ubicación de archivos:
- \`tests/e2e/\`

## 4. Tests de Performance

Alcance:
- Latencia y throughput bajo carga.

Herramientas:
- k6

Métricas:
- Latencia p95 ≤ 200 ms.
- Throughput ≥ 100 req/s.

Ubicación de archivos:
- \`tests/performance/\`
