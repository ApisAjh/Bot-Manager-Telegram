// commands/moderation/resetwarn.js
// Perintah: /resetwarn (reply ke user)
// Deskripsi   : Mereset seluruh peringatan member menjadi nol.
// Permission  : Admin grup
// Contoh      : Reply pesan user lalu ketik /resetwarn

import { buildMessage } from "../../utils/formatter.js";
import { mentionUser } from "../../utils/markdown.js";
import { extractTargetUser } from "../../utils/permission.js";
import { resetWarn } from "../../database/warnings.js";
import { groupOnly } from "../../middleware/groupOnly.js";
import { adminOnly } from "../../middleware/adminCheck.js";

export async function resetwarnCommand(ctx) {
  const target = extractTargetUser(ctx);
  if (!target) {
    return ctx.replyWithMarkdownV2(
      buildMessage("ℹ️ Cara pakai:\nReply pesan target lalu ketik `/resetwarn`\\.")
    );
  }

  await resetWarn(ctx.chat.id, target.id);
  return ctx.replyWithMarkdownV2(
    buildMessage(`♻️ Seluruh peringatan untuk ${mentionUser(target.id, target.first_name)} telah direset\\.`)
  );
}

export const resetwarnMiddlewares = [groupOnly(), adminOnly()];
