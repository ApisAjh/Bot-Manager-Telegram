// commands/utility/userinfo.js
// Perintah: /userinfo (reply ke user, opsional)
// Deskripsi   : Menampilkan informasi detail tentang seorang user.
// Permission  : Semua orang
// Contoh      : /userinfo
//               Reply pesan user lalu ketik /userinfo

import { buildMessage } from "../../utils/formatter.js";
import { escapeMarkdown, mentionUser } from "../../utils/markdown.js";
import { extractTargetUser, getChatMemberStatus } from "../../utils/permission.js";

export async function userinfoCommand(ctx) {
  const target = extractTargetUser(ctx) || ctx.from;
  const status = ctx.chat?.type !== "private" ? await getChatMemberStatus(ctx, target.id) : "-";

  const body =
    `👤 *Informasi User*\n\n` +
    `Nama       : ${mentionUser(target.id, target.first_name)}\n` +
    `Username   : ${target.username ? "@" + escapeMarkdown(target.username) : "\\-"}\n` +
    `User ID    : \`${target.id}\`\n` +
    `Status     : ${escapeMarkdown(status || "-")}\n` +
    `Bot        : ${target.is_bot ? "Ya" : "Tidak"}`;

  return ctx.replyWithMarkdownV2(buildMessage(body));
}
