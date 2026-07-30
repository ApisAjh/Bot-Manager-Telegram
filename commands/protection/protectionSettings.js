// commands/protection/protectionSettings.js
// Perintah cepat: /antilink, /antispam, /antiflood, /antiraid, /antibot,
//                 /antiarabic, /antiforward, /antistickerspam, /antiservice
// Deskripsi   : Mengaktifkan/menonaktifkan fitur proteksi secara langsung lewat command,
//               sebagai alternatif cepat dari panel /settings.
// Permission  : Admin grup
// Contoh      : /antilink on
//               /antiflood off

import { getChatSettings, updateChatSettings } from "../../database/chatSettings.js";
import { buildMessage } from "../../utils/formatter.js";
import { extractArgs } from "../../utils/permission.js";
import { groupOnly } from "../../middleware/groupOnly.js";
import { adminOnly } from "../../middleware/adminCheck.js";

export const PROTECTION_COMMANDS = {
  antilink: { field: "anti_link", label: "Anti Link" },
  antispam: { field: "anti_spam", label: "Anti Spam" },
  antiflood: { field: "anti_flood", label: "Anti Flood" },
  antiraid: { field: "anti_raid", label: "Anti Raid" },
  antibot: { field: "anti_bot", label: "Anti Bot" },
  antiarabic: { field: "anti_arabic", label: "Anti Arabic" },
  antiforward: { field: "anti_forward", label: "Anti Forward" },
  antistickerspam: { field: "anti_sticker_spam", label: "Anti Sticker Spam" },
  antiservice: { field: "anti_service_msg", label: "Anti Service Message" },
};

export function makeProtectionCommand(field, label) {
  return async (ctx) => {
    const args = extractArgs(ctx);
    const mode = (args[0] || "").toLowerCase();

    if (mode !== "on" && mode !== "off") {
      const settings = await getChatSettings(ctx.chat.id, ctx.chat.title);
      const current = settings[field] ? "Aktif ✅" : "Nonaktif ❌";
      return ctx.replyWithMarkdownV2(
        buildMessage(
          `ℹ️ Status *${label}* saat ini: *${current}*\n\nCara pakai: \`/${Object.keys(PROTECTION_COMMANDS).find((k) => PROTECTION_COMMANDS[k].field === field)} on\` atau \`off\``
        )
      );
    }

    await updateChatSettings(ctx.chat.id, { [field]: mode === "on" ? 1 : 0 });
    return ctx.replyWithMarkdownV2(
      buildMessage(`✅ *${label}* telah di${mode === "on" ? "aktifkan" : "nonaktifkan"}\\.`)
    );
  };
}

export const protectionMiddlewares = [groupOnly(), adminOnly()];
