# Secil Store Frontend

Bu proje, koleksiyon yönetimi ve kullanıcı kimlik doğrulama süreçlerini kolaylaştırmak amacıyla geliştirilmiş modern bir web uygulamasıdır.

## ✨ Teknolojiler

- _Next.js 15_ – Uygulama iskeleti ve yönlendirme
- _TypeScript_ – Tür güvenliği
- _Tailwind CSS_ – Hızlı ve özelleştirilebilir stil katmanı
- _NextAuth.js_ – Kimlik doğrulama
- _Zustand_ – Global state yönetimi
- _Docker Compose_ – Geliştirme ortamı konteynerleştirme

## 🚀 Kurulum (Local Development)

### 1. Depoyu klonlayın

bash
git clone <repo-link>
cd secil-store-frontend-main

### 2. Gerekli paketleri kurun

bash
npm install

### 3. Ortam değişkenlerini tanımlayın

Proje dizininde .env.local adlı bir dosya oluşturun ve aşağıdaki şablonu doldurun:

env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

### 4. Geliştirme sunucusunu başlatın

bash
npm run dev

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

## 🛠️ Docker ile Çalıştırma

bash
docker-compose up --build

> Docker konteyneri ayağa kalktıktan sonra [http://localhost:3000](http://localhost:3000) üzerinden uygulamaya erişebilirsiniz.

## 📋 Klasör Yapısı

src/
  app/           # Sayfalar ve layout yapısı
  components/    # UI bileşenleri
  lib/           # Zustand store'ları ve yardımcılar
  types/         # TypeScript tip tanımları
public/          # Statik dosyalar

