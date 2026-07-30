// commands/general/help.js
// Perintah: /help
// Deskripsi   : Menampilkan daftar seluruh kategori & perintah yang tersedia.
// Permission  : Semua orang
// Contoh      : /help

import { Markup } from "telegraf";
import { buildMessage } from "../../utils/formatter.js";

const CATEGORIES = {
  general:
    `📖 *GENERAL*\n` +
    `• /start \\- Tampilkan menu utama\n` +
    `• /help \\- Tampilkan bantuan ini\n` +
    `• /about \\- Info tentang bot\n` +
    `• /ping \\- Cek kecepatan respon bot\n` +
    `• /settings \\- Pengaturan grup \\(admin\\)\n` +
    `• /rules \\- Lihat/atur peraturan grup\n` +
    `• /admins \\- Daftar admin grup`,

  moderation:
    `🛡️ *MODERATION*\n` +
    `• /ban \\- Ban member \\(reply/username\\)\n` +
    `• /unban \\- Unban member\n` +
    `• /kick \\- Keluarkan member\n` +
    `• /mute \\- Bisukan member\n` +
    `• /unmute \\- Buka bisu member\n` +
    `• /warn \\- Beri peringatan\n` +
    `• /unwarn \\- Kurangi peringatan\n` +
    `• /resetwarn \\- Reset peringatan\n` +
    `• /purge \\- Hapus pesan massal\n` +
    `• /pin \\- Pin pesan\n` +
    `• /unpin \\- Unpin pesan\n` +
    `• /promote \\- Jadikan admin\n` +
    `• /demote \\- Turunkan admin`,

  protection:
    `🚫 *PROTECTION*\n` +
    `Diatur lewat /settings, meliputi:\n` +
    `Anti Link, Anti Spam, Anti Flood, Anti Raid, Anti Bot,\n` +
    `Anti Arabic, Anti Forward, Anti Sticker Spam, Anti Service Message`,

  welcome:
    `👋 *WELCOME SYSTEM*\n` +
    `Diatur lewat /settings, meliputi:\n` +
    `Welcome Message, Goodbye Message, Custom Welcome,\n` +
    `Auto Delete Welcome, Captcha \\(opsional\\)`,

  logging:
    `📊 *LOGGING*\n` +
    `Diatur lewat /settings, meliputi:\n` +
    `Join Log, Leave Log, Ban Log, Delete Message Log, Edit Message Log`,

  utility:
    `🧰 *UTILITY*\n` +
    `• /poll \\- Buat polling\n` +
    `• /userinfo \\- Info user\n` +
    `• /chatinfo \\- Info grup\n` +
    `• /admins \\- Daftar admin\n` +
    `• /broadcast \\- Kirim pesan ke semua user \\(owner\\)\n` +
    `• /stats \\- Statistik bot\n` +
    `• /uptime \\- Lama bot aktif`,
};

function keyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("📖 General", "help:general"),
      Markup.button.callback("🛡️ Moderation", "help:moderation"),
    ],
    [
      Markup.button.callback("🚫 Protection", "help:protection"),
      Markup.button.callback("👋 Welcome", "help:welcome"),
    ],
    [
      Markup.button.callback("📊 Logging", "help:logging"),
      Markup.button.callback("🧰 Utility", "help:utility"),
    ],
  ]);
}

export function helpCommand(ctx) {
  const body =
    `📚 *Daftar Perintah*\n\nPilih kategori di bawah ini untuk melihat detail perintah yang tersedia\\.`;
  return ctx.replyWithMarkdownV2(buildMessage(body), keyboard());
}

export function registerHelpActions(bot) {
  for (const key of Object.keys(CATEGORIES)) {
    bot.action(`help:${key}`, async (ctx) => {
      await ctx.answerCbQuery().catch(() => {});
      await ctx.editMessageText(buildMessage(CATEGORIES[key]), {
        parse_mode: "MarkdownV2",
        ...keyboard(),
      }).catch(() => ctx.replyWithMarkdownV2(buildMessage(CATEGORIES[key]), keyboard()));
    });
  }

  bot.action("menu:help", async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    const body = `📚 *Daftar Perintah*\n\nPilih kategori di bawah ini untuk melihat detail perintah yang tersedia\\.`;
    await ctx.editMessageText(buildMessage(body), {
      parse_mode: "MarkdownV2",
      ...keyboard(),
    }).catch(() => ctx.replyWithMarkdownV2(buildMessage(body), keyboard()));
  });
}
