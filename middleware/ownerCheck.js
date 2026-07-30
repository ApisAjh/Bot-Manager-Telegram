// middleware/ownerCheck.js
// Middleware: hanya owner bot (didefinisikan di config.js / OWNER_IDS) yang boleh lanjut.

import { buildMessage } from "../utils/formatter.js";
import { isOwner } from "../utils/permission.js";

export function ownerOnly() {
  return async (ctx, next) => {
    if (!isOwner(ctx)) {
      await ctx.replyWithMarkdownV2(
        buildMessage("🚫 Perintah ini khusus untuk *owner bot*\\.")
      );
      return;
    }
    return next();
  };
}
