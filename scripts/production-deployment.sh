#!/bin/bash

set -e

DEPLOYMENT_STRATEGY=${1:-blue-green}  # blue-green or canary
TRAFFIC_PERCENTAGE=${2:-10}
AWS_REGION=${3:-eu-west-1}

echo "🚀 Iniciando deployment a producción con estrategia: $DEPLOYMENT_STRATEGY"

# Pre-deployment checks
echo "🔍 Ejecutando verificaciones pre-deployment..."

# Verificar que staging esté saludable
STAGING_API_URL=$(cd infra && terraform output -raw api_gateway_url | sed 's/staging/staging/')
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "$STAGING_API_URL/health")

if [ "$HEALTH_CHECK" -ne 200 ]; then
    echo "❌ Staging no está saludable. Abortando deployment."
    exit 1
fi

# Verificar tests en staging
echo "🧪 Ejecutando tests de pre-producción..."
./scripts/load-test-staging.sh

if [ "$DEPLOYMENT_STRATEGY" == "blue-green" ]; then
    echo "🔵🟢 Ejecutando Blue-Green Deployment..."
    
    # Crear nuevo stack de producción (Green)
    cd infra
    terraform workspace select prod-green || terraform workspace new prod-green
    
    # Deploy a Green environment
    terraform apply -var-file="prod.tfvars" -auto-approve
    
    GREEN_API_URL=$(terraform output -raw api_gateway_url)
    
    # Smoke tests en Green
    echo "💨 Ejecutando smoke tests en Green environment..."
    ./scripts/test-deployment.sh "$GREEN_API_URL"
    
    # Switch traffic (actualizar DNS o API Gateway)
    echo "🔄 Switcheando tráfico a Green environment..."
    # Aquí iría la lógica para cambiar el tráfico
    
    # Cleanup Blue environment después de confirmación
    read -p "¿Confirmar destruir Blue environment? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        terraform workspace select prod-blue
        terraform destroy -var-file="prod.tfvars" -auto-approve
        terraform workspace delete prod-blue
    fi

elif [ "$DEPLOYMENT_STRATEGY" == "canary" ]; then
    echo "🐦 Ejecutando Canary Deployment..."
    
    # Deploy nueva versión
    cd infra
    terraform workspace select prod || terraform workspace new prod
    terraform apply -var-file="prod.tfvars" -auto-approve
    
    PROD_API_URL=$(terraform output -raw api_gateway_url)
    
    # Configurar weighted routing para canary
    echo "⚖️ Configurando tráfico canary: $TRAFFIC_PERCENTAGE%..."
    
    # Crear stage canary en API Gateway
    aws apigateway create-stage \
        --rest-api-id $(terraform output -raw api_id) \
        --stage-name canary \
        --deployment-id $(terraform output -raw deployment_id) \
        --canary-settings '{
            "percentTraffic": '$TRAFFIC_PERCENTAGE',
            "useStageCache": false
        }'
    
    echo "📊 Monitoreando métricas de canary por 10 minutos..."
    sleep 600  # Esperar 10 minutos
    
    # Verificar métricas
    ERROR_RATE=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/ApiGateway \
        --metric-name 5XXError \
        --dimensions Name=ApiName,Value=feed-discapacidad-api-prod \
        --start-time $(date -u -d '10 minutes ago' +%Y-%m-%dT%H:%M:%S) \
        --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
        --period 300 \
        --statistics Sum \
        --query 'Datapoints[0].Sum' \
        --output text)
    
    if [ "$ERROR_RATE" == "None" ]; then
        ERROR_RATE=0
    fi
    
    if [ "$ERROR_RATE" -le 5 ]; then
        echo "✅ Métricas saludables. Promocionando a 100% tráfico..."
        aws apigateway update-stage \
            --rest-api-id $(terraform output -raw api_id) \
            --stage-name prod \
            --patch-ops op=replace,path=/canarySettings/percentTraffic,value=100
    else
        echo "❌ Error rate demasiado alto: $ERROR_RATE. Rollback automático..."
        aws apigateway update-stage \
            --rest-api-id $(terraform output -raw api_id) \
            --stage-name prod \
            --patch-ops op=replace,path=/canarySettings/percentTraffic,value=0
        exit 1
    fi
fi

echo "✅ Deployment a producción completado exitosamente"
