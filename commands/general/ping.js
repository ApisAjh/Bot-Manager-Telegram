// commands/general/ping.js
// Perintah: /ping
// Deskripsi   : Mengukur kecepatan respon bot (latency).
// Permission  : Semua orang
// Contoh      : /ping

import { buildMessage } from "../../utils/formatter.js";

export async function pingCommand(ctx) {
  const start = Date.now();
  const sent = await ctx.replyWithMarkdownV2(buildMessage("🏓 Menghitung latency\\.\\.\\."));
  const latency = Date.now() - start;

  await ctx.telegram.editMessageText(
    ctx.chat.id,
    sent.message_id,
    undefined,
    buildMessage(`🏓 *Pong\\!*\nLatency: \`${latency}ms\``),
    { parse_mode: "MarkdownV2" }
  );
}
