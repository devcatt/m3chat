"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const threads = [
	{
		id: 1,
		name: "Thread 1 is a pretty cool one, i loved it. amazing expierence, awesome conversation",
	},
	{
		id: 2,
		name: "Thread 2",
	},
];

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Input } from "./ui/input";

function SearchBar() {
	const [search, setSearch] = useState("");
	return (
		<div className="flex flex-row gap-2">
			<Input
				placeholder="Search for threads..."
				onChange={(e) => setSearch(e.target.value)}
				value={search}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						console.log(search);
					}
				}}
			/>
		</div>
	);
}

export default function AppSidebar() {
	const { user } = useUser();
	return (
		<Sidebar>
			<SidebarHeader>
				<div className="text-2xl font-bold text-center">M3 Chat</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup className="flex flex-col gap-2">
					<SidebarGroupLabel>Threads</SidebarGroupLabel>
					<SearchBar />
					<SidebarGroupContent>
						{threads.map((thread) => (
							<SidebarMenu key={thread.id}>
								<SidebarMenuItem className="h-auto">
									<SidebarMenuButton className="cursor-pointer h-auto">
										<Link href={`/${thread.id}`}>{thread.name}</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						))}
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarGroup>
					<SidebarGroupLabel className="justify-center">
						Account
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								{user?.id ? (
									<Link href="/settings">
										<SidebarMenuButton className="cursor-pointer h-auto flex justify-center">
											{user?.fullName && user?.imageUrl && (
												<div className="flex flex-row gap-2 items-center">
													<Image
													src={user.imageUrl}
													alt="Profile Picture"
													width={32}
													height={32}
													className="rounded-full"
												/>
												<div className="text-center">{user?.fullName}</div>
											</div>
										)}
									</SidebarMenuButton>
								</Link>
							) : (
								<div className="flex flex-row gap-2 justify-center">
									<SignInButton>
										<Button variant={"default"} className="cursor-pointer">
											Sign in
										</Button>
								</SignInButton>
								<SignUpButton>
									<Button variant={"default"} className="cursor-pointer">
										Sign up
									</Button>
								</SignUpButton>
							</div>
							)}
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
				</SidebarGroup>
			</SidebarFooter>
		</Sidebar>
	);
}
