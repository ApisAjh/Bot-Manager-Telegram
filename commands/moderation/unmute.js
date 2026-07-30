// commands/moderation/unmute.js
// Perintah: /unmute (reply ke user)
// Deskripsi   : Membuka bisu member agar bisa mengirim pesan kembali.
// Permission  : Admin grup
// Contoh      : Reply pesan user lalu ketik /unmute

import { buildMessage } from "../../utils/formatter.js";
import { mentionUser } from "../../utils/markdown.js";
import { extractTargetUser } from "../../utils/permission.js";
import { groupOnly } from "../../middleware/groupOnly.js";
import { adminOnly } from "../../middleware/adminCheck.js";

export async function unmuteCommand(ctx) {
  const target = extractTargetUser(ctx);
  if (!target) {
    return ctx.replyWithMarkdownV2(
      buildMessage("ℹ️ Cara pakai:\nReply pesan target lalu ketik `/unmute`\\.")
    );
  }

  try {
    await ctx.restrictChatMember(target.id, {
      permissions: {
        can_send_messages: true,
        can_send_photos: true,
        can_send_videos: true,
        can_send_other_messages: true,
        can_add_web_page_previews: true,
      },
    });
    await ctx.replyWithMarkdownV2(
      buildMessage(`🔊 ${mentionUser(target.id, target.first_name)} telah di\\-*unmute*\\.`)
    );
  } catch {
    await ctx.replyWithMarkdownV2(buildMessage("❌ Gagal meng\\-unmute member\\."));
  }
}

export const unmuteMiddlewares = [groupOnly(), adminOnly()];
