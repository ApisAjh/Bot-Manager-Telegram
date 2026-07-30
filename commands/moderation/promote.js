// commands/moderation/promote.js
// Perintah: /promote (reply ke user)
// Deskripsi   : Menjadikan member sebagai admin dengan izin standar moderasi.
// Permission  : Admin grup (creator disarankan)
// Contoh      : Reply pesan user lalu ketik /promote

import { buildMessage } from "../../utils/formatter.js";
import { mentionUser } from "../../utils/markdown.js";
import { extractTargetUser } from "../../utils/permission.js";
import { groupOnly } from "../../middleware/groupOnly.js";
import { adminOnly } from "../../middleware/adminCheck.js";

export async function promoteCommand(ctx) {
  const target = extractTargetUser(ctx);
  if (!target) {
    return ctx.replyWithMarkdownV2(
      buildMessage("ℹ️ Cara pakai:\nReply pesan target lalu ketik `/promote`\\.")
    );
  }

  try {
    await ctx.promoteChatMember(target.id, {
      can_change_info: false,
      can_delete_messages: true,
      can_invite_users: true,
      can_restrict_members: true,
      can_pin_messages: true,
      can_promote_members: false,
    });
    await ctx.replyWithMarkdownV2(
      buildMessage(`⬆️ ${mentionUser(target.id, target.first_name)} telah dipromosikan menjadi *admin*\\.`)
    );
  } catch {
    await ctx.replyWithMarkdownV2(buildMessage("❌ Gagal mempromosikan member\\."));
  }
}

export const promoteMiddlewares = [groupOnly(), adminOnly()];
