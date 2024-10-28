# Étape 1 : Utiliser une image de base pour Node.js
FROM node:18-alpine AS base

ARG CACHEBUST=1
ARG DATABASE_URL
ARG SHADOW_DATABASE_URL
ARG NEXT_PUBLIC_API_URL
ARG AUTH_GITHUB_ID
ARG AUTH_GITHUB_SECRET
ARG AUTH_GOOGLE_ID
ARG AUTH_GOOGLE_SECRET
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET

# Définir les variables d'environnement pour l'exécution
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV DATABASE_URL=$DATABASE_URL
ENV SHADOW_DATABASE_URL=$SHADOW_DATABASE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV AUTH_GITHUB_ID=$AUTH_GITHUB_ID
ENV AUTH_GITHUB_SECRET=$AUTH_GITHUB_SECRET
ENV AUTH_GOOGLE_ID=$AUTH_GOOGLE_ID
ENV AUTH_GOOGLE_SECRET=$AUTH_GOOGLE_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# Activer corepack
RUN corepack enable

# Installer OpenSSL et Nginx
RUN apk update && apk add --no-cache openssl nginx \
    && openssl version

# Étape 2 : Installer toutes les dépendances
FROM base AS deps
RUN apk add --no-cache libc6-compat

# Créer le dossier de travail de l'application
WORKDIR /app

# Copier les fichiers nécessaires pour l'installation des dépendances
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Installer toutes les dépendances (y compris devDependencies)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Étape 3 : Build de l'application
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Vérification avant le build
# RUN echo "Vérification des fichiers dans /app avant le build:" && ls -la /app
RUN pnpm run build

# Étape 4 : Environnement de production
FROM base AS production

# Créer un utilisateur non root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Créer le dossier de travail de l'application
WORKDIR /app

# Copier le contenu du dossier public et prisma
COPY --from=build /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copie du dossier .next/standalone et préservation des permissions
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static/
# COPY --from=build --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build --chown=nextjs:nodejs /app/prisma/schema.prisma ./prisma/schema.prisma 
COPY --from=build --chown=nextjs:nodejs /app/prisma/migrations ./prisma/migrations

# Exposer les ports Nginx et Node.js
EXPOSE 80
EXPOSE 443
EXPOSE 3000

# Passer à l'utilisateur non root
USER nextjs

# Commande de démarrage pour l'environnement de production
CMD ["node", "server"]

