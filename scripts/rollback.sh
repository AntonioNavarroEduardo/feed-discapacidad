#!/bin/bash

set -e

ROLLBACK_TARGET=${1:-"previous"}  # previous, staging, specific-version
SPECIFIC_VERSION=${2:-""}

echo "🔄 Iniciando rollback a: $ROLLBACK_TARGET"

case $ROLLBACK_TARGET in
    "previous")
        echo "⏮️ Rolling back to previous version..."
        cd infra
        terraform workspace select prod
        
        # Obtener versión anterior desde Git
        PREVIOUS_COMMIT=$(git rev-parse HEAD~1)
        git checkout $PREVIOUS_COMMIT
        
        # Apply previous configuration
        terraform apply -var-file="prod.tfvars" -auto-approve
        
        # Return to latest
        git checkout main
        ;;
        
    "staging")
        echo "📋 Rolling back to current staging version..."
        cd infra
        terraform workspace select staging
        STAGING_STATE=$(terraform show -json)
        
        terraform workspace select prod
        # Apply staging configuration to prod
        terraform apply -var-file="prod.tfvars" -auto-approve
        ;;
        
    "specific-version")
        if [ -z "$SPECIFIC_VERSION" ]; then
            echo "❌ Debe especificar una versión específica"
            exit 1
        fi
        
        echo "🎯 Rolling back to specific version: $SPECIFIC_VERSION"
        cd infra
        git checkout $SPECIFIC_VERSION
        terraform apply -var-file="prod.tfvars" -auto-approve
        git checkout main
        ;;
        
    *)
        echo "❌ Rollback target no válido: $ROLLBACK_TARGET"
        echo "Opciones válidas: previous, staging, specific-version"
        exit 1
        ;;
esac

# Verificar que el rollback fue exitoso
echo "🧪 Verificando rollback..."
cd ..
PROD_API_URL=$(cd infra && terraform output -raw api_gateway_url)
./scripts/test-deployment.sh "$PROD_API_URL"

echo "✅ Rollback completado y verificado"

# Notificar rollback
echo "📧 Enviando notificación de rollback..."
# Aquí añadirías integración con Slack, email, etc.
