# Dockerfile otimizado para deploy no Render
# Multi-stage build para otimização de tamanho e performance

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar dependências do sistema necessárias para Prisma
RUN apk add --no-cache openssl libc6-compat

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências (incluindo dev para build)
RUN npm ci

# Copiar código fonte
COPY . .

# Gerar Prisma Client com engine binária específica
RUN npx prisma generate

# Build da aplicação
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production

WORKDIR /app

# Instalar OpenSSL 3.x (necessário para Prisma no Alpine)
RUN apk add --no-cache openssl3 libc6-compat

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Gerar Prisma Client novamente no contexto de produção
RUN npx prisma generate

# Copiar build do stage anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Mudar propriedade dos arquivos
RUN chown -R nestjs:nodejs /app

# Usar usuário não-root
USER nestjs

# Expor porta (Render usa PORT da variável de ambiente)
EXPOSE 3000

# Healthcheck para Render
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/clientes', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Script de inicialização com migrations
CMD npx prisma migrate deploy && node dist/main
