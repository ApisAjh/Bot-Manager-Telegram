// commands/moderation/unban.js
// Perintah: /unban <user_id>
// Deskripsi   : Membuka ban member sehingga dapat bergabung kembali.
// Permission  : Admin grup
// Contoh      : /unban 123456789

import { buildMessage } from "../../utils/formatter.js";
import { mentionUser } from "../../utils/markdown.js";
import { extractArgs, extractTargetUser } from "../../utils/permission.js";
import { groupOnly } from "../../middleware/groupOnly.js";
import { adminOnly } from "../../middleware/adminCheck.js";

export async function unbanCommand(ctx) {
  const target = extractTargetUser(ctx);
  const args = extractArgs(ctx);
  const targetId = target?.id || Number(args[0]);

  if (!targetId || Number.isNaN(targetId)) {
    return ctx.replyWithMarkdownV2(
      buildMessage("ℹ️ Cara pakai: `/unban <user_id>`\\.")
    );
  }

  try {
    await ctx.unbanChatMember(targetId, { only_if_banned: true });
    await ctx.replyWithMarkdownV2(
      buildMessage(`✅ ${mentionUser(targetId, target?.first_name || String(targetId))} telah di\\-*unban*\\.`)
    );
  } catch {
    await ctx.replyWithMarkdownV2(buildMessage("❌ Gagal meng\\-unban member\\."));
  }
}

export const unbanMiddlewares = [groupOnly(), adminOnly()];
