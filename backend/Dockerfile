# Use uma imagem base do Node.js
FROM node:18-alpine

RUN apk add --no-cache git

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie o arquivo package.json e package-lock.json
COPY package*.json ./

# Instale as dependências, incluindo TypeScript e TypeORM
RUN npm install
RUN npm install -g ts-node-dev

# Copie todo o código fonte para o diretório de trabalho
COPY . .


# Compile o código TypeScript para JavaScript
#RUN npm run build

# Exponha a porta 5000
EXPOSE 8080

# Execute as migrações antes de iniciar o servidor
CMD ["npm", "run", "dev:server"]