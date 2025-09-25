import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        tokenId: v.string(),
        settings: v.object({
            openAiKey: v.optional(v.string()),
        }),
    }).index("by_token", ["tokenId"]),
    chats: defineTable({
        name: v.string(),
        authorTokenId: v.string(),
    }).index("by_author", ["authorTokenId"]),
    messages: defineTable({            
        chatId: v.id("chats"),
        authorTokenId: v.string(),
        content: v.string(),
        createdAt: v.string(),
        msgId: v.string(),
        role: v.string()
    }).index("by_chat", ["chatId"]),
});