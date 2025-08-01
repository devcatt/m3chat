import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        tokenId: v.string(),
        settings: v.object({
            openAiKey: v.optional(v.string()),
        }),
    }).index("by_token", ["tokenId"]),
    threads: defineTable({
        name: v.string(),
        authorTokenId: v.string(),
        messages: v.optional(v.array(v.object({
            id: v.string(),
            role: v.string(),
            content: v.string(),
            createdAt: v.string(),
        }))),
    }).index("by_author", ["authorTokenId"]),
});