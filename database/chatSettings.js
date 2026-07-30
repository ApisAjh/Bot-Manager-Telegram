// database/chatSettings.js
// Akses data pengaturan per-chat (grup).

import { getDB } from "./db.js";

const DEFAULTS = {
  chat_id: 0,
  title: "",
  rules: "",
  welcome_enabled: 1,
  welcome_message: "",
  goodbye_enabled: 1,
  goodbye_message: "",
  auto_delete_welcome: 0,
  captcha_enabled: 0,
  anti_link: 0,
  anti_spam: 0,
  anti_flood: 0,
  anti_raid: 0,
  anti_bot: 0,
  anti_arabic: 0,
  anti_forward: 0,
  anti_sticker_spam: 0,
  anti_service_msg: 0,
  log_join: 0,
  log_leave: 0,
  log_ban: 0,
  log_delete: 0,
  log_edit: 0,
  log_channel_id: null,
};

/**
 * Ambil pengaturan chat. Jika belum ada, baris default akan dibuat otomatis.
 * @param {number} chatId
 * @param {string} [title]
 */
export async function getChatSettings(chatId, title = "") {
  const db = await getDB();
  let row = await db.get("SELECT * FROM chats WHERE chat_id = ?", chatId);

  if (!row) {
    await db.run("INSERT INTO chats (chat_id, title) VALUES (?, ?)", chatId, title);
    row = { ...DEFAULTS, chat_id: chatId, title };
  }
  return row;
}

/**
 * Update satu atau beberapa kolom pengaturan chat sekaligus.
 * @param {number} chatId
 * @param {Record<string, any>} fields
 */
export async function updateChatSettings(chatId, fields) {
  const db = await getDB();
  await getChatSettings(chatId); // pastikan baris sudah ada

  const keys = Object.keys(fields);
  if (keys.length === 0) return;

  const setClause = keys.map((k) => `${k} = ?`).join(", ");
  const values = keys.map((k) => fields[k]);

  await db.run(`UPDATE chats SET ${setClause} WHERE chat_id = ?`, ...values, chatId);
}

/**
 * Toggle sebuah kolom boolean (0/1) dan kembalikan nilai barunya.
 * @param {number} chatId
 * @param {string} field
 */
export async function toggleChatSetting(chatId, field) {
  const settings = await getChatSettings(chatId);
  const newValue = settings[field] ? 0 : 1;
  await updateChatSettings(chatId, { [field]: newValue });
  return newValue;
}
