// utils/permission.js
// Helper pengecekan role/permission user di dalam chat.

import { OWNER_IDS } from "../config.js";

/**
 * @param {import('telegraf').Context} ctx
 */
export function isOwner(ctx) {
  const userId = ctx.from?.id;
  return !!userId && OWNER_IDS.includes(userId);
}

export async function getChatMemberStatus(ctx, userId) {
  try {
    const member = await ctx.getChatMember(userId);
    return member.status; // creator | administrator | member | restricted | left | kicked
  } catch {
    return null;
  }
}

export async function isChatAdmin(ctx, userId = ctx.from?.id) {
  if (!userId) return false;
  if (isOwner(ctx)) return true;
  const status = await getChatMemberStatus(ctx, userId);
  return status === "creator" || status === "administrator";
}

export async function isChatCreator(ctx, userId = ctx.from?.id) {
  if (!userId) return false;
  const status = await getChatMemberStatus(ctx, userId);
  return status === "creator";
}

export async function isBotAdmin(ctx) {
  try {
    const me = await ctx.telegram.getMe();
    const status = await getChatMemberStatus(ctx, me.id);
    return status === "administrator" || status === "creator";
  } catch {
    return false;
  }
}

/**
 * Ambil target user dari reply message atau argumen command (@username / userId).
 */
export function extractTargetUser(ctx) {
  if (ctx.message?.reply_to_message?.from) {
    return ctx.message.reply_to_message.from;
  }
  return null;
}

export function extractArgs(ctx) {
  const text = ctx.message?.text || "";
  return text.split(/\s+/).slice(1);
}
