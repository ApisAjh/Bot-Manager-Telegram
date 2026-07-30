// commands/moderation/demote.js
// Perintah: /demote (reply ke user)
// Deskripsi   : Menurunkan admin kembali menjadi member biasa.
// Permission  : Admin grup (creator disarankan)
// Contoh      : Reply pesan user lalu ketik /demote

import { buildMessage } from "../../utils/formatter.js";
import { mentionUser } from "../../utils/markdown.js";
import { extractTargetUser } from "../../utils/permission.js";
import { groupOnly } from "../../middleware/groupOnly.js";
import { adminOnly } from "../../middleware/adminCheck.js";

export async function demoteCommand(ctx) {
  const target = extractTargetUser(ctx);
  if (!target) {
    return ctx.replyWithMarkdownV2(
      buildMessage("ℹ️ Cara pakai:\nReply pesan target lalu ketik `/demote`\\.")
    );
  }

  try {
    await ctx.promoteChatMember(target.id, {
      can_change_info: false,
      can_delete_messages: false,
      can_invite_users: false,
      can_restrict_members: false,
      can_pin_messages: false,
      can_promote_members: false,
    });
    await ctx.replyWithMarkdownV2(
      buildMessage(`⬇️ ${mentionUser(target.id, target.first_name)} telah diturunkan dari *admin*\\.`)
    );
  } catch {
    await ctx.replyWithMarkdownV2(buildMessage("❌ Gagal menurunkan admin\\."));
  }
}

export const demoteMiddlewares = [groupOnly(), adminOnly()];
