#!/bin/bash

set -e

ENVIRONMENT=${1:-staging}
AWS_REGION=${2:-eu-west-1}

echo "💰 Analizando costes para entorno: $ENVIRONMENT"

# Obtener costes de Lambda
echo "📊 Costes de Lambda Functions..."
aws ce get-cost-and-usage \
    --time-period Start=2025-08-01,End=2025-08-31 \
    --granularity MONTHLY \
    --metrics BlendedCost \
    --group-by Type=DIMENSION,Key=SERVICE \
    --filter '{
        "Dimensions": {
            "Key": "SERVICE",
            "Values": ["AWS Lambda"]
        }
    }' \
    --query 'ResultsByTime[0].Groups[0].Metrics.BlendedCost.Amount' \
    --output text

# Obtener costes de API Gateway
echo "🌐 Costes de API Gateway..."
aws ce get-cost-and-usage \
    --time-period Start=2025-08-01,End=2025-08-31 \
    --granularity MONTHLY \
    --metrics BlendedCost \
    --group-by Type=DIMENSION,Key=SERVICE \
    --filter '{
        "Dimensions": {
            "Key": "SERVICE",
            "Values": ["Amazon API Gateway"]
        }
    }' \
    --query 'ResultsByTime[0].Groups[0].Metrics.BlendedCost.Amount' \
    --output text

# Obtener costes de DynamoDB
echo "🗄️ Costes de DynamoDB..."
aws ce get-cost-and-usage \
    --time-period Start=2025-08-01,End=2025-08-31 \
    --granularity MONTHLY \
    --metrics BlendedCost \
    --group-by Type=DIMENSION,Key=SERVICE \
    --filter '{
        "Dimensions": {
            "Key": "SERVICE",
            "Values": ["Amazon DynamoDB"]
        }
    }' \
    --query 'ResultsByTime[0].Groups[0].Metrics.BlendedCost.Amount' \
    --output text

# Recomendaciones de optimización
echo ""
echo "🔧 Recomendaciones de optimización:"
echo "- Ajustar memoria de Lambda según métricas de CloudWatch"
echo "- Revisar logs retention en CloudWatch (actualmente 14-30 días)"
echo "- Considerar Reserved Capacity en DynamoDB para workloads predecibles"
echo "- Implementar lifecycle policies en S3 si se usan buckets"
echo "- Revisar tráfico de API Gateway para optimizar caching"

# Generar reporte de utilización
echo ""
echo "📈 Generando reporte de utilización..."
aws logs describe-log-groups \
    --log-group-name-prefix "/aws/lambda/$ENVIRONMENT" \
    --query 'logGroups[*].[logGroupName,storedBytes,retentionInDays]' \
    --output table

echo "✅ Análisis de costes completado"
