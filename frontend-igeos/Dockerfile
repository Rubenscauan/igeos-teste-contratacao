# Usando a imagem do Node.js
FROM node:16-alpine

# Diretório de trabalho no container
WORKDIR /app

# Copiar o package.json e instalar dependências
COPY package.json package-lock.json /app/
RUN npm install

# Copiar o código do frontend
COPY . /app/

# Construir o frontend
RUN npm run build

# Expor a porta 3000 (ou a porta do seu frontend)
EXPOSE 3000

# Rodar o frontend com serve
CMD ["npx", "serve", "build"]
