// commands/general/settings.js
// Perintah: /settings
// Deskripsi   : Panel pengaturan grup interaktif (proteksi, welcome, logging).
// Permission  : Admin grup
// Contoh      : /settings

import { Markup } from "telegraf";
import { getChatSettings, toggleChatSetting } from "../../database/chatSettings.js";
import { buildMessage } from "../../utils/formatter.js";
import { isChatAdmin } from "../../utils/permission.js";
import { groupOnly } from "../../middleware/groupOnly.js";
import { adminOnly } from "../../middleware/adminCheck.js";

const FIELD_LABELS = {
  anti_link: "🔗 Anti Link",
  anti_spam: "📛 Anti Spam",
  anti_flood: "🌊 Anti Flood",
  anti_raid: "🚨 Anti Raid",
  anti_bot: "🤖 Anti Bot",
  anti_arabic: "🔤 Anti Arabic",
  anti_forward: "↪️ Anti Forward",
  anti_sticker_spam: "🃏 Anti Sticker Spam",
  anti_service_msg: "📩 Anti Service Message",
  welcome_enabled: "👋 Welcome Message",
  goodbye_enabled: "🚪 Goodbye Message",
  auto_delete_welcome: "🗑️ Auto Delete Welcome",
  captcha_enabled: "🔐 Captcha",
  log_join: "➕ Join Log",
  log_leave: "➖ Leave Log",
  log_ban: "🔨 Ban Log",
  log_delete: "🗑️ Delete Message Log",
  log_edit: "✏️ Edit Message Log",
};

const CATEGORY_FIELDS = {
  protection: [
    "anti_link",
    "anti_spam",
    "anti_flood",
    "anti_raid",
    "anti_bot",
    "anti_arabic",
    "anti_forward",
    "anti_sticker_spam",
    "anti_service_msg",
  ],
  welcome: ["welcome_enabled", "goodbye_enabled", "auto_delete_welcome", "captcha_enabled"],
  logging: ["log_join", "log_leave", "log_ban", "log_delete", "log_edit"],
};

function mainMenuKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("🚫 Protection", "cfgmenu:protection")],
    [Markup.button.callback("👋 Welcome System", "cfgmenu:welcome")],
    [Markup.button.callback("📊 Logging", "cfgmenu:logging")],
  ]);
}

function categoryKeyboard(category, settings) {
  const fields = CATEGORY_FIELDS[category];
  const rows = fields.map((field) => [
    Markup.button.callback(
      `${settings[field] ? "✅" : "❌"} ${FIELD_LABELS[field]}`,
      `cfg:${category}:${field}`
    ),
  ]);
  rows.push([Markup.button.callback("⬅️ Kembali", "cfgmenu:main")]);
  return Markup.inlineKeyboard(rows);
}

function categoryTitle(category) {
  return {
    protection: "🚫 *Pengaturan Protection*\n\nKlik untuk mengaktifkan/menonaktifkan fitur\\.",
    welcome: "👋 *Pengaturan Welcome System*\n\nKlik untuk mengaktifkan/menonaktifkan fitur\\.",
    logging: "📊 *Pengaturan Logging*\n\nKlik untuk mengaktifkan/menonaktifkan fitur\\.",
  }[category];
}

export async function settingsCommand(ctx) {
  const body = `⚙️ *Pengaturan Grup*\n\nPilih kategori pengaturan yang ingin dikonfigurasi:`;
  return ctx.replyWithMarkdownV2(buildMessage(body), mainMenuKeyboard());
}

export const settingsMiddlewares = [groupOnly(), adminOnly()];

export function registerSettingsActions(bot) {
  bot.action("menu:settings", async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    if (ctx.chat?.type === "private") {
      return ctx.editMessageText(
        buildMessage("⚠️ Buka perintah ini di dalam grup untuk mengatur pengaturan\\."),
        { parse_mode: "MarkdownV2" }
      ).catch(() => {});
    }
    const admin = await isChatAdmin(ctx);
    if (!admin) {
      return ctx.answerCbQuery("Khusus admin grup.", { show_alert: true }).catch(() => {});
    }
    const body = `⚙️ *Pengaturan Grup*\n\nPilih kategori pengaturan yang ingin dikonfigurasi:`;
    await ctx
      .editMessageText(buildMessage(body), { parse_mode: "MarkdownV2", ...mainMenuKeyboard() })
      .catch(() => ctx.replyWithMarkdownV2(buildMessage(body), mainMenuKeyboard()));
  });

  bot.action("cfgmenu:main", async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    const body = `⚙️ *Pengaturan Grup*\n\nPilih kategori pengaturan yang ingin dikonfigurasi:`;
    await ctx.editMessageText(buildMessage(body), {
      parse_mode: "MarkdownV2",
      ...mainMenuKeyboard(),
    }).catch(() => {});
  });

  for (const category of Object.keys(CATEGORY_FIELDS)) {
    bot.action(`cfgmenu:${category}`, async (ctx) => {
      await ctx.answerCbQuery().catch(() => {});
      const admin = await isChatAdmin(ctx);
      if (!admin) return ctx.answerCbQuery("Khusus admin grup.", { show_alert: true }).catch(() => {});

      const settings = await getChatSettings(ctx.chat.id, ctx.chat.title);
      await ctx
        .editMessageText(buildMessage(categoryTitle(category)), {
          parse_mode: "MarkdownV2",
          ...categoryKeyboard(category, settings),
        })
        .catch(() => {});
    });
  }

  bot.action(/^cfg:(protection|welcome|logging):(\w+)$/, async (ctx) => {
    const [, category, field] = ctx.match;
    const admin = await isChatAdmin(ctx);
    if (!admin) return ctx.answerCbQuery("Khusus admin grup.", { show_alert: true }).catch(() => {});

    const newValue = await toggleChatSetting(ctx.chat.id, field);
    await ctx
      .answerCbQuery(`${FIELD_LABELS[field]}: ${newValue ? "Diaktifkan ✅" : "Dinonaktifkan ❌"}`)
      .catch(() => {});

    const settings = await getChatSettings(ctx.chat.id, ctx.chat.title);
    await ctx
      .editMessageText(buildMessage(categoryTitle(category)), {
        parse_mode: "MarkdownV2",
        ...categoryKeyboard(category, settings),
      })
      .catch(() => {});
  });
}
