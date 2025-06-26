# 🎮 Quiz AI Game - Multi-Language Support

Aplikasi Quiz Game yang didukung AI dengan fitur multi-bahasa (Indonesia, English, 日本語, 中文) yang memungkinkan pemain untuk bermain dan belajar dalam bahasa pilihan mereka.

## 🌟 Fitur Utama

### 🎯 Multi-Bahasa Support
- **Bahasa Indonesia** 🇮🇩 - Bahasa default
- **English** 🇺🇸 - International language
- **日本語** 🇯🇵 - Japanese language
- **中文** 🇨🇳 - Chinese language

### 🤖 AI Powered Features
- **Dynamic Question Generation** - Soal dibuat secara dinamis oleh OpenAI GPT-3.5 Turbo
- **Language-Specific Content** - Soal dan penjelasan dalam bahasa yang dipilih
- **Motivational Messages** - Pesan motivasi AI dalam bahasa pemain
- **Smart Explanations** - Penjelasan detail untuk setiap jawaban

### 🎮 Game Features
- **5 Lives System** - Sistem nyawa dengan visual effects
- **Real-time Scoring** - Skor real-time dengan animasi
- **Topic Selection** - Pilihan topik yang beragam
- **Custom Topics** - Topik custom sesuai keinginan
- **Visual Effects** - Particle effects dan animasi

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js (versi 14 atau lebih tinggi)
- OpenAI API Key

### Installation
1. Clone repository ini
2. Install dependencies:
   ```bash
   npm install
   ```

3. Buat file `.env` di root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Jalankan aplikasi:
   ```bash
   npm start
   ```

5. Buka browser dan kunjungi: `http://localhost:3000`

## 🎯 Cara Menggunakan

### 1. Pilih Bahasa
- Gunakan language selector di pojok kanan atas
- Pilih bahasa yang diinginkan (Indonesia, English, 日本語, 中文)
- Bahasa akan tersimpan di localStorage

### 2. Mulai Permainan
- Masukkan nama pemain
- Pilih topik quiz atau buat topik custom
- Mulai menjawab soal

### 3. Bermain
- Pilih jawaban yang benar
- Lihat penjelasan detail
- Jaga nyawa Anda (5 nyawa)
- Dapatkan skor tertinggi

## 🌍 Multi-Language Features

### Supported Languages
| Language | Code | Description |
|----------|------|-------------|
| Bahasa Indonesia | `id` | Bahasa default, lengkap dengan istilah lokal |
| English | `en` | International language, suitable for global users |
| 日本語 | `ja` | Japanese language with proper honorifics |
| 中文 | `zh` | Chinese language with simplified characters |

### Language-Specific Content
- **UI Elements** - Semua teks interface dalam bahasa yang dipilih
- **Questions** - Soal quiz dalam bahasa pemain
- **Explanations** - Penjelasan detail dalam bahasa yang sesuai
- **Motivational Messages** - Pesan motivasi AI dalam bahasa pemain
- **Error Messages** - Pesan error dalam bahasa yang dipilih

### Language Persistence
- Bahasa yang dipilih akan tersimpan di localStorage
- Aplikasi akan mengingat preferensi bahasa pemain
- Tidak perlu memilih ulang setiap kali membuka aplikasi

## 🛠️ Technical Details

### Frontend
- **HTML5** - Semantic markup dengan data-i18n attributes
- **CSS3** - Modern styling dengan animations dan effects
- **JavaScript ES6+** - Class-based architecture dengan i18n system
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **OpenAI API** - AI-powered question generation

### Internationalization (i18n)
- **Custom i18n System** - Built-in translation management
- **Dynamic Content Loading** - Content updates based on language
- **Fallback System** - Graceful degradation for missing translations
- **Context-Aware Translations** - Appropriate language for different contexts

## 📁 Project Structure
```
Quiz AI/
├── public/
│   ├── js/
│   │   └── i18n.js          # Internationalization system
│   ├── index.html           # Main HTML file
│   ├── script.js            # Main game logic
│   └── style.css            # Styling
├── server.js                # Backend server
├── package.json             # Dependencies
└── README.md               # Documentation
```

## 🎨 UI/UX Features

### Visual Design
- **Modern Glassmorphism** - Translucent UI elements
- **Gradient Backgrounds** - Dynamic color schemes
- **Smooth Animations** - CSS transitions and keyframes
- **Responsive Design** - Works on all device sizes

### Interactive Elements
- **Language Selector** - Easy language switching
- **Topic Cards** - Visual topic selection
- **Answer Options** - Interactive quiz options
- **Progress Indicators** - Visual feedback

### Effects & Animations
- **Particle Effects** - Success/failure visual feedback
- **Screen Shake** - Life loss indication
- **Score Animations** - Dynamic score updates
- **Loading Animations** - Smooth transitions

## 🔧 Configuration

### Environment Variables
```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=3000  # Optional, default is 3000
```

### Adding New Languages
1. Edit `public/js/i18n.js`
2. Add new language object to `translations`
3. Add language name to `getLanguageName()` function
4. Update HTML language selector options
5. Add language-specific prompts in `server.js`

## 🚀 Future Enhancements

### Planned Features
- **More Languages** - Korean, Spanish, French, etc.
- **Voice Support** - Text-to-speech for questions
- **Offline Mode** - Cached questions for offline play
- **Multiplayer** - Real-time multiplayer quiz
- **Leaderboards** - Global and local rankings
- **Achievements** - Gamification system
- **Custom Avatars** - Personalization options

### Technical Improvements
- **PWA Support** - Progressive Web App features
- **Database Integration** - User progress tracking
- **Analytics** - Usage statistics and insights
- **Performance Optimization** - Faster loading times

## 🤝 Contributing

Kontribusi sangat diterima! Beberapa area yang bisa dikembangkan:

1. **New Languages** - Menambahkan bahasa baru
2. **UI Improvements** - Enhance visual design
3. **Game Features** - New gameplay mechanics
4. **Performance** - Optimization improvements
5. **Documentation** - Better documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **OpenAI** - For providing the AI capabilities
- **Socket.IO** - For real-time communication
- **Font Awesome** - For beautiful icons
- **Google Fonts** - For typography

---

**🎮 Selamat bermain dan belajar dengan Quiz AI Game! 🌟**

*Available in: Indonesia, English, 日本語, 中文* 