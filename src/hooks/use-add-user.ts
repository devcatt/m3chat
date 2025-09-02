"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";

export function useAddUser() {
	const user = useUser();
	const userData = user.user;
	const useAddUser = useMutation(api.users.add);
	useEffect(() => {
		if (!user.isSignedIn || !user.isLoaded) return;
		useAddUser({
			settings: {
				openAiKey: "",
			},
		});
	}, [user.isSignedIn, user.isLoaded, userData?.firstName]);
}
