# 🤖 Apis Group Manager

Bot manajemen grup Telegram modern, dibangun dengan **Node.js (ES Module)** dan **Telegraf**.
Terinspirasi dari konsep bot manajemen grup pada umumnya, namun dibangun dari nol dengan
struktur kode, desain pesan, dan identitas yang sepenuhnya berbeda.

---

## ✨ Fitur

### General
`/start` `/help` `/about` `/ping` `/settings` `/rules` `/admins`

### Moderation
`/ban` `/unban` `/kick` `/mute` `/unmute` `/warn` `/unwarn` `/resetwarn`
`/purge` `/pin` `/unpin` `/promote` `/demote`

### Protection (via `/settings` atau command cepat `/antilink on|off`, dst)
Anti Link · Anti Spam · Anti Flood · Anti Raid · Anti Bot ·
Anti Arabic · Anti Forward · Anti Sticker Spam · Anti Service Message

### Welcome System
Welcome Message · Goodbye Message · Custom Welcome/Goodbye (`/setwelcome`, `/setgoodbye`) ·
Auto Delete Welcome · Captcha (kolom tersedia, dapat dikembangkan lebih lanjut)

### Logging
Join Log · Leave Log · Ban Log · Delete Message Log · Edit Message Log
(diaktifkan lewat `/settings` → Logging, tujuan log diatur lewat kolom `log_channel_id`)

### Utility
`/poll` `/userinfo` `/chatinfo` `/admins` `/broadcast` (owner) `/stats` (owner) `/uptime`

---

## 🗂️ Struktur Proyek

```
/
├── index.js                 # Entry point Railway/Render/lokal (polling & webhook Express)
├── bot.js                    # Factory Telegraf: registrasi semua command & handler (dipakai bersama)
├── config.js                # Identitas bot & konfigurasi (SUMBER TUNGGAL)
├── package.json
├── vercel.json               # Routing & konfigurasi function untuk deploy Vercel
├── .env.example
├── api/
│   └── webhook.js            # Serverless function Vercel (terima update Telegram)
├── scripts/
│   └── set-webhook.js        # CLI: daftar/hapus/cek webhook (dipakai untuk Vercel)
├── handlers/
│   ├── errorHandler.js      # Global error handler (bot.catch)
│   ├── messageHandler.js    # Pipeline proteksi pesan + logging edit
│   └── memberHandler.js     # Welcome/Goodbye + Anti Raid/Bot + Join/Leave log
├── commands/
│   ├── general/              # start, help, about, ping, settings, rules, admins
│   ├── moderation/           # ban, unban, kick, mute, unmute, warn, purge, pin, ...
│   ├── protection/           # command cepat toggle proteksi
│   ├── welcome/               # setwelcome, setgoodbye
│   └── utility/                # poll, userinfo, chatinfo, broadcast, stats, uptime
├── middleware/
│   ├── adminCheck.js / ownerCheck.js / groupOnly.js
│   ├── antiLink.js / antiSpam.js / antiFlood.js / antiArabic.js
│   ├── antiForward.js / antiBot.js / antiServiceMessage.js / antiStickerSpam.js
│   └── errorHandler.js       # wrapper try/catch untuk setiap command
├── utils/
│   ├── formatter.js          # Header/footer & pembungkus pesan standar
│   ├── markdown.js           # Escaping MarkdownV2, mention, code block
│   ├── logger.js             # Logger console + kirim log ke channel
│   └── permission.js         # Cek admin/creator/owner, ekstraksi target user
└── database/
    ├── db.js                 # Koneksi SQLite (async/await)
    ├── schema.sql             # Skema tabel
    ├── chatSettings.js        # Pengaturan per grup
    ├── warnings.js            # Data peringatan user
    └── users.js               # Cache user untuk broadcast & statistik
```

---

## ⚙️ Identitas Bot

Seluruh identitas bot (nama bot & nama developer) **hanya** diambil dari `config.js`:

```js
export const BOT_NAME = "Apis Group Manager";
export const DEVELOPER_NAME = "Apis";
```

