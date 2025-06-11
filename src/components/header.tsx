"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { Authenticated, Unauthenticated } from "convex/react";

export default function Header() {
	const { user } = useUser();
	return (
		<header className="flex gap-2 justify-end items-center text-white p-2">
			<Unauthenticated>
				<SignInButton>
					<Button variant={"default"} className="cursor-pointer">
						Sign In
					</Button>
				</SignInButton>
				<SignUpButton>
					<Button variant={"default"} className="cursor-pointer">
						Sign Up
					</Button>
				</SignUpButton>
			</Unauthenticated>
			<Authenticated>
				<div>{user?.fullName}</div>
				<UserButton />
			</Authenticated>
		</header>
	);
}
