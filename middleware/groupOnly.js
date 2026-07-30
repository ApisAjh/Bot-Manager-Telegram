// middleware/groupOnly.js
// Memastikan command hanya bisa dijalankan di dalam grup/supergroup.

import { buildMessage } from "../utils/formatter.js";

export function groupOnly() {
  return async (ctx, next) => {
    const type = ctx.chat?.type;
    if (type !== "group" && type !== "supergroup") {
      await ctx.replyWithMarkdownV2(
        buildMessage("⚠️ Perintah ini hanya dapat digunakan di dalam *grup*, bukan chat pribadi\\.")
      );
      return;
    }
    return next();
  };
}