Ubah kedua nilai di atas untuk mengganti identitas bot di **seluruh pesan**, tanpa perlu
menyentuh file lain — semua command mengimpor nilai ini dari `utils/formatter.js`.

---

## 🚀 Instalasi & Menjalankan Secara Lokal

1. Clone/salin proyek ini, lalu install dependency:

   ```bash
   npm install
   ```

2. Salin `.env.example` menjadi `.env`, lalu isi token bot dari [@BotFather](https://t.me/BotFather):

   ```bash
   cp .env.example .env
   ```

   ```env
   BOT_TOKEN=123456789:isi-token-bot-anda
   OWNER_IDS=123456789
   USE_WEBHOOK=false
   ```

3. Jalankan bot (mode polling, cocok untuk development):

   ```bash
   npm start
   ```

Bot akan otomatis membuat database SQLite di `database/apis.db` saat pertama kali dijalankan.

---

## ☁️ Deploy Production

Bot ini **didesain untuk webhook** saat production, dengan dua jalur deploy berbeda:

- **Railway / Render / VPS** → pakai `index.js` (server Express long-running, webhook diatur otomatis saat proses start).
- **Vercel** → pakai `api/webhook.js` (serverless function, webhook didaftarkan manual sekali lewat script).

`index.js` **tidak** dipakai oleh Vercel. Vercel otomatis mendeteksi `api/webhook.js` sebagai
serverless function tanpa konfigurasi tambahan.

### Opsi A — Railway / Render (server long-running)

1. Set environment variable di platform hosting:

   ```env
   BOT_TOKEN=isi-token-bot-anda
   OWNER_IDS=123456789
   USE_WEBHOOK=true
   WEBHOOK_DOMAIN=https://nama-app-anda.up.railway.app
   WEBHOOK_PATH=/webhook/rahasia-anda
   PORT=3000
   ```

2. Deploy seperti biasa (`npm install` lalu `npm start` sebagai start command).
3. Saat proses menyala, `index.js` otomatis memanggil `bot.telegram.setWebhook(...)` —
   tidak perlu langkah manual tambahan.
4. Database SQLite disimpan di disk platform (Railway/Render menyediakan disk persisten),
   sehingga data pengaturan grup aman antar restart.

### Opsi B — Vercel (serverless)

Vercel menjalankan kode sebagai *serverless function* tanpa proses yang tetap menyala,
sehingga alurnya sedikit berbeda dari Opsi A:

1. **Deploy project** ke Vercel (lewat CLI `vercel deploy` maupun import repo dari dashboard).
   Vercel otomatis mengenali `api/webhook.js` sebagai function di endpoint
   `https://nama-app-anda.vercel.app/api/webhook`
   (atau `/webhook` yang lebih ringkas, berkat rewrite di `vercel.json`).

2. **Set environment variable** di dashboard Vercel (Project Settings → Environment Variables):

   ```env
   BOT_TOKEN=isi-token-bot-anda
   OWNER_IDS=123456789
   WEBHOOK_DOMAIN=https://nama-app-anda.vercel.app
   WEBHOOK_SECRET=isi-string-acak-rahasia
   ```

   `USE_WEBHOOK` tidak perlu diisi untuk Vercel (tidak dipakai oleh `api/webhook.js`).
   `WEBHOOK_SECRET` sangat dianjurkan karena URL `/api/webhook` bersifat tetap dan mudah
   ditebak orang lain — Telegram akan mengirim header `X-Telegram-Bot-Api-Secret-Token`
   yang divalidasi otomatis oleh `api/webhook.js`.

3. **Daftarkan webhook ke Telegram** — jalankan dari komputer lokal (satu kali saja,
   ulangi hanya jika domain berubah):

   ```bash
   # pastikan .env lokal berisi BOT_TOKEN, WEBHOOK_DOMAIN, WEBHOOK_SECRET yang sama
   npm run webhook:set
   ```

   Cek status kapan saja dengan:

   ```bash
   npm run webhook:info
   ```

4. Selesai — kirim `/start` ke bot di Telegram untuk menguji.

#### ⚠️ Catatan penting soal SQLite di Vercel

Filesystem Vercel bersifat **read-only**, kecuali folder `/tmp` yang bersifat **sementara**
(bisa hilang kapan saja saat *cold start* baru atau saat function pindah instance).
`config.js` sudah otomatis mengarahkan `DB_PATH` ke `/tmp/apis.db` saat mendeteksi
environment Vercel, sehingga bot tetap bisa berjalan tanpa error — **tetapi pengaturan
grup (settings, warn, dsb) tidak dijamin persisten** dan bisa ter-reset sewaktu-waktu.

Cocok untuk: uji coba, demo, atau trafik rendah.
**Tidak disarankan** untuk production dengan banyak grup aktif tanpa penyesuaian lebih
lanjut. Rekomendasi untuk production yang serius di Vercel:

- Ganti driver di `database/db.js` dari SQLite lokal ke **Turso / libSQL** (kompatibel API
  mirip SQLite, punya mode serverless-friendly), atau
- Gunakan **PostgreSQL** (mis. Neon, Supabase) dan sesuaikan query di `database/*.js`.

Karena seluruh akses data sudah dipisah rapi di folder `database/`, penggantian driver
hanya perlu dilakukan di file-file tersebut — command dan middleware tidak perlu diubah.

#### ⚠️ Catatan soal tracker in-memory (Anti Flood/Raid/Sticker Spam/Spam)

`middleware/antiFlood.js`, `middleware/antiSpam.js`, `middleware/antiStickerSpam.js`, dan
deteksi Anti Raid di `handlers/memberHandler.js` menyimpan penghitung sementara di memori
proses (`Map`). Di Railway/Render ini aman karena proses tetap menyala. Di Vercel, memori
ini bisa hilang antar invocation (terutama saat *cold start*), sehingga deteksi flood/raid
bisa kurang akurat dibanding deployment server long-running. Untuk akurasi maksimal di
Vercel, pertimbangkan memindahkan tracker ini ke penyimpanan eksternal (mis. Redis/Upstash).

---

## 🔐 Alur Permission

- **Semua orang** — command `/start`, `/help`, `/about`, `/ping`, `/rules` (lihat), `/poll`, `/userinfo`, `/uptime`.
- **Admin grup** (`creator` / `administrator`, dicek via `getChatMember`) — seluruh command Moderation, Protection, Welcome, dan `/settings`.
- **Owner bot** (ID pada `OWNER_IDS` di `.env`) — `/broadcast`, `/stats`, dan otomatis dianggap admin di grup manapun.

Pengecekan dilakukan lewat `middleware/adminCheck.js` dan `middleware/ownerCheck.js`, dipasang
sebagai Telegraf middleware sebelum handler command dijalankan.

---

## 🛡️ Cara Kerja Proteksi

Setiap fitur proteksi (`anti_link`, `anti_flood`, dst) disimpan sebagai kolom boolean pada
tabel `chats`. Middleware terkait (`middleware/antiLink.js`, `middleware/antiFlood.js`, ...)
dipasang secara global lewat `bot.use()` di `handlers/messageHandler.js`, memeriksa
pengaturan chat pada setiap pesan masuk, lalu menghapus pesan/melakukan tindakan hanya jika
fitur diaktifkan **dan** pengirim bukan admin.

Aktifkan/nonaktifkan lewat:
- Panel interaktif `/settings` (tombol ✅/❌), **atau**
- Command cepat: `/antilink on`, `/antiflood off`, dst.

---

## 🧩 Menambah Command Baru (Scalable by Design)

1. Buat file baru di folder `commands/<kategori>/`, ekspor fungsi handler `async (ctx) => {}`
   beserta array middleware (jika perlu proteksi permission).
2. Import & daftarkan di `index.js` dengan `bot.command("namacommand", ...middlewares, safe(handler))`.
3. Gunakan `buildMessage()` dari `utils/formatter.js` agar tampilan pesan tetap konsisten
   dengan header/footer bot.

---

## 📄 Lisensi

MIT License — bebas dimodifikasi dan dikembangkan lebih lanjut.

---

<div align="center">

**Development by Apis**

</div>
