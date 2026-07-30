// middleware/antiBot.js
// Menendang bot lain yang baru bergabung jika anti_bot diaktifkan (dicek di memberHandler),
// dan mencegah bot lain mengirim pesan di grup yang mengaktifkan anti_bot.

import { getChatSettings } from "../database/chatSettings.js";

export function antiBot() {
  return async (ctx, next) => {
    if (ctx.chat?.type === "private") return next();
    if (!ctx.from?.is_bot) return next();

    const settings = await getChatSettings(ctx.chat.id, ctx.chat.title);
    if (!settings.anti_bot) return next();

    // Bot lain (bukan Apis Group Manager sendiri) yang mengirim pesan -> hapus & keluarkan.
    const me = await ctx.telegram.getMe();
    if (ctx.from.id === me.id) return next();

    await ctx.deleteMessage().catch(() => {});
    await ctx.banChatMember(ctx.from.id).catch(() => {});
    return;
  };
}
