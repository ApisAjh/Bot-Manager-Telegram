// middleware/antiFlood.js
// Mendeteksi user yang mengirim pesan terlalu cepat/beruntun (flood) lalu mem-mute sementara.

import { getChatSettings } from "../database/chatSettings.js";
import { isChatAdmin } from "../utils/permission.js";
import { FLOOD_LIMIT, FLOOD_INTERVAL_MS } from "../config.js";
import { buildMessage } from "../utils/formatter.js";
import { mentionUser } from "../utils/markdown.js";

const floodTracker = new Map(); // key: `${chatId}:${userId}` -> { count, first }

export function antiFlood() {
  return async (ctx, next) => {
    if (ctx.chat?.type === "private" || !ctx.message) return next();

    const settings = await getChatSettings(ctx.chat.id, ctx.chat.title);
    if (!settings.anti_flood) return next();

    const admin = await isChatAdmin(ctx);
    if (admin) return next();

    const key = `${ctx.chat.id}:${ctx.from.id}`;
    const now = Date.now();
    const entry = floodTracker.get(key) || { count: 0, first: now };

    if (now - entry.first > FLOOD_INTERVAL_MS) {
      entry.count = 1;
      entry.first = now;
    } else {
      entry.count += 1;
    }
    floodTracker.set(key, entry);

    if (entry.count > FLOOD_LIMIT) {
      floodTracker.delete(key);
      try {
        await ctx.restrictChatMember(ctx.from.id, {
          permissions: { can_send_messages: false },
          until_date: Math.floor(Date.now() / 1000) + 300, // mute 5 menit
        });
        await ctx.replyWithMarkdownV2(
          buildMessage(
            `🌊 ${mentionUser(ctx.from.id, ctx.from.first_name)} terdeteksi *flooding* dan telah di\\-mute selama 5 menit\\.`
          )
        );
      } catch {
        // biarkan berlalu jika bot tidak punya izin restrict
      }
      return;
    }
    return next();
  };
}
