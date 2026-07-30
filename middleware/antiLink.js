// middleware/antiLink.js
// Menghapus pesan yang mengandung tautan/link jika anti_link aktif dan pengirim bukan admin.

import { getChatSettings } from "../database/chatSettings.js";
import { isChatAdmin } from "../utils/permission.js";

const LINK_REGEX = /(https?:\/\/|www\.|t\.me\/|telegram\.me\/)\S+/i;

export function antiLink() {
  return async (ctx, next) => {
    const text = ctx.message?.text || ctx.message?.caption || "";
    if (ctx.chat?.type === "private" || !text) return next();

    const settings = await getChatSettings(ctx.chat.id, ctx.chat.title);
    if (!settings.anti_link) return next();

    if (LINK_REGEX.test(text)) {
      const admin = await isChatAdmin(ctx);
      if (!admin) {
        await ctx.deleteMessage().catch(() => {});
        return; // hentikan pipeline, jangan lanjut ke next()
      }
    }
    return next();
  };
}
