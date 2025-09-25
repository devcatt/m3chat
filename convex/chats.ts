import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const add = mutation({
    args: {
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity()
        if (!user || !user.tokenIdentifier) return;
        await ctx.db.insert("chats", {
            name: args.name,
            authorTokenId: user.tokenIdentifier,
        })
    }
});

export const get = query({
    handler: async (ctx) => {
        const user = await ctx.auth.getUserIdentity()
        if (!user || !user.tokenIdentifier) return;
        return await ctx.db.query("chats")
            .withIndex("by_author", (q) => q.eq("authorTokenId", user.tokenIdentifier))
            .take(200)
    }
});

export const remove = mutation({
    args: {
        chatId: v.id("chats")
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity()
        if (!user || !user.tokenIdentifier) return;
        await ctx.db.delete(args.chatId);
    }
});