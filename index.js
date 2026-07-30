// index.js
// Entry point untuk Node.js hosting biasa: Railway, Render, VPS, atau lokal.
// TIDAK dipakai oleh Vercel -- Vercel memakai api/webhook.js (serverless function).
//
// Mendukung dua mode lewat USE_WEBHOOK di .env:
//   - USE_WEBHOOK=false -> long polling (disarankan untuk development lokal)
//   - USE_WEBHOOK=true  -> webhook lewat server Express (disarankan untuk production
//                          di platform dengan proses long-running seperti Railway/Render)

import express from "express";
import { getBot } from "./bot.js";
import { BOT_NAME, USE_WEBHOOK, WEBHOOK_DOMAIN, WEBHOOK_PATH, PORT } from "./config.js";
import { logger } from "./utils/logger.js";

async function main() {
  const bot = await getBot();

  if (USE_WEBHOOK) {
    if (!WEBHOOK_DOMAIN) {
      logger.error("USE_WEBHOOK=true tapi WEBHOOK_DOMAIN belum diatur di .env. Bot dihentikan.");
      process.exit(1);
    }

    const app = express();
    app.use(express.json());

    app.get("/", (_req, res) => res.send(`${BOT_NAME} is running.`));
    app.use(bot.webhookCallback(WEBHOOK_PATH));

    await bot.telegram.setWebhook(`${WEBHOOK_DOMAIN}${WEBHOOK_PATH}`);
    app.listen(PORT, () => {
      logger.info(`${BOT_NAME} aktif via WEBHOOK di port ${PORT}`);
      logger.info(`Webhook URL: ${WEBHOOK_DOMAIN}${WEBHOOK_PATH}`);
    });
  } else {
    await bot.telegram.deleteWebhook().catch(() => {});
    await bot.launch();
    logger.info(`${BOT_NAME} aktif via POLLING (mode development)`);
  }

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

main().catch((err) => {
  logger.error("Gagal menjalankan bot:", err);
  process.exit(1);
});
