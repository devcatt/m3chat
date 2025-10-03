"use client";

import { ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";

const convex = new ConvexReactClient(
	process.env.NEXT_PUBLIC_CONVEX_URL as string,
	{
		// no queries until authenticated
		expectAuth: true,
	},
);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
	return (
		<ConvexBetterAuthProvider client={convex} authClient={authClient}>
			{children}
		</ConvexBetterAuthProvider>
	);
}
