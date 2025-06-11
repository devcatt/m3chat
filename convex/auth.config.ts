import { env } from "../src/env";

export default {
	providers: [
		{
			applicationID: "convex",
			domain: env.CLERK_FRONTEND_API_URL,
		},
	],
};
