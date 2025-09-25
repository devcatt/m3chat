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

import { useChat } from "@ai-sdk/react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";

export default function AppSidebar() {
	const { user } = useUser();
	const chats = useQuery(api.chats.get);
	const createChat = useMutation(api.chats.add);
	const { messages } = useChat();
	const chatId = usePathname().split("/")[2] as Id<"chats">;
	return (
		<Sidebar>
			<SidebarHeader>
				<div className="text-2xl font-bold text-center">M3 Chat</div>
			</SidebarHeader>
			<SidebarContent className="overscroll-none">
				<SidebarGroup>
					<SidebarGroupContent className="flex flex-row gap-2">
						<Input
							placeholder="Search for chats..."
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									console.log(e.currentTarget.value);
								}
							}}
						/>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup className="flex flex-col gap-2">
					<SidebarGroupContent>
						<SidebarGroupLabel className="flex flex-row gap-2">
							<Button
								variant={"ghost"}
								className="flex justify-center cursor-pointer"
								onMouseDown={(e) => {
									e.preventDefault();
									if (!chats || !messages) return;
									createChat({
										name: `Chat ${chats.length + 1}`,
									});
								}}
							>
								<Plus />
							</Button>
							<div>Chats</div>
						</SidebarGroupLabel>
						{chats
							? chats.map((chat) => (
									<SidebarMenu key={chat._id}>
										<SidebarMenuItem>
											<SidebarMenuButton className="cursor-pointer h-auto">
												<Link
													href={`/chat/${chat._id}`}
													className="flex w-full justify-center"
												>{`${chat.name}`}</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarMenu>
								))
							: null}
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
								<Suspense
									fallback={<Skeleton className="w-8 h-8 rounded-full" />}
								>
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
								</Suspense>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarFooter>
		</Sidebar>
	);
}
