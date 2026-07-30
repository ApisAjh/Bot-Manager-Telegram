// middleware/antiForward.js
// Menghapus pesan forward dari luar grup jika anti_forward diaktifkan.

import { getChatSettings } from "../database/chatSettings.js";
import { isChatAdmin } from "../utils/permission.js";

export function antiForward() {
  return async (ctx, next) => {
    if (ctx.chat?.type === "private") return next();
    const isForwarded = !!(ctx.message?.forward_date || ctx.message?.forward_origin);
    if (!isForwarded) return next();

    const settings = await getChatSettings(ctx.chat.id, ctx.chat.title);
    if (!settings.anti_forward) return next();

    const admin = await isChatAdmin(ctx);
    if (!admin) {
      await ctx.deleteMessage().catch(() => {});
      return;
    }
    return next();
  };
}
