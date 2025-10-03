import { createClient, GenericCtx } from "@convex-dev/better-auth"
import { convex } from "@convex-dev/better-auth/plugins"
import { DataModel } from "./_generated/dataModel";
import { components } from "./_generated/api";
import { betterAuth } from "better-auth";
import { query } from "./_generated/server";

const siteURL = process.env.SITE_URL;

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (
    ctx: GenericCtx<DataModel>,
    { optionsOnly } = { optionsOnly: false },
) => {
    return betterAuth({
        logger: {
            disabled: optionsOnly,
        },
        baseURL: siteURL,
        database: authComponent.adapter(ctx),
        emailAndPassword: {
            enabled: true,
        },
        plugins: [
            convex()
        ],
    });
};

export const getUser = query({
    args: {},
    handler: async (ctx) => {
        return await authComponent.getAuthUser(ctx);
    },
});
