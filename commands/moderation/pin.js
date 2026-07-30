// commands/moderation/pin.js
// Perintah: /pin [silent] (reply ke pesan)
// Deskripsi   : Menyematkan (pin) pesan pada grup. Tambahkan "silent" agar tanpa notifikasi.
// Permission  : Admin grup
// Contoh      : Reply pesan lalu ketik /pin
//               Reply pesan lalu ketik /pin silent

import { buildMessage } from "../../utils/formatter.js";
import { extractArgs } from "../../utils/permission.js";
import { groupOnly } from "../../middleware/groupOnly.js";
import { adminOnly } from "../../middleware/adminCheck.js";

export async function pinCommand(ctx) {
  const replyMsg = ctx.message.reply_to_message;
  if (!replyMsg) {
    return ctx.replyWithMarkdownV2(buildMessage("ℹ️ Reply pesan yang ingin di\\-pin, lalu ketik `/pin`\\."));
  }

  const args = extractArgs(ctx);
  const silent = args[0]?.toLowerCase() === "silent";

  try {
    await ctx.pinChatMessage(replyMsg.message_id, { disable_notification: silent });
    await ctx.replyWithMarkdownV2(buildMessage("📌 Pesan berhasil di\\-*pin*\\."));
  } catch {
    await ctx.replyWithMarkdownV2(buildMessage("❌ Gagal mem\\-pin pesan\\."));
  }
}

export const pinMiddlewares = [groupOnly(), adminOnly()];
