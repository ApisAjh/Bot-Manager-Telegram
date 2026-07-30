// utils/logger.js
// Logger sederhana untuk console + pengiriman log ke channel/grup log (jika diaktifkan).

function timestamp() {
  return new Date().toISOString();
}

export const logger = {
  info: (...args) => console.log(`[INFO ${timestamp()}]`, ...args),
  warn: (...args) => console.warn(`[WARN ${timestamp()}]`, ...args),
  error: (...args) => console.error(`[ERROR ${timestamp()}]`, ...args),
};

/**
 * Kirim log aktivitas ke log_channel_id milik chat (jika dikonfigurasi).
 * @param {import('telegraf').Telegram} telegram - instance `bot.telegram` atau `ctx.telegram`
 * @param {number|string} logChannelId
 * @param {string} text - teks MarkdownV2 yang sudah jadi (biasanya dari formatter.js)
 */
export async function sendLog(telegram, logChannelId, text) {
  if (!logChannelId) return;
  try {
    await telegram.sendMessage(logChannelId, text, { parse_mode: "MarkdownV2" });
  } catch (err) {
    logger.error("Gagal mengirim log ke log_channel_id:", logChannelId, err.message);
  }
}
