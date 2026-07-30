# 🤖 Apis Group Manager

Telegram Group Management Bot modern berbasis Node.js, Telegraf, dan SQLite.

Bot ini dibuat untuk membantu mengelola grup Telegram dengan fitur moderasi, proteksi, welcome system, utility, dan sistem konfigurasi yang mudah dikembangkan.

---

## ✨ Features

### 🛡️ Moderation
- Ban
- Unban
- Kick
- Mute / Unmute
- Warn System
- Reset Warn
- Purge Message
- Pin / Unpin
- Promote / Demote

### 🔒 Protection
- Anti Link
- Anti Spam
- Anti Flood
- Anti Arabic
- Anti Forward
- Anti Bot
- Anti Service Message
- Anti Sticker Spam
- Anti Raid

### 👋 Member System
- Welcome Message
- Goodbye Message
- Join / Leave Logging

### ⚙️ Utility
- User Info
- Chat Info
- Poll
- Broadcast
- Statistics
- Uptime

---

## 📂 Structure

```text
Bot-Manager-Telegram/
│
├── index.js
├── bot.js
├── config.js
├── package.json
├── vercel.json
├── .env.example
├── .gitignore
├── .vercelignore
├── README.md
│
├── api/
│   └── webhook.js
│
├── scripts/
│   └── set-webhook.js
│
├── handlers/
│   ├── errorHandler.js
│   ├── messageHandler.js
│   └── memberHandler.js
│
├── commands/
│   ├── general/
│   ├── moderation/
│   ├── protection/
│   ├── welcome/
│   └── utility/
│
├── middleware/
│   ├── groupOnly.js
│   ├── adminCheck.js
│   ├── ownerCheck.js
│   ├── antiLink.js
│   ├── antiSpam.js
│   └── antiFlood.js
│
├── utils/
│   ├── formatter.js
│   ├── markdown.js
│   ├── logger.js
│   └── permission.js
│
└── database/
    ├── db.js
    ├── schema.sql
    ├── chatSettings.js
    ├── warnings.js
    └── users.js
```


---

## 🚀 Installation

Clone repository:

git clone https://github.com/username/apis-group-manager.git

Install dependency:

npm install

---

## ⚙️ Environment Variables

```env
BOT_TOKEN=isi-token-bot-anda

OWNER_IDS=123456789

BOT_NAME=isi nama bot anda
DEVELOPER_NAME=isi nama developer anda

WEBHOOK_DOMAIN=https://nama-project.vercel.app
WEBHOOK_SECRET=

DB_PATH=./database/apis.db

FLOOD_LIMIT=5
FLOOD_INTERVAL_MS=6000

RAID_JOIN_LIMIT=8
RAID_INTERVAL_MS=15000

MAX_WARN=3
```
---

## ▶️ Running

Development:

npm start

Webhook:

npm run webhook:set

---

## ☁️ Deploy Vercel

1. Import repository ke Vercel.
2. Isi Environment Variables.
3. Deploy project.
4. Daftarkan webhook Telegram.

Webhook:

https://nama-project.vercel.app/api/webhook

---

## 🧩 Menambah Command Baru

1. Buat file baru di folder:

```text
commands/<kategori>/
```

2. Export handler:

```js
async (ctx) => {}
```

3. Daftarkan command:

```js
bot.command("namacommand", ...middlewares, safe(handler))
```

4. Gunakan `buildMessage()` dari:

```text
utils/formatter.js
```

agar format pesan tetap konsisten dengan header dan footer bot.

---

## 🤝 Contribution

Pull request dan pengembangan fitur sangat terbuka.

Silakan fork repository ini dan kembangkan versi kamu sendiri.

---

## 📄 License

MIT License

Bebas digunakan, dimodifikasi, dan dikembangkan lebih lanjut.

---

<div align="center">

Developed by Apis

</div>
