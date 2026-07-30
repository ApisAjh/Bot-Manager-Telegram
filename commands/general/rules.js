// commands/general/rules.js
// Perintah: /rules [teks baru]
// Deskripsi   : Menampilkan peraturan grup, atau mengatur peraturan baru (khusus admin).
// Permission  : Semua orang (lihat) / Admin (atur)
// Contoh      : /rules
//               /rules Dilarang spam dan promosi tanpa izin admin.

import { getChatSettings, updateChatSettings } from "../../database/chatSettings.js";
import { buildMessage } from "../../utils/formatter.js";
import { escapeMarkdown } from "../../utils/markdown.js";
import { isChatAdmin, extractArgs } from "../../utils/permission.js";

export async function rulesCommand(ctx) {
  const args = extractArgs(ctx);
  const settings = await getChatSettings(ctx.chat.id, ctx.chat.title);

  if (args.length > 0) {
    const admin = await isChatAdmin(ctx);
    if (!admin) {
      return ctx.replyWithMarkdownV2(
        buildMessage("🚫 Hanya admin yang dapat mengubah peraturan grup\\.")
      );
    }
    const newRules = args.join(" ");
    await updateChatSettings(ctx.chat.id, { rules: newRules });
    return ctx.replyWithMarkdownV2(buildMessage("✅ Peraturan grup berhasil diperbarui\\."));
  }

  const body = settings.rules
    ? `📜 *Peraturan Grup*\n\n${escapeMarkdown(settings.rules)}`
    : `📜 *Peraturan Grup*\n\nBelum ada peraturan yang ditetapkan\\.\nAdmin dapat mengatur dengan:\n\`/rules <teks peraturan>\``;

  return ctx.replyWithMarkdownV2(buildMessage(body));
}
