import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const add = mutation({
    args: {
        name: v.string(),
        messages: v.optional(v.any()),
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
        newMessages: v.optional(v.any()), // for now i'll let it be an any, later take care of the type
    },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity()
        if (!user || !user.tokenIdentifier) return; // what the fuck should i do hereeeeeeeeeeeeeeee
        await ctx.db.patch(args.threadId, {
            messages: args.newMessages,
        })
    }
})