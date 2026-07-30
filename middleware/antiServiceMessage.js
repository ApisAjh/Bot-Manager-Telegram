// middleware/antiServiceMessage.js
// Menghapus pesan layanan Telegram (join/leave/pin notice, dsb) jika anti_service_msg aktif.

import { getChatSettings } from "../database/chatSettings.js";

const SERVICE_KEYS = [
  "new_chat_members",
  "left_chat_member",
  "new_chat_title",
  "new_chat_photo",
  "delete_chat_photo",
  "group_chat_created",
  "pinned_message",
  "video_chat_started",
  "video_chat_ended",
];

export function antiServiceMessage() {
  return async (ctx, next) => {
    if (ctx.chat?.type === "private") return next();
    const msg = ctx.message;
    if (!msg) return next();

    const isService = SERVICE_KEYS.some((key) => key in msg);
    if (!isService) return next();

    const settings = await getChatSettings(ctx.chat.id, ctx.chat.title);
    if (!settings.anti_service_msg) return next();

    await ctx.deleteMessage().catch(() => {});
    return;
  };
}
