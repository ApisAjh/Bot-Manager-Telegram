// database/warnings.js
// Akses data peringatan (warn) per user per chat.

import { getDB } from "./db.js";

export async function getWarnCount(chatId, userId) {
  const db = await getDB();
  const row = await db.get(
    "SELECT count FROM warnings WHERE chat_id = ? AND user_id = ?",
    chatId,
    userId
  );
  return row?.count || 0;
}

export async function addWarn(chatId, userId) {
  const db = await getDB();
  const current = await getWarnCount(chatId, userId);
  const next = current + 1;

  if (current === 0) {
    await db.run(
      "INSERT INTO warnings (chat_id, user_id, count) VALUES (?, ?, ?)",
      chatId,
      userId,
      next
    );
  } else {
    await db.run(
      "UPDATE warnings SET count = ? WHERE chat_id = ? AND user_id = ?",
      next,
      chatId,
      userId
    );
  }
  return next;
}

export async function removeWarn(chatId, userId) {
  const current = await getWarnCount(chatId, userId);
  if (current <= 0) return 0;

  const db = await getDB();
  const next = current - 1;
  await db.run(
    "UPDATE warnings SET count = ? WHERE chat_id = ? AND user_id = ?",
    next,
    chatId,
    userId
  );
  return next;
}

export async function resetWarn(chatId, userId) {
  const db = await getDB();
  await db.run(
    "UPDATE warnings SET count = 0 WHERE chat_id = ? AND user_id = ?",
    chatId,
    userId
  );
  return 0;
}
