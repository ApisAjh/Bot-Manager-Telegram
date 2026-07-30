// bot.js
// Factory untuk membangun instance Telegraf beserta seluruh command & handler.
// Dipakai bersama oleh:
//   - index.js       -> mode polling (dev lokal) & webhook manual (Railway/Render)
//   - api/webhook.js -> mode webhook serverless (Vercel)
//
// Dipisah dari entry point agar logic bot tidak duplikat di dua environment yang berbeda.

import { Telegraf } from "telegraf";
import { BOT_TOKEN } from "./config.js";
import { getDB } from "./database/db.js";

import { registerErrorHandler } from "./handlers/errorHandler.js";
import { registerMessageHandler } from "./handlers/messageHandler.js";
import { registerMemberHandler } from "./handlers/memberHandler.js";
import { safe } from "./middleware/errorHandler.js";

// General
import { startCommand } from "./commands/general/start.js";
import { helpCommand, registerHelpActions } from "./commands/general/help.js";
import { aboutCommand } from "./commands/general/about.js";
import { pingCommand } from "./commands/general/ping.js";
import { rulesCommand } from "./commands/general/rules.js";
import { adminsCommand, adminsMiddlewares } from "./commands/general/admins.js";
import {
  settingsCommand,
  settingsMiddlewares,
  registerSettingsActions,
} from "./commands/general/settings.js";

// Moderation
import { banCommand, banMiddlewares } from "./commands/moderation/ban.js";
import { unbanCommand, unbanMiddlewares } from "./commands/moderation/unban.js";
import { kickCommand, kickMiddlewares } from "./commands/moderation/kick.js";
import { muteCommand, muteMiddlewares } from "./commands/moderation/mute.js";
import { unmuteCommand, unmuteMiddlewares } from "./commands/moderation/unmute.js";
import { warnCommand, warnMiddlewares } from "./commands/moderation/warn.js";
import { unwarnCommand, unwarnMiddlewares } from "./commands/moderation/unwarn.js";
import { resetwarnCommand, resetwarnMiddlewares } from "./commands/moderation/resetwarn.js";
import { purgeCommand, purgeMiddlewares } from "./commands/moderation/purge.js";
import { pinCommand, pinMiddlewares } from "./commands/moderation/pin.js";
import { unpinCommand, unpinMiddlewares } from "./commands/moderation/unpin.js";
import { promoteCommand, promoteMiddlewares } from "./commands/moderation/promote.js";
import { demoteCommand, demoteMiddlewares } from "./commands/moderation/demote.js";

// Protection (quick toggle commands)
import {
  PROTECTION_COMMANDS,
  makeProtectionCommand,
  protectionMiddlewares,
} from "./commands/protection/protectionSettings.js";

// Welcome
import {
  setWelcomeCommand,
  setGoodbyeCommand,
  welcomeSettingsMiddlewares,
} from "./commands/welcome/welcomeSettings.js";

// Utility
import { pollCommand } from "./commands/utility/poll.js";
import { userinfoCommand } from "./commands/utility/userinfo.js";
import { chatinfoCommand, chatinfoMiddlewares } from "./commands/utility/chatinfo.js";
import { broadcastCommand, broadcastMiddlewares } from "./commands/utility/broadcast.js";
import { statsCommand, statsMiddlewares } from "./commands/utility/stats.js";
import { uptimeCommand } from "./commands/utility/uptime.js";

const STARTED_AT = Date.now();

/**
 * Bangun & konfigurasi instance Telegraf secara penuh (tanpa launch/webhook listen).
 * Fungsi ini TIDAK memanggil bot.launch() atau setWebhook() -- itu tanggung jawab
 * masing-masing entry point (index.js / api/webhook.js), karena caranya berbeda
 * antara long-running process dan serverless function.
 *
 * @returns {Promise<import('telegraf').Telegraf>}
 */
export async function createBot() {
  await getDB();

  const bot = new Telegraf(BOT_TOKEN);

  registerErrorHandler(bot);
  registerMessageHandler(bot);
  registerMemberHandler(bot);

  // ===== GENERAL =====
  bot.start(safe(startCommand));
  bot.command("help", safe(helpCommand));
  bot.command("about", safe(aboutCommand));
  bot.command("ping", safe(pingCommand));
  bot.command("rules", safe(rulesCommand));
  bot.command("admins", ...adminsMiddlewares, safe(adminsCommand));
  bot.command("settings", ...settingsMiddlewares, safe(settingsCommand));
  registerHelpActions(bot);
  registerSettingsActions(bot);

  // ===== MODERATION =====
  bot.command("ban", ...banMiddlewares, safe(banCommand));
  bot.command("unban", ...unbanMiddlewares, safe(unbanCommand));
  bot.command("kick", ...kickMiddlewares, safe(kickCommand));
  bot.command("mute", ...muteMiddlewares, safe(muteCommand));
  bot.command("unmute", ...unmuteMiddlewares, safe(unmuteCommand));
  bot.command("warn", ...warnMiddlewares, safe(warnCommand));
  bot.command("unwarn", ...unwarnMiddlewares, safe(unwarnCommand));
  bot.command("resetwarn", ...resetwarnMiddlewares, safe(resetwarnCommand));
  bot.command("purge", ...purgeMiddlewares, safe(purgeCommand));
  bot.command("pin", ...pinMiddlewares, safe(pinCommand));
  bot.command("unpin", ...unpinMiddlewares, safe(unpinCommand));
  bot.command("promote", ...promoteMiddlewares, safe(promoteCommand));
  bot.command("demote", ...demoteMiddlewares, safe(demoteCommand));

  // ===== PROTECTION (quick toggle) =====
  for (const [cmd, { field, label }] of Object.entries(PROTECTION_COMMANDS)) {
    bot.command(cmd, ...protectionMiddlewares, safe(makeProtectionCommand(field, label)));
  }

  // ===== WELCOME SYSTEM =====
  bot.command("setwelcome", ...welcomeSettingsMiddlewares, safe(setWelcomeCommand));
  bot.command("setgoodbye", ...welcomeSettingsMiddlewares, safe(setGoodbyeCommand));

  // ===== UTILITY =====
  bot.command("poll", safe(pollCommand));
  bot.command("userinfo", safe(userinfoCommand));
  bot.command("chatinfo", ...chatinfoMiddlewares, safe(chatinfoCommand));
  bot.command("broadcast", ...broadcastMiddlewares, safe(broadcastCommand));
  bot.command("stats", ...statsMiddlewares, safe(statsCommand));
  bot.command("uptime", safe(uptimeCommand(STARTED_AT)));

  return bot;
}

// Cache instance bot per proses (penting untuk serverless: instance dipakai ulang
// selama "warm start", supaya command tidak didaftarkan berkali-kali dan koneksi
// DB tidak dibuka berulang).
let cachedBotPromise = null;

/**
 * Ambil instance bot singleton. Aman dipanggil berkali-kali dalam proses yang sama.
 * @returns {Promise<import('telegraf').Telegraf>}
 */
export function getBot() {
  if (!cachedBotPromise) {
    cachedBotPromise = createBot();
  }
  return cachedBotPromise;
}
