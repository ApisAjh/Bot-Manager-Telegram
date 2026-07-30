// commands/utility/uptime.js
// Perintah: /uptime
// Deskripsi   : Menampilkan lama waktu bot telah berjalan sejak terakhir kali di-restart.
// Permission  : Semua orang
// Contoh      : /uptime

import { buildMessage } from "../../utils/formatter.js";

function formatDuration(ms) {
  const sec = Math.floor(ms / 1000) % 60;
  const min = Math.floor(ms / (1000 * 60)) % 60;
  const hour = Math.floor(ms / (1000 * 60 * 60)) % 24;
  const day = Math.floor(ms / (1000 * 60 * 60 * 24));
  return `${day}h ${hour}j ${min}m ${sec}d`;
}

export function uptimeCommand(startedAt) {
  return (ctx) => {
    const elapsed = Date.now() - startedAt;
    return ctx.replyWithMarkdownV2(
      buildMessage(`⏱️ *Uptime Bot*\n\nBot telah berjalan selama:\n\`${formatDuration(elapsed)}\``)
    );
  };
}
