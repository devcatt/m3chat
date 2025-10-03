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
import {
	useMutation,
	useQuery,
	Unauthenticated,
	Authenticated,
} from "convex/react";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import { User } from "lucide-react";

export default function AppSidebar() {
	const chats = useQuery(api.chats.get);
	const createChat = useMutation(api.chats.add);
	const user = useQuery(api.auth.getUser);
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
									createChat({
										name: `Chat ${chats?.length ? chats.length + 1 : 0}`,
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
									<Authenticated>
										<Link href="/settings">
											<SidebarMenuButton className="cursor-pointer h-auto flex justify-center">
												<div className="flex flex-row gap-2 items-center">
													{user?.image ? (
														<Image
															src={user.image}
															alt="Profile Picture"
															width={32}
															height={32}
															className="rounded-full"
														/>
													) : (
														<User className="w-8 h-8 rounded-full" />
													)}
													<div className="text-center">{user?.name}</div>
												</div>
											</SidebarMenuButton>
										</Link>
									</Authenticated>
									<Unauthenticated>
										<div className="flex flex-row gap-2 justify-center">
											<Button
												variant={"default"}
												className="cursor-pointer"
												onClick={() => redirect("/login")}
											>
												Log in
											</Button>
											<Button
												variant={"default"}
												className="cursor-pointer"
												onClick={() => redirect("/signup")}
											>
												Sign up
											</Button>
										</div>
									</Unauthenticated>
								</Suspense>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarFooter>
		</Sidebar>
	);
}
