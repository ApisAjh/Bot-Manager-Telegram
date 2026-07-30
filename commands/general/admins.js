// commands/general/admins.js
// Perintah: /admins
// Deskripsi   : Menampilkan daftar administrator grup saat ini.
// Permission  : Semua orang
// Contoh      : /admins

import { buildMessage } from "../../utils/formatter.js";
import { mentionUser } from "../../utils/markdown.js";
import { groupOnly } from "../../middleware/groupOnly.js";

export async function adminsCommand(ctx) {
  try {
    const admins = await ctx.getChatAdministrators();
    if (!admins.length) {
      return ctx.replyWithMarkdownV2(buildMessage("Tidak ada data admin yang ditemukan\\."));
    }

    const list = admins
      .map((a, i) => {
        const role = a.status === "creator" ? "👑 Creator" : "👮 Admin";
        return `${i + 1}\\. ${mentionUser(a.user.id, a.user.first_name)} \\(${role}\\)`;
      })
      .join("\n");

    return ctx.replyWithMarkdownV2(buildMessage(`👮 *Daftar Admin Grup*\n\n${list}`));
  } catch {
    return ctx.replyWithMarkdownV2(buildMessage("❌ Gagal mengambil daftar admin\\."));
  }
}

export const adminsMiddlewares = [groupOnly()];
