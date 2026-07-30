// middleware/adminCheck.js
// Middleware: hanya admin/creator grup (atau owner bot) yang boleh lanjut.

import { buildMessage } from "../utils/formatter.js";
import { isChatAdmin } from "../utils/permission.js";

export function adminOnly() {
  return async (ctx, next) => {
    const allowed = await isChatAdmin(ctx);
    if (!allowed) {
      await ctx.replyWithMarkdownV2(
        buildMessage("🚫 Perintah ini khusus untuk *admin grup*\\.")
      );
      return;
    }
    return next();
  };
}
