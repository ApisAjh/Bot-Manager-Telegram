// handlers/messageHandler.js
// Registrasi seluruh middleware proteksi pesan + logging edit/delete + cache user.

import { antiLink } from "../middleware/antiLink.js";
import { antiSpam } from "../middleware/antiSpam.js";
import { antiArabic } from "../middleware/antiArabic.js";
import { antiForward } from "../middleware/antiForward.js";
import { antiBot } from "../middleware/antiBot.js";
import { antiServiceMessage } from "../middleware/antiServiceMessage.js";
import { antiStickerSpam } from "../middleware/antiStickerSpam.js";
import { antiFlood } from "../middleware/antiFlood.js";
import { upsertUser } from "../database/users.js";
import { getChatSettings } from "../database/chatSettings.js";
import { sendLog } from "../utils/logger.js";
import { buildMessage } from "../utils/formatter.js";
import { escapeMarkdown } from "../utils/markdown.js";

export function registerMessageHandler(bot) {
  // Cache setiap user yang aktif (untuk statistik & broadcast)
  bot.use(async (ctx, next) => {
    if (ctx.from) await upsertUser(ctx.from).catch(() => {});
    return next();
  });

  // Pipeline proteksi grup, urut dari yang paling murah ke paling mahal
  bot.use(antiServiceMessage());
  bot.use(antiBot());
  bot.use(antiForward());
  bot.use(antiLink());
  bot.use(antiSpam());
  bot.use(antiArabic());
  bot.use(antiStickerSpam());
  bot.use(antiFlood());

  // Log pesan yang diedit
  bot.on("edited_message", async (ctx) => {
    const chat = ctx.chat;
    if (chat.type === "private") return;
    const settings = await getChatSettings(chat.id, chat.title);
    if (!settings.log_edit || !settings.log_channel_id) return;

    const user = ctx.editedMessage.from;
    await sendLog(
      bot.telegram,
      settings.log_channel_id,
      buildMessage(
        `✏️ *Pesan Diedit*\nUser: ${escapeMarkdown(user.first_name)}\nID: \`${user.id}\`\nChat: ${escapeMarkdown(chat.title)}`
      )
    );
  });
}
