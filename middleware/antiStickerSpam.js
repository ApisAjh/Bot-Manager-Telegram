// middleware/antiStickerSpam.js
// Membatasi banjir stiker beruntun dari user yang sama jika anti_sticker_spam aktif.

import { getChatSettings } from "../database/chatSettings.js";
import { isChatAdmin } from "../utils/permission.js";

const stickerTracker = new Map(); // key: `${chatId}:${userId}` -> { count, last }
const STICKER_LIMIT = 4;
const STICKER_WINDOW_MS = 8000;

export function antiStickerSpam() {
  return async (ctx, next) => {
    if (ctx.chat?.type === "private" || !ctx.message?.sticker) return next();

    const settings = await getChatSettings(ctx.chat.id, ctx.chat.title);
    if (!settings.anti_sticker_spam) return next();

    const admin = await isChatAdmin(ctx);
    if (admin) return next();

    const key = `${ctx.chat.id}:${ctx.from.id}`;
    const now = Date.now();
    const entry = stickerTracker.get(key) || { count: 0, first: now };

    if (now - entry.first > STICKER_WINDOW_MS) {
      entry.count = 1;
      entry.first = now;
    } else {
      entry.count += 1;
    }
    stickerTracker.set(key, entry);

    if (entry.count > STICKER_LIMIT) {
      await ctx.deleteMessage().catch(() => {});
      return;
    }
    return next();
  };
}
