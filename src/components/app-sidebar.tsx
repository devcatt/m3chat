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

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Input } from "./ui/input";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Plus } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { useSearchParams } from "next/navigation";

export default function AppSidebar() {
	const [search, setSearch] = useState("");
	const { user } = useUser();
	const threads = useQuery(api.threads.get);
	const createThread = useMutation(api.threads.add);
	const { messages } = useChat();
	const params = useSearchParams();
	if (!threads) return null;
	return (
		<Sidebar>
			<SidebarHeader>
				<div className="text-2xl font-bold text-center">M3 Chat</div>
			</SidebarHeader>
			<SidebarContent className="overscroll-none">
				<SidebarGroup>
					<SidebarGroupContent className="flex flex-row gap-2">
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
									createThread({
										name: `${threads.length + 1}`,
										messages: messages,
										// todo: make this name editable and something useful from the start
									});
								}}
							>	
								<Plus />
							</Button>
							<div>Threads</div>
						</SidebarGroupLabel>
						{threads.map((thread) => (
							<SidebarMenu key={thread._id}>
								<SidebarMenuItem className="h-auto">
									<SidebarMenuButton className="cursor-pointer h-auto">
										<Link 
											href={`/chat/${thread._id}`}
											className="flex w-full justify-center"
										>{`${thread.name}`}</Link>
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
};
