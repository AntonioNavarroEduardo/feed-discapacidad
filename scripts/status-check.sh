#!/bin/bash
# Verificar estado de todos los repositorios

echo "📊 Estado del ecosistema Bluesky:"
echo "================================="

check_repo() {
    local path=$1
    local name=$2
    
    if [ -d "$path" ]; then
        cd "$path"
        echo "✅ $name: $(git log -1 --format='%h %s' 2>/dev/null || echo 'Sin commits')"
        cd - > /dev/null
    else
        echo "❌ $name: No encontrado"
    fi
}

check_repo "../core/social-app" "Social App"
check_repo "../core/atproto" "AT Protocol" 
check_repo "../core/pds" "PDS"
check_repo "../infrastructure/indigo" "Indigo"
check_repo "../infrastructure/jetstream" "Jetstream"
check_repo "../infrastructure/ozone" "Ozone"
check_repo "../tools/feed-generator" "Feed Generator"
