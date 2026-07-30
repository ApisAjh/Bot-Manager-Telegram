// middleware/errorHandler.js
// Wrapper untuk menangani error di setiap handler command secara konsisten.

import { buildMessage } from "../utils/formatter.js";
import { logger } from "../utils/logger.js";

/**
 * Bungkus fungsi handler command dengan try/catch otomatis.
 * @param {(ctx: import('telegraf').Context) => Promise<void>} fn
 */
export function safe(fn) {
  return async (ctx) => {
    try {
      await fn(ctx);
    } catch (err) {
      logger.error(`Error pada command "${ctx.message?.text}":`, err);
      await ctx
        .replyWithMarkdownV2(
          buildMessage(
            "❌ Terjadi kesalahan saat memproses perintah ini\\.\nSilakan coba lagi beberapa saat lagi\\."
          )
        )
        .catch(() => {});
    }
  };
}
