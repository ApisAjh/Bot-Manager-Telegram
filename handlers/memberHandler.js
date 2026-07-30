// handlers/memberHandler.js
// Menangani event member baru (welcome, anti-raid, anti-bot) & member keluar (goodbye, log).

import { getChatSettings } from "../database/chatSettings.js";
import { buildMessage } from "../utils/formatter.js";
import { mentionUser, escapeMarkdown } from "../utils/markdown.js";
import { sendLog } from "../utils/logger.js";
import { RAID_JOIN_LIMIT, RAID_INTERVAL_MS } from "../config.js";

const joinTracker = new Map(); // chatId -> { count, first }

function renderTemplate(template, user, chatTitle) {
  return template
    .replaceAll("{name}", escapeMarkdown(user.first_name || "User"))
    .replaceAll("{username}", user.username ? `@${escapeMarkdown(user.username)}` : escapeMarkdown(user.first_name))
    .replaceAll("{chat}", escapeMarkdown(chatTitle || ""));
}

export function registerMemberHandler(bot) {
  // Anggota baru bergabung
  bot.on("new_chat_members", async (ctx) => {
    const chatId = ctx.chat.id;
    const settings = await getChatSettings(chatId, ctx.chat.title);

    for (const member of ctx.message.new_chat_members) {
      // Anti Bot: keluarkan bot lain otomatis jika diaktifkan
      if (member.is_bot && settings.anti_bot) {
        const me = await ctx.telegram.getMe();
        if (member.id !== me.id) {
          await ctx.banChatMember(member.id).catch(() => {});
          await ctx.unbanChatMember(member.id).catch(() => {});
          continue;
        }
      }

      // Anti Raid: deteksi lonjakan join dalam waktu singkat
      if (settings.anti_raid) {
        const now = Date.now();
        const entry = joinTracker.get(chatId) || { count: 0, first: now };
        if (now - entry.first > RAID_INTERVAL_MS) {
          entry.count = 1;
          entry.first = now;
        } else {
          entry.count += 1;
        }
        joinTracker.set(chatId, entry);

        if (entry.count > RAID_JOIN_LIMIT) {
          await ctx
            .restrictChatMember(member.id, {
              permissions: { can_send_messages: false },
            })
            .catch(() => {});
          continue;
        }
      }

      // Welcome message
      if (settings.welcome_enabled) {
        const body = settings.welcome_message
          ? renderTemplate(settings.welcome_message, member, ctx.chat.title)
          : `👋 Selamat datang ${mentionUser(member.id, member.first_name)} di *${escapeMarkdown(ctx.chat.title)}*\\!`;

        const sent = await ctx.replyWithMarkdownV2(buildMessage(body)).catch(() => null);

        if (sent && settings.auto_delete_welcome) {
          setTimeout(() => {
            ctx.deleteMessage(sent.message_id).catch(() => {});
          }, 60_000);
        }
      }

      // Join log
      if (settings.log_join && settings.log_channel_id) {
        await sendLog(
          bot.telegram,
          settings.log_channel_id,
          buildMessage(
            `➕ *Member Baru*\nUser: ${mentionUser(member.id, member.first_name)}\nID: \`${member.id}\`\nChat: ${escapeMarkdown(ctx.chat.title)}`
          )
        );
      }
    }
  });

  // Anggota keluar / dikeluarkan
  bot.on("left_chat_member", async (ctx) => {
    const chatId = ctx.chat.id;
    const settings = await getChatSettings(chatId, ctx.chat.title);
    const member = ctx.message.left_chat_member;
    if (!member) return;

    if (settings.goodbye_enabled) {
      const body = settings.goodbye_message
        ? renderTemplate(settings.goodbye_message, member, ctx.chat.title)
        : `👋 Selamat tinggal, ${escapeMarkdown(member.first_name)}\\. Semoga sukses selalu\\!`;
      await ctx.replyWithMarkdownV2(buildMessage(body)).catch(() => {});
    }

    if (settings.log_leave && settings.log_channel_id) {
      await sendLog(
        bot.telegram,
        settings.log_channel_id,
        buildMessage(
          `➖ *Member Keluar*\nUser: ${escapeMarkdown(member.first_name)}\nID: \`${member.id}\`\nChat: ${escapeMarkdown(ctx.chat.title)}`
        )
      );
    }
  });
}
