// commands/utility/stats.js
// Perintah: /stats
// Deskripsi   : Menampilkan statistik penggunaan bot secara umum.
// Permission  : Owner bot
// Contoh      : /stats

import { buildMessage } from "../../utils/formatter.js";
import { countUsers } from "../../database/users.js";
import { getDB } from "../../database/db.js";
import { ownerOnly } from "../../middleware/ownerCheck.js";

export async function statsCommand(ctx) {
  const totalUsers = await countUsers();
  const db = await getDB();
  const totalChats = (await db.get("SELECT COUNT(*) as total FROM chats"))?.total || 0;

  const body =
    `📊 *Statistik Bot*\n\n` +
    `Total Grup Terdaftar : *${totalChats}*\n` +
    `Total User Terekam   : *${totalUsers}*`;

  return ctx.replyWithMarkdownV2(buildMessage(body));
}

export const statsMiddlewares = [ownerOnly()];
