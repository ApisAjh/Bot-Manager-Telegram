// commands/utility/broadcast.js
// Perintah: /broadcast <pesan>
// Deskripsi   : Mengirim pesan ke seluruh user yang pernah berinteraksi dengan bot.
// Permission  : Owner bot
// Contoh      : /broadcast Bot akan maintenance pukul 22:00 WIB.

import { buildMessage } from "../../utils/formatter.js";
import { escapeMarkdown } from "../../utils/markdown.js";
import { getAllUserIds } from "../../database/users.js";
import { ownerOnly } from "../../middleware/ownerCheck.js";

export async function broadcastCommand(ctx) {
  const text = (ctx.message?.text || "").split(/\s+/).slice(1).join(" ").trim();
  if (!text) {
    return ctx.replyWithMarkdownV2(buildMessage("ℹ️ Cara pakai:\n`/broadcast <pesan>`"));
  }

  const userIds = await getAllUserIds();
  const body = `📢 *Pengumuman*\n\n${escapeMarkdown(text)}`;
  const message = buildMessage(body);

  let success = 0;
  let failed = 0;

  const status = await ctx.replyWithMarkdownV2(
    buildMessage(`📤 Mengirim broadcast ke *${userIds.length}* user\\.\\.\\.`)
  );

  for (const userId of userIds) {
    try {
      await ctx.telegram.sendMessage(userId, message, { parse_mode: "MarkdownV2" });
      success++;
    } catch {
      failed++;
    }
  }

  await ctx.telegram.editMessageText(
    ctx.chat.id,
    status.message_id,
    undefined,
    buildMessage(`✅ Broadcast selesai\\.\nBerhasil: *${success}*\nGagal: *${failed}*`),
    { parse_mode: "MarkdownV2" }
  );
}

export const broadcastMiddlewares = [ownerOnly()];
