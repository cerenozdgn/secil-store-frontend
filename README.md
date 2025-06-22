# Secil Store Frontend

Bu proje, koleksiyon yönetimi ve kullanıcı kimlik doğrulama süreçlerini kolaylaştırmak amacıyla geliştirilmiş modern bir web uygulamasıdır.

## ✨ Teknolojiler

- **Next.js 15** – Uygulama iskeleti ve yönlendirme
- **TypeScript** – Tür güvenliği
- **Tailwind CSS** – Hızlı ve özelleştirilebilir stil katmanı
- **NextAuth.js** – Kimlik doğrulama
- **Zustand** – Global state yönetimi
- **Docker Compose** – Geliştirme ortamı konteynerleştirme

## 🚀 Kurulum (Local Development)

Aşağıdaki adımları izleyerek projeyi yerel bilgisayarınızda çalıştırabilirsiniz.

1. Depoyu klonlayın
   ```bash
   git clone <repo-link>
   cd secil-store-frontend
   ```

### 2. Gerekli paketleri kurun

````bash
npm install


### 3. Ortam değişkenlerini tanımlayın

Proje dizininde .env.local adlı bir dosya oluşturun ve aşağıdaki şablonu doldurun:

```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

### 4. Geliştirme sunucusunu başlatın

```bash
npm run dev

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine gidin.

## 🛠️ Docker ile Çalıştırma

```bash
docker-compose up

> Docker konteyneri ayağa kalktıktan sonra [http://localhost:3000](http://localhost:3000) üzerinden uygulamaya erişebilirsiniz.

## 📋 Klasör Yapısı

src/
├── app/         # Sayfalar ve layout yapısı
├── components/  # Tekrarlanabilir UI bileşenleri
├── lib/         # Zustand store’ları ve yardımcı fonksiyonlar
├── types/       # TypeScript tip tanımları
└── public/      # Statik dosyalar (resimler, favicon vb.)

````
