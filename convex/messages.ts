import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
    args: {
        chatId: v.id("chats"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("messages")
            .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
            .collect()
    }
});

export const send = mutation({
    args: {
        chatId: v.id("chats"),
        content: v.string(),
        createdAt: v.string(),
        msgId: v.string(),
        role: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();
        await ctx.db.insert("messages", {
            msgId: args.msgId,
            role: args.role,
            content: args.content,
            createdAt: args.createdAt,
            chatId: args.chatId,
            authorTokenId: user?.tokenIdentifier ?? ""
        })
    }
});

export const remove = mutation({
    args: {
        chatId: v.id("messages")
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.chatId);
    },
});