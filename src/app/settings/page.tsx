"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { 
	useUser,
	SignOutButton,
} from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
	const { user } = useUser();
	return (
		<main className="flex">
			<Link
				href="/"
				className={`m-8 flex gap-2 items-center cursor-pointer ${buttonVariants({ variant: "secondary" })}`}
			>
				<ArrowLeft />
				<div className="font-semibold cursor-pointer">Back</div>
			</Link>
			<div className="flex flex-col items-center justify-center min-h-screen w-full">
				<div className="text-2xl text-center mb-10">Settings</div>
				<div className="flex justify-start w-full">
					<div className="flex flex-col items-center justify-center">
						<div className="text-xl font-bold">Account</div>
						{user?.id && (
							<div className="cursor-pointer h-auto flex justify-center m-4">
								{user?.fullName && user?.imageUrl && (
									<div className="flex justify-center flex-col gap-2">
										<div className="flex flex-col gap-2 items-center">
											<Image
											src={user.imageUrl}
											alt="Profile Picture"
											width={128}
											height={128}
											className="rounded-full"
										/>
											<div className="text-center font-semibold text-3xl text-white">{user?.fullName}</div>
										</div>										
										<SignOutButton>
											<Button 
												variant={"destructive"} 
												className="flex cursor-pointer"
												>
													Sign out
												</Button>
										</SignOutButton>
								</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}
