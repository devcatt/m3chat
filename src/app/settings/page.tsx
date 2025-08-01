"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { api } from "../../../convex/_generated/api";
function User() {
	const { user } = useUser();
	return (
		<div className="flex flex-col items-start text-start justify-start">
			<div className="flex items-center text-center mx-8 text-2xl font-bold">
				Account
			</div>
			{user?.id && (
				<div className="cursor-pointer h-auto flex justify-start m-4">
					{user?.fullName && user?.imageUrl && (
						<div className="flex justify-start flex-col gap-2">
							<div className="flex flex-col gap-2 items-center justify-start">
								<Image
									src={user.imageUrl}
									alt="Profile Picture"
									width={128}
									height={128}
									className="rounded-full"
								/>
								<div className="text-start font-semibold text-3xl text-white">
									{user?.fullName}
								</div>
							</div>
							<SignOutButton>
								<Button variant={"destructive"} className="flex cursor-pointer">
									Sign out
								</Button>
							</SignOutButton>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

function Settings() {
	return (
		<div className="flex flex-row justify-start p-8 gap-12">
			<User />
			<div className="text-center">
				<div className="font-bold text-2xl">General</div>
				<div>random general stuff</div>
			</div>
			<div className="text-center">
				<div className="font-bold text-2xl">AI</div>
				<div>Bring Your Own Key</div>
				{/* add inputs for ai keys with saving to db */}
			</div>
		</div>
	);
}

export default function Page() {
	return (
		<main className="flex flex-col min-h-screen">
			<Link
				href="/"
				className={`flex gap-2 m-8 w-min justify-start items-center ${buttonVariants({ variant: "default" })}`}
			>
				<ArrowLeft />
				<div className="font-semibold cursor-pointer">Back</div>
			</Link>
			<div className="flex text-center text-2xl font-bold justify-center">
				Settings
			</div>
			<Settings />
		</main>
	);
}
