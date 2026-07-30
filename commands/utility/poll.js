// commands/utility/poll.js
// Perintah: /poll <pertanyaan> | <opsi1> | <opsi2> | ...
// Deskripsi   : Membuat polling di dalam grup.
// Permission  : Semua orang
// Contoh      : /poll Makan siang apa hari ini? | Nasi Goreng | Mie Ayam | Bakso

import { buildMessage } from "../../utils/formatter.js";

export async function pollCommand(ctx) {
  const text = (ctx.message?.text || "").split(/\s+/).slice(1).join(" ");
  const parts = text.split("|").map((p) => p.trim()).filter(Boolean);

  if (parts.length < 3) {
    return ctx.replyWithMarkdownV2(
      buildMessage(
        "ℹ️ Cara pakai:\n`/poll <pertanyaan> | <opsi1> | <opsi2> | ...`\n\nMinimal 2 opsi jawaban\\."
      )
    );
  }

  const [question, ...options] = parts;
  try {
    await ctx.replyWithPoll(question, options.slice(0, 10), { is_anonymous: false });
  } catch {
    await ctx.replyWithMarkdownV2(buildMessage("❌ Gagal membuat polling\\."));
  }
}
