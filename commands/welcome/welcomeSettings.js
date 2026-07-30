// commands/welcome/welcomeSettings.js
// Perintah: /setwelcome <teks> , /setgoodbye <teks>
// Deskripsi   : Mengatur pesan sambutan/perpisahan kustom untuk grup.
//               Placeholder yang didukung: {name} {username} {chat}
// Permission  : Admin grup
// Contoh      : /setwelcome Halo {name}, selamat datang di {chat}!
//               /setgoodbye Sampai jumpa lagi, {name}.

import { updateChatSettings } from "../../database/chatSettings.js";
import { buildMessage } from "../../utils/formatter.js";
import { groupOnly } from "../../middleware/groupOnly.js";
import { adminOnly } from "../../middleware/adminCheck.js";

function rawTextAfterCommand(ctx) {
  const text = ctx.message?.text || "";
  return text.split(/\s+/).slice(1).join(" ").trim();
}

export async function setWelcomeCommand(ctx) {
  const text = rawTextAfterCommand(ctx);
  if (!text) {
    return ctx.replyWithMarkdownV2(
      buildMessage(
        "ℹ️ Cara pakai:\n`/setwelcome <teks>`\n\nPlaceholder yang didukung: `{name}` `{username}` `{chat}`"
      )
    );
  }
  await updateChatSettings(ctx.chat.id, { welcome_message: text, welcome_enabled: 1 });
  return ctx.replyWithMarkdownV2(buildMessage("✅ Pesan *welcome* kustom berhasil disimpan\\."));
}

export async function setGoodbyeCommand(ctx) {
  const text = rawTextAfterCommand(ctx);
  if (!text) {
    return ctx.replyWithMarkdownV2(
      buildMessage(
        "ℹ️ Cara pakai:\n`/setgoodbye <teks>`\n\nPlaceholder yang didukung: `{name}` `{username}` `{chat}`"
      )
    );
  }
  await updateChatSettings(ctx.chat.id, { goodbye_message: text, goodbye_enabled: 1 });
  return ctx.replyWithMarkdownV2(buildMessage("✅ Pesan *goodbye* kustom berhasil disimpan\\."));
}

export const welcomeSettingsMiddlewares = [groupOnly(), adminOnly()];
