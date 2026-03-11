FROM node:22-alpine

WORKDIR /app

# Variables de entorno para la fase de build (reemplazadas en runtime por Coolify)
ARG SUPABASE_URL=https://placeholder.supabase.co
ARG SUPABASE_KEY=placeholder_key
ARG SITE_URL=https://noticia-paisa.com

ENV SUPABASE_URL=$SUPABASE_URL
ENV SUPABASE_KEY=$SUPABASE_KEY
ENV SITE_URL=$SITE_URL

# Instalar pnpm en la versión exacta del proyecto
RUN npm install -g pnpm@10.28.2

# Copiar archivos de dependencias primero (mejor cache de capas)
COPY package.json pnpm-lock.yaml ./
COPY patches/ ./patches/

# Instalar dependencias (incluye nuxt prepare via postinstall)
RUN pnpm install --frozen-lockfile

# Copiar el resto del código fuente
COPY . .

# Construir la aplicación
RUN pnpm build

EXPOSE 3000

ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000
ENV NODE_ENV=production

CMD ["node", ".output/server/index.mjs"]
