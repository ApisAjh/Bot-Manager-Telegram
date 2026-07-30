// config.js
// Seluruh identitas bot WAJIB diambil dari sini. Jangan hardcode di file lain.

import 'dotenv/config';

export const BOT_TOKEN = process.env.BOT_TOKEN || "YOUR_BOT_TOKEN";
export const BOT_NAME = "Apis Group Manager";
export const DEVELOPER_NAME = "Apis";

// ID Telegram numerik pemilik/owner bot (pisahkan dengan koma jika lebih dari satu)
export const OWNER_IDS = (process.env.OWNER_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean)
  .map(Number);

// Konfigurasi deployment
export const IS_VERCEL = !!process.env.VERCEL; // otomatis "1" saat berjalan di Vercel
export const USE_WEBHOOK = (process.env.USE_WEBHOOK || "true").toLowerCase() === "true";
export const WEBHOOK_DOMAIN = process.env.WEBHOOK_DOMAIN || ""; // contoh: https://nama-app.vercel.app
export const WEBHOOK_PATH = process.env.WEBHOOK_PATH || `/webhook/${BOT_TOKEN}`;
// Token rahasia opsional untuk validasi header X-Telegram-Bot-Api-Secret-Token
// (dianjurkan diisi saat pakai Vercel, karena URL /api/webhook bersifat tetap/mudah ditebak).
export const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "";
export const PORT = process.env.PORT || 3000;

// Database
// Vercel: filesystem read-only kecuali folder /tmp (bersifat sementara, hilang saat cold start).
// Lihat README bagian "Deploy ke Vercel" untuk rekomendasi database eksternal di production.
export const DB_PATH = process.env.DB_PATH || (IS_VERCEL ? "/tmp/apis.db" : "./database/apis.db");

// Batas proteksi
export const FLOOD_LIMIT = Number(process.env.FLOOD_LIMIT || 5);       // pesan
export const FLOOD_INTERVAL_MS = Number(process.env.FLOOD_INTERVAL_MS || 6000); // ms
export const RAID_JOIN_LIMIT = Number(process.env.RAID_JOIN_LIMIT || 8);
export const RAID_INTERVAL_MS = Number(process.env.RAID_INTERVAL_MS || 15000);
export const MAX_WARN = Number(process.env.MAX_WARN || 3);
