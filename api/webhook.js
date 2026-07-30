// api/webhook.js
// Serverless function Vercel yang menerima update dari Telegram (webhook).
//
// URL setelah deploy: https://<project-anda>.vercel.app/api/webhook
// (atau https://<project-anda>.vercel.app/webhook jika rewrite di vercel.json dipakai)
//
// Function ini TIDAK memanggil bot.launch()/setWebhook() -- pendaftaran webhook ke
// Telegram dilakukan sekali lewat scripts/set-webhook.js setelah deploy selesai.

import { getBot } from "../bot.js";
import { WEBHOOK_SECRET } from "../config.js";
import { logger } from "../utils/logger.js";

export default async function handler(req, res) {
  // Endpoint hanya untuk menerima POST dari Telegram. GET dipakai sekadar health-check.
  if (req.method !== "POST") {
    res.status(200).send("Apis Group Manager webhook aktif. Endpoint ini menerima POST dari Telegram.");
    return;
  }

  // Validasi secret token (jika WEBHOOK_SECRET diisi di environment variable).
  if (WEBHOOK_SECRET) {
    const incomingSecret = req.headers["x-telegram-bot-api-secret-token"];
    if (incomingSecret !== WEBHOOK_SECRET) {
      res.status(401).send("Unauthorized");
      return;
    }
  }

  try {
    const bot = await getBot();
    await bot.handleUpdate(req.body, res);
  } catch (err) {
    logger.error("Gagal memproses update webhook:", err);
  } finally {
    // Telegraf kadang tidak mengakhiri response secara otomatis untuk update
    // yang tidak punya handler terdaftar -- pastikan selalu ada respons agar
    // Vercel tidak menganggap function timeout.
    if (!res.writableEnded) {
      res.status(200).end();
    }
  }
}
