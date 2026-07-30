// utils/markdown.js
// Utility escaping untuk parse_mode MarkdownV2.

const RESERVED = /[_*[\]()~`>#+\-=|{}.!\\]/g;

/**
 * Escape teks dinamis (nama user, username, teks bebas) agar aman
 * dikirim dengan parse_mode MarkdownV2.
 * @param {string|number} text
 * @returns {string}
 */
export function escapeMarkdown(text) {
  if (text === null || text === undefined) return "";
  return String(text).replace(RESERVED, "\\$&");
}

/**
 * Bungkus teks agar tampil sebagai inline code (aman dari escaping lain).
 */
export function codeBlock(text) {
  return `\`${String(text).replace(/`/g, "'")}\``;
}

/**
 * Buat mention MarkdownV2 yang aman untuk user tanpa username.
 */
export function mentionUser(userId, name) {
  return `[${escapeMarkdown(name || "User")}](tg://user?id=${userId})`;
}
