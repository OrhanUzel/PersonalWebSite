# Orhan UZEL - Kişisel Web Sitesi

Modern, responsive ve çok dilli bir yazılım geliştirici portföy sitesi. GitHub API entegrasyonu ile projelerinizi otomatik olarak sergileyin.

## Özellikler

- 🌓 **Karanlık/Aydınlık Tema Desteği** - Kullanıcı tercihine göre otomatik tema seçimi
- 🌍 **Çok Dilli Destek** - Türkçe ve İngilizce dil desteği, konum bazlı otomatik dil seçimi
- 📱 **Responsive Tasarım** - Tüm cihazlarda mükemmel görünüm
- ⚡ **Hızlı Performans** - Vite + React + TypeScript ile optimize edilmiş
- 🔗 **GitHub Entegrasyonu** - Projelerinizi otomatik olarak GitHub'dan çeker
- 🎨 **Modern UI/UX** - Tailwind CSS ile profesyonel tasarım

## Teknolojiler

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Build Tool:** Vite
- **Icons:** Lucide React
- **Deployment:** GitHub Pages

## Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Üretim için derle
npm run build
```

## GitHub Pages'e Deploy

1. Bu projeyi GitHub'da bir repository'e push edin
2. Repository ayarlarından GitHub Pages'i aktifleştirin
3. GitHub Actions workflow'u otomatik olarak çalışacak ve sitenizi deploy edecek

## Özelleştirme

### GitHub Kullanıcı Adınızı Değiştirme

`src/App.tsx` dosyasında 105. satırdaki GitHub API URL'sini kendi kullanıcı adınızla değiştirin:

```typescript
const response = await fetch('https://api.github.com/users/YOUR_USERNAME/repos?per_page=10&sort=updated');
```

### İletişim Bilgileri

Aynı dosyada iletişim bilgilerinizi güncelleyin (295-320. satırlar):

```typescript
<a href="mailto:your-email@example.com">
<a href="https://github.com/YOUR_USERNAME">
<a href="https://linkedin.com/in/YOUR_LINKEDIN">
```

## Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## İletişim

- **Email:** orhanuzel@yahoo.com
- **GitHub:** [@OrhanUzel](https://github.com/OrhanUzel)
- **LinkedIn:** [Orhan UZEL](https://linkedin.com/in/orhanuzel)