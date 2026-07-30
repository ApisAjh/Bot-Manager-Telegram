// commands/moderation/warn.js
// Perintah: /warn (reply ke user)
// Deskripsi   : Memberi peringatan ke member. Otomatis banned jika mencapai batas maksimal.
// Permission  : Admin grup
// Contoh      : Reply pesan user lalu ketik /warn

import { buildMessage } from "../../utils/formatter.js";
import { mentionUser } from "../../utils/markdown.js";
import { extractTargetUser } from "../../utils/permission.js";
import { addWarn, resetWarn } from "../../database/warnings.js";
import { MAX_WARN } from "../../config.js";
import { groupOnly } from "../../middleware/groupOnly.js";
import { adminOnly } from "../../middleware/adminCheck.js";

export async function warnCommand(ctx) {
  const target = extractTargetUser(ctx);
  if (!target) {
    return ctx.replyWithMarkdownV2(
      buildMessage("ℹ️ Cara pakai:\nReply pesan target lalu ketik `/warn`\\.")
    );
  }

  const count = await addWarn(ctx.chat.id, target.id);

  if (count >= MAX_WARN) {
    try {
      await ctx.banChatMember(target.id);
      await resetWarn(ctx.chat.id, target.id);
      return ctx.replyWithMarkdownV2(
        buildMessage(
          `🔨 ${mentionUser(target.id, target.first_name)} telah mencapai batas ${MAX_WARN} peringatan dan otomatis di\\-*ban*\\.`
        )
      );
    } catch {
      return ctx.replyWithMarkdownV2(buildMessage("❌ Gagal mem\\-ban member setelah batas warn tercapai\\."));
    }
  }

  return ctx.replyWithMarkdownV2(
    buildMessage(
      `⚠️ ${mentionUser(target.id, target.first_name)} mendapat peringatan\\.\nTotal: *${count}/${MAX_WARN}*`
    )
  );
}

export const warnMiddlewares = [groupOnly(), adminOnly()];
