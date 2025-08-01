import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const add = mutation({
    args: {
        name: v.string(),
        messages: v.array(v.object({
            id: v.string(),
            createdAt: v.string(),
            content: v.string(),
            role: v.string(),
        })),
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity()
        if (!user || !user.tokenIdentifier) return;
        await ctx.db.insert("threads", {
            name: args.name,
            authorTokenId: user.tokenIdentifier,
            messages: args.messages,
        })
    }
});

export const get = query({
    handler: async (ctx) => {
        const user = await ctx.auth.getUserIdentity()
        if (!user || !user.tokenIdentifier) return;
        return await ctx.db.query("threads")
            .withIndex("by_author", (q) => q.eq("authorTokenId", user.tokenIdentifier))
            .take(200)
    }
});

export const getThread = query({
    args: {
        threadId: v.id("threads"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("threads")
            .withIndex("by_id", (q) => q.eq("_id", args.threadId))
            .unique()
    }
});

export const remove = mutation({
    args: {
        threadId: v.id("threads")
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity()
        if (!user || !user.tokenIdentifier) return;
        await ctx.db.delete(args.threadId);
    }
});

export const update = mutation({
    args: {
        threadId: v.id("threads"),
        messages: v.array(v.object({
            id: v.string(),
            createdAt: v.string(),
            content: v.string(),
            role: v.string(),
        })),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.threadId, {
            messages: args.messages,
        })
    }
})