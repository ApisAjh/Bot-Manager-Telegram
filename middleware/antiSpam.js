// middleware/antiSpam.js
// Mendeteksi pesan duplikat/berulang persis sama yang dikirim beruntun (indikasi spam iklan).

import { getChatSettings } from "../database/chatSettings.js";
import { isChatAdmin } from "../utils/permission.js";

const lastMessageTracker = new Map(); // key: `${chatId}:${userId}` -> { text, count }
const DUPLICATE_LIMIT = 3;

export function antiSpam() {
  return async (ctx, next) => {
    const text = ctx.message?.text || ctx.message?.caption || "";
    if (ctx.chat?.type === "private" || !text) return next();

    const settings = await getChatSettings(ctx.chat.id, ctx.chat.title);
    if (!settings.anti_spam) return next();

    const admin = await isChatAdmin(ctx);
    if (admin) return next();

    const key = `${ctx.chat.id}:${ctx.from.id}`;
    const prev = lastMessageTracker.get(key);

    if (prev && prev.text === text) {
      prev.count += 1;
    } else {
      lastMessageTracker.set(key, { text, count: 1 });
    }

    const entry = lastMessageTracker.get(key);
    if (entry.count >= DUPLICATE_LIMIT) {
      await ctx.deleteMessage().catch(() => {});
      return;
    }
    return next();
  };
}
