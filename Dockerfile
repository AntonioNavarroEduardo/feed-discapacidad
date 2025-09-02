FROM node:18-alpine

WORKDIR /app

# Copiar definiciones y configuración
COPY package.json tsconfig.json ./

# Instalar dependencias (incluye dev para compilación)
RUN npm install

# Copiar el código fuente
COPY src ./src

# Compilar TypeScript a JavaScript
RUN npm run build

# Eliminar dependencias de desarrollo
RUN npm prune --production

# Exponer el puerto de la aplicación
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]
