// commands/general/about.js
// Perintah: /about
// Deskripsi   : Menampilkan informasi tentang bot.
// Permission  : Semua orang
// Contoh      : /about

import { BOT_NAME, DEVELOPER_NAME } from "../../config.js";
import { buildMessage } from "../../utils/formatter.js";
import { escapeMarkdown } from "../../utils/markdown.js";

export function aboutCommand(ctx) {
  const body =
    `ℹ️ *Tentang Bot*\n\n` +
    `Nama Bot   : *${escapeMarkdown(BOT_NAME)}*\n` +
    `Developer  : *${escapeMarkdown(DEVELOPER_NAME)}*\n` +
    `Framework  : Telegraf \\(Node\\.js ES Module\\)\n` +
    `Database   : SQLite\n\n` +
    `${escapeMarkdown(BOT_NAME)} dibuat untuk membantu pemilik dan admin grup mengelola komunitas secara aman, rapi, dan efisien dengan fitur moderasi, proteksi otomatis, serta sistem sambutan yang dapat dikustomisasi\\.`;

  return ctx.replyWithMarkdownV2(buildMessage(body));
}
