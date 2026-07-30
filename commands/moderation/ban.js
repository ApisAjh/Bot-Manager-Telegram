// commands/moderation/ban.js
// Perintah: /ban (reply ke user, atau /ban <user_id>)
// Deskripsi   : Mem-ban member dari grup secara permanen.
// Permission  : Admin grup
// Contoh      : Reply pesan user lalu ketik /ban
//               /ban 123456789

import { buildMessage } from "../../utils/formatter.js";
import { mentionUser } from "../../utils/markdown.js";
import { extractTargetUser, extractArgs } from "../../utils/permission.js";
import { getChatSettings } from "../../database/chatSettings.js";
import { sendLog } from "../../utils/logger.js";
import { groupOnly } from "../../middleware/groupOnly.js";
import { adminOnly } from "../../middleware/adminCheck.js";

export async function banCommand(ctx) {
  const target = extractTargetUser(ctx);
  const args = extractArgs(ctx);
  const targetId = target?.id || Number(args[0]);

  if (!targetId || Number.isNaN(targetId)) {
    return ctx.replyWithMarkdownV2(
      buildMessage("ℹ️ Cara pakai:\nReply pesan target lalu ketik `/ban`, atau `/ban <user_id>`\\.")
    );
  }

  try {
    await ctx.banChatMember(targetId);
    const name = target?.first_name || String(targetId);
    await ctx.replyWithMarkdownV2(
      buildMessage(`🔨 ${mentionUser(targetId, name)} telah di\\-*ban* dari grup\\.`)
    );

    const settings = await getChatSettings(ctx.chat.id, ctx.chat.title);
    if (settings.log_ban && settings.log_channel_id) {
      await sendLog(
        ctx.telegram,
        settings.log_channel_id,
        buildMessage(`🔨 *Ban*\nUser: ${mentionUser(targetId, name)}\nOleh: ${mentionUser(ctx.from.id, ctx.from.first_name)}`)
      );
    }
  } catch (err) {
    await ctx.replyWithMarkdownV2(
      buildMessage("❌ Gagal mem\\-ban member\\. Pastikan bot memiliki izin admin yang cukup\\.")
    );
  }
}

export const banMiddlewares = [groupOnly(), adminOnly()];
