import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		CONVEX_DEPLOYMENT: z.string().url(),
		CLERK_SECRET_KEY: z.string(),
	},
	client: {
		CLERK_FRONTEND_API_URL: z.string().url().optional(),
		// something is wrong with the api_url, removing the optional gives an error
		// make sure to find a fix for this guy
		NEXT_PUBLIC_CONVEX_URL: z.string(),
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
	},
	runtimeEnv: {
		CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
		NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
		CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
		CLERK_FRONTEND_API_URL: process.env.CLERK_FRONTEND_API_URL,
	},
});
