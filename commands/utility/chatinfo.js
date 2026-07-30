// commands/utility/chatinfo.js
// Perintah: /chatinfo
// Deskripsi   : Menampilkan informasi detail tentang grup saat ini.
// Permission  : Semua orang (grup)
// Contoh      : /chatinfo

import { buildMessage } from "../../utils/formatter.js";
import { escapeMarkdown } from "../../utils/markdown.js";
import { groupOnly } from "../../middleware/groupOnly.js";

export async function chatinfoCommand(ctx) {
  const chat = ctx.chat;
  let memberCount = "-";
  try {
    memberCount = await ctx.getChatMembersCount();
  } catch {
    /* ignore */
  }

  const body =
    `💬 *Informasi Grup*\n\n` +
    `Nama       : ${escapeMarkdown(chat.title || "-")}\n` +
    `Chat ID    : \`${chat.id}\`\n` +
    `Tipe       : ${escapeMarkdown(chat.type)}\n` +
    `Jumlah Member : *${memberCount}*`;

  return ctx.replyWithMarkdownV2(buildMessage(body));
}

export const chatinfoMiddlewares = [groupOnly()];
