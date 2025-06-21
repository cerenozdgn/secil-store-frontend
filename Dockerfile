# Dockerfile
FROM node:20-alpine

# 1. Uygulama klasörü
WORKDIR /app

# 2. package.json ve lock dosyasını kopyala
COPY package.json package-lock.json ./

# 3. Bağımlılıkları kur
RUN npm install

# 4. Projeyi kopyala
COPY . .

# 5. Port aç
EXPOSE 3000

# 6. Geliştirme sunucusunu çalıştır
CMD ["npm", "run", "dev"]