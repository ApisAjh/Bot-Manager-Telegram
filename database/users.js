// database/users.js
// Cache data user sederhana untuk keperluan statistik & broadcast.

import { getDB } from "./db.js";

export async function upsertUser(user) {
  if (!user?.id) return;
  const db = await getDB();
  await db.run(
    `INSERT INTO users (user_id, username, first_name, last_seen)
     VALUES (?, ?, ?, datetime('now'))
     ON CONFLICT(user_id) DO UPDATE SET
       username = excluded.username,
       first_name = excluded.first_name,
       last_seen = excluded.last_seen`,
    user.id,
    user.username || null,
    user.first_name || null
  );
}

export async function getAllUserIds() {
  const db = await getDB();
  const rows = await db.all("SELECT user_id FROM users");
  return rows.map((r) => r.user_id);
}

export async function countUsers() {
  const db = await getDB();
  const row = await db.get("SELECT COUNT(*) as total FROM users");
  return row?.total || 0;
}

export async function incrementStat(key) {
  const db = await getDB();
  await db.run(
    `INSERT INTO stats (key, value) VALUES (?, 1)
     ON CONFLICT(key) DO UPDATE SET value = value + 1`,
    key
  );
}

export async function getStat(key) {
  const db = await getDB();
  const row = await db.get("SELECT value FROM stats WHERE key = ?", key);
  return row?.value || 0;
}
