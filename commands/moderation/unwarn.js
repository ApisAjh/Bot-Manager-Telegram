// commands/moderation/unwarn.js
// Perintah: /unwarn (reply ke user)
// Deskripsi   : Mengurangi satu peringatan dari member.
// Permission  : Admin grup
// Contoh      : Reply pesan user lalu ketik /unwarn

import { buildMessage } from "../../utils/formatter.js";
import { mentionUser } from "../../utils/markdown.js";
import { extractTargetUser } from "../../utils/permission.js";
import { removeWarn } from "../../database/warnings.js";
import { MAX_WARN } from "../../config.js";
import { groupOnly } from "../../middleware/groupOnly.js";
import { adminOnly } from "../../middleware/adminCheck.js";

export async function unwarnCommand(ctx) {
  const target = extractTargetUser(ctx);
  if (!target) {
    return ctx.replyWithMarkdownV2(
      buildMessage("ℹ️ Cara pakai:\nReply pesan target lalu ketik `/unwarn`\\.")
    );
  }

  const count = await removeWarn(ctx.chat.id, target.id);
  return ctx.replyWithMarkdownV2(
    buildMessage(
      `✅ Satu peringatan untuk ${mentionUser(target.id, target.first_name)} telah dihapus\\.\nTotal: *${count}/${MAX_WARN}*`
    )
  );
}

export const unwarnMiddlewares = [groupOnly(), adminOnly()];
