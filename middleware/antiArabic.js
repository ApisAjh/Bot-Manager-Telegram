// middleware/antiArabic.js
// Menghapus pesan berbahasa Arab jika anti_arabic diaktifkan (opsional, umum untuk anti-spam judi/iklan).

import { getChatSettings } from "../database/chatSettings.js";
import { isChatAdmin } from "../utils/permission.js";

const ARABIC_REGEX = /[\u0600-\u06FF]/;

export function antiArabic() {
  return async (ctx, next) => {
    const text = ctx.message?.text || ctx.message?.caption || "";
    if (ctx.chat?.type === "private" || !text) return next();

    const settings = await getChatSettings(ctx.chat.id, ctx.chat.title);
    if (!settings.anti_arabic) return next();

    if (ARABIC_REGEX.test(text)) {
      const admin = await isChatAdmin(ctx);
      if (!admin) {
        await ctx.deleteMessage().catch(() => {});
        return;
      }
    }
    return next();
  };
}
