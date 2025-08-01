import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		CONVEX_DEPLOYMENT: z.string(),
		CLERK_SECRET_KEY: z.string(),
		CLERK_FRONTEND_API_URL: z.string().url(),
	},
	client: {
		NEXT_PUBLIC_CONVEX_URL: z.string().url(),
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
