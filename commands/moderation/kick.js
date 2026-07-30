// commands/moderation/kick.js
// Perintah: /kick (reply ke user)
// Deskripsi   : Mengeluarkan member dari grup (masih bisa bergabung kembali).
// Permission  : Admin grup
// Contoh      : Reply pesan user lalu ketik /kick

import { buildMessage } from "../../utils/formatter.js";
import { mentionUser } from "../../utils/markdown.js";
import { extractTargetUser, extractArgs } from "../../utils/permission.js";
import { groupOnly } from "../../middleware/groupOnly.js";
import { adminOnly } from "../../middleware/adminCheck.js";

export async function kickCommand(ctx) {
  const target = extractTargetUser(ctx);
  const args = extractArgs(ctx);
  const targetId = target?.id || Number(args[0]);

  if (!targetId || Number.isNaN(targetId)) {
    return ctx.replyWithMarkdownV2(
      buildMessage("ℹ️ Cara pakai:\nReply pesan target lalu ketik `/kick`, atau `/kick <user_id>`\\.")
    );
  }

  try {
    await ctx.banChatMember(targetId);
    await ctx.unbanChatMember(targetId);
    await ctx.replyWithMarkdownV2(
      buildMessage(`👢 ${mentionUser(targetId, target?.first_name || String(targetId))} telah dikeluarkan dari grup\\.`)
    );
  } catch {
    await ctx.replyWithMarkdownV2(buildMessage("❌ Gagal mengeluarkan member\\."));
  }
}

export const kickMiddlewares = [groupOnly(), adminOnly()];
