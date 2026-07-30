// utils/formatter.js
// Template pesan konsisten untuk seluruh bot, memakai identitas dari config.js.

import { BOT_NAME, DEVELOPER_NAME } from "../config.js";
import { escapeMarkdown } from "./markdown.js";

const LINE = "━━━━━━━━━━━━━━━━━━━━";

export function header() {
  return `${LINE}\n🤖 *${escapeMarkdown(BOT_NAME)}*\n${LINE}`;
}

export function footer() {
  return `${LINE}\nDevelopment by *${escapeMarkdown(DEVELOPER_NAME)}*`;
}

/**
 * Bungkus isi pesan (body sudah dalam format MarkdownV2 yang valid/escaped)
 * dengan header & footer standar bot.
 * @param {string} body
 */
export function buildMessage(body) {
  return `${header()}\n\n${body}\n\n${footer()}`;
}
