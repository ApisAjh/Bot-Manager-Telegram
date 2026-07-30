// commands/moderation/mute.js
// Perintah: /mute (reply ke user) [durasi menit]
// Deskripsi   : Membisukan member agar tidak bisa mengirim pesan.
// Permission  : Admin grup
// Contoh      : Reply pesan user lalu ketik /mute 30

import { buildMessage } from "../../utils/formatter.js";
import { mentionUser } from "../../utils/markdown.js";
import { extractTargetUser, extractArgs } from "../../utils/permission.js";
import { groupOnly } from "../../middleware/groupOnly.js";
import { adminOnly } from "../../middleware/adminCheck.js";

export async function muteCommand(ctx) {
  const target = extractTargetUser(ctx);
  const args = extractArgs(ctx);

  if (!target) {
    return ctx.replyWithMarkdownV2(
      buildMessage("ℹ️ Cara pakai:\nReply pesan target lalu ketik `/mute [durasi_menit]`\\.")
    );
  }

  const minutes = Number(args[0]);
  const untilDate =
    minutes && !Number.isNaN(minutes) ? Math.floor(Date.now() / 1000) + minutes * 60 : undefined;

  try {
    await ctx.restrictChatMember(target.id, {
      permissions: { can_send_messages: false },
      until_date: untilDate,
    });

    const durasi = untilDate ? `selama *${minutes} menit*` : "*permanen*";
    await ctx.replyWithMarkdownV2(
      buildMessage(`🔇 ${mentionUser(target.id, target.first_name)} telah di\\-*mute* ${durasi}\\.`)
    );
  } catch {
    await ctx.replyWithMarkdownV2(buildMessage("❌ Gagal mem\\-mute member\\."));
  }
}

export const muteMiddlewares = [groupOnly(), adminOnly()];
