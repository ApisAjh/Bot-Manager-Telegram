// commands/general/start.js
// Perintah: /start
// Deskripsi   : Menampilkan pesan sambutan utama bot beserta menu inline.
// Permission  : Semua orang
// Contoh      : /start

import { Markup } from "telegraf";
import { BOT_NAME } from "../../config.js";
import { buildMessage } from "../../utils/formatter.js";
import { escapeMarkdown } from "../../utils/markdown.js";

export function startCommand(ctx) {
  const name = escapeMarkdown(BOT_NAME);

  const body =
    `👋 Halo, selamat datang\\!\n\n` +
    `Aku adalah *${name}*, bot manajemen grup modern yang siap membantu menjaga grup tetap aman, rapi, dan nyaman\\.\n\n` +
    `✨ *Fitur utama:*\n` +
    `• 🛡️ Moderasi Lengkap\n` +
    `• 🚫 Anti Spam & Anti Link\n` +
    `• 👋 Welcome & Goodbye Message\n` +
    `• ⚙️ Pengaturan Grup\n` +
    `• 📊 Logging Aktivitas\n` +
    `• 👮 Manajemen Admin\n` +
    `• ⚡ Cepat & Stabil\n\n` +
    `📚 Gunakan /help untuk melihat seluruh daftar perintah yang tersedia\\.\n\n` +
    `Terima kasih telah menggunakan *${name}*\\.\n` +
    `Semoga komunitasmu semakin aman dan nyaman\\! 🚀`;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.url("➕ Add to Group", `https://t.me/${ctx.botInfo?.username}?startgroup=true`)],
    [
      Markup.button.callback("📚 Help", "menu:help"),
      Markup.button.callback("⚙️ Settings", "menu:settings"),
    ],
  ]);

  return ctx.replyWithMarkdownV2(buildMessage(body), keyboard);
}
