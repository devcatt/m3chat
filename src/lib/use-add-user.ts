"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";

export default function useAddUser() {
	const user = useUser();
	const userData = user.user;
	const addMutation = useMutation(api.users.add);
	const dbUser = useQuery(api.users.get);
	useEffect(() => {
		if (!user || !user.isSignedIn || !user.isLoaded) return;
		if (dbUser?.name === userData?.firstName) return;
		addMutation({
			settings: {
				openrouterKey: "nothinghereyet",
				// add byok later
			},
		});
	}, [user.isSignedIn, user.isLoaded, userData?.id]);
}
