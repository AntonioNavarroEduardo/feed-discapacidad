#!/bin/bash
# Setup completo del ecosistema Bluesky

echo "🔧 Configurando ecosistema Bluesky completo..."

# Setup social-app
cd ../core/social-app
echo "📱 Configurando social-app..."
if [ -f "package.json" ]; then
    yarn install || npm install
fi

# Setup atproto
cd ../atproto
echo "🌐 Configurando atproto..."
if [ -f "Makefile" ]; then
    make nvm-setup && make deps && make build
fi

# Setup pds
cd ../pds
echo "🖥️ Configurando PDS..."
if [ -f "docker-compose.yml" ]; then
    docker-compose pull
fi

echo "✅ Setup completo terminado"
