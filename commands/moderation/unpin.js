// commands/moderation/unpin.js
// Perintah: /unpin
// Deskripsi   : Melepas pin dari pesan yang sedang disematkan.
// Permission  : Admin grup
// Contoh      : /unpin

import { buildMessage } from "../../utils/formatter.js";
import { groupOnly } from "../../middleware/groupOnly.js";
import { adminOnly } from "../../middleware/adminCheck.js";

export async function unpinCommand(ctx) {
  try {
    await ctx.unpinChatMessage();
    await ctx.replyWithMarkdownV2(buildMessage("📌 Pesan berhasil di\\-*unpin*\\."));
  } catch {
    await ctx.replyWithMarkdownV2(buildMessage("❌ Gagal meng\\-unpin pesan\\."));
  }
}

export const unpinMiddlewares = [groupOnly(), adminOnly()];
