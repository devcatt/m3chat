import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
    users: defineTable({
        name: v.string(),
        tokenId: v.string(),
        settings: v.object({
            openrouterKey: v.optional(v.string()),
        }),
    }).index("by_token", ["tokenId"]),
});