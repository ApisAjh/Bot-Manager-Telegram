// scripts/set-webhook.js
// Utility CLI untuk mendaftarkan/menghapus/mengecek webhook Telegram secara manual.
// Dipakai khusus untuk deployment serverless (Vercel), karena api/webhook.js sendiri
// tidak memanggil setWebhook() otomatis (berbeda dengan mode webhook di index.js).
//
// Cara pakai (jalankan dari komputer lokal, setelah project berhasil di-deploy):
//   node scripts/set-webhook.js set      -> daftarkan webhook ke Telegram
//   node scripts/set-webhook.js info     -> lihat status webhook saat ini
//   node scripts/set-webhook.js delete   -> hapus webhook (kembali ke mode tanpa listener)

import { Telegram } from "telegraf";
import { BOT_TOKEN, WEBHOOK_DOMAIN, WEBHOOK_SECRET } from "../config.js";

const action = (process.argv[2] || "set").toLowerCase();
const telegram = new Telegram(BOT_TOKEN);

async function main() {
  if (BOT_TOKEN === "YOUR_BOT_TOKEN") {
    throw new Error("BOT_TOKEN belum diatur. Isi dulu di file .env sebelum menjalankan script ini.");
  }

  if (action === "set") {
    if (!WEBHOOK_DOMAIN) {
      throw new Error(
        "WEBHOOK_DOMAIN belum diatur di .env. Contoh: WEBHOOK_DOMAIN=https://nama-app-anda.vercel.app"
      );
    }

    // Menggunakan path "/webhook" karena sudah di-rewrite ke /api/webhook lewat vercel.json.
    // Jika vercel.json tidak dipakai / rewrite dihapus, ganti menjadi `${WEBHOOK_DOMAIN}/api/webhook`.
    const url = `${WEBHOOK_DOMAIN}/webhook`;
    const options = WEBHOOK_SECRET ? { secret_token: WEBHOOK_SECRET } : undefined;

    const result = await telegram.setWebhook(url, options);
    console.log("✅ Webhook berhasil didaftarkan:", result);
    console.log("URL webhook:", url);
    if (WEBHOOK_SECRET) console.log("Secret token: diaktifkan");
  } else if (action === "delete") {
    const result = await telegram.deleteWebhook();
    console.log("✅ Webhook berhasil dihapus:", result);
  } else if (action === "info") {
    const info = await telegram.getWebhookInfo();
    console.log("ℹ️ Status webhook saat ini:");
    console.log(info);
  } else {
    console.log("Perintah tidak dikenali. Gunakan salah satu:");
    console.log("  node scripts/set-webhook.js set");
    console.log("  node scripts/set-webhook.js info");
    console.log("  node scripts/set-webhook.js delete");
  }
}

main().catch((err) => {
  console.error("❌ Gagal menjalankan script:", err.message);
  process.exit(1);
});
