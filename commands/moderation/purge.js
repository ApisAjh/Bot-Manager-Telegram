// commands/moderation/purge.js
// Perintah: /purge (reply ke pesan awal yang akan dihapus)
// Deskripsi   : Menghapus pesan secara massal dari pesan yang di-reply hingga pesan /purge.
// Permission  : Admin grup
// Contoh      : Reply pesan pertama yang ingin dihapus lalu ketik /purge

import { buildMessage } from "../../utils/formatter.js";
import { groupOnly } from "../../middleware/groupOnly.js";
import { adminOnly } from "../../middleware/adminCheck.js";

export async function purgeCommand(ctx) {
  const replyMsg = ctx.message.reply_to_message;
  if (!replyMsg) {
    return ctx.replyWithMarkdownV2(
      buildMessage("ℹ️ Reply pesan awal yang ingin dihapus, lalu ketik `/purge`\\.")
    );
  }

  const fromId = replyMsg.message_id;
  const toId = ctx.message.message_id;
  const ids = [];
  for (let id = fromId; id <= toId; id++) ids.push(id);

  let deleted = 0;
  for (const id of ids) {
    try {
      await ctx.deleteMessage(id);
      deleted++;
    } catch {
      // pesan sudah terhapus/terlalu lama, lewati
    }
  }

  const info = await ctx.replyWithMarkdownV2(
    buildMessage(`🧹 Berhasil menghapus *${deleted}* pesan\\.`)
  );
  setTimeout(() => ctx.deleteMessage(info.message_id).catch(() => {}), 5000);
}

export const purgeMiddlewares = [groupOnly(), adminOnly()];
