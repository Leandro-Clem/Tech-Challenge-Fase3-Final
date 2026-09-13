# --- Estágio 1: build do bundle ---
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# A API é acessada por caminho relativo; o Nginx faz o proxy no runtime.
ENV VITE_API_URL=/api
RUN npm run build

# --- Estágio 2: servidor estático ---
FROM nginx:1.27-alpine

# Para onde o /api será encaminhado. Com docker compose, o padrão aponta
# para o serviço "api". Rodando só este container, sobrescreva com:
#   -e API_UPSTREAM=http://host.docker.internal:3000
ENV API_UPSTREAM=http://api:3000

# A imagem do Nginx processa os arquivos desta pasta com envsubst na subida.
COPY nginx.default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
