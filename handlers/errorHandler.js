// handlers/errorHandler.js
// Global error handler untuk seluruh instance bot (bot.catch).

import { logger } from "../utils/logger.js";

export function registerErrorHandler(bot) {
  bot.catch((err, ctx) => {
    logger.error(`Unhandled error pada update ${ctx.updateType}:`, err);
  });
}
