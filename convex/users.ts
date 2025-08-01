import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
    args: {
        settings: v.object({
            openAiKey: v.optional(v.string()),
        })
    },
    handler: async (ctx, args) => {
        const id = await ctx.auth.getUserIdentity();
        if (!id?.name || !id?.tokenIdentifier) return;
        const query = ctx.db.query("users")
            .withIndex("by_token", (q) => q.eq("tokenId", id.tokenIdentifier))
            .unique();
        if(await query) return;
        await ctx.db.insert("users", {
            name: id.name,
            tokenId: id.tokenIdentifier,
            settings: args.settings ?? {
                openAiKey: undefined,
            },
        })
    }
});

export const get = query({
    handler: async (ctx) => {
        const id = await ctx.auth.getUserIdentity();
        if (!id) return;
        if (!id.name || !id.tokenIdentifier) return;
        return await ctx.db.query("users")
            .withIndex("by_token", (q) => q.eq("tokenId", id.tokenIdentifier))
            .unique();
    }
});

export const remove = mutation({
    handler: async (ctx) => {
        const user = await ctx.auth.getUserIdentity();
        if(!user) return;
        if(!user.tokenIdentifier) return;
        const userTable = await ctx.db
            .query("users")
            .withIndex("by_token", (q) => q.eq("tokenId", user.tokenIdentifier))
            .unique();
        if(!userTable) return;
        await ctx.db.delete(userTable._id);
    }
});