"use client";

import type { Id } from "@/../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddUser } from "@/hooks/use-add-user";
import { useChat } from "@ai-sdk/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { SendHorizonal } from "lucide-react";
import { redirect, usePathname } from "next/navigation";
import Markdown from "react-markdown";
import { api } from "../../../../convex/_generated/api";

export default function Page() {
	const chatId = usePathname().split("/")[2] as Id<"chats">;
	useAddUser();
	const addMessage = useMutation(api.messages.send).withOptimisticUpdate(
		(_, args) => {
			console.log(args);
		},
	);
	const messages = useQuery(api.messages.get, { chatId });
	const { input, handleSubmit, handleInputChange } = useChat({
		onFinish: async (msg) => {
			window.scrollTo(0, document.body.scrollHeight);
			const newMessages = [
				{
					msgId: `user-${crypto.randomUUID()}`,
					role: "user",
					content: input,
					createdAt: new Date().toISOString(),
					chatId,
				},
				{
					msgId: msg.id,
					role: "assistant",
					content: msg.content,
					createdAt: msg.createdAt?.toISOString() ?? new Date().toISOString(),
					chatId,
				},
			];
			addMessage(newMessages[0]);
			addMessage(newMessages[1]);
		},
	});
	const auth = useConvexAuth();
	if (!auth.isAuthenticated && !auth.isLoading) return redirect("/");
	return (
		<main className="flex flex-col min-h-screen items-center justify-between overscroll-none">
			<div className="flex flex-col text-2xl w-full p-14">
				<div>
					{messages?.map((msg) => {
						if (msg.role === "user") {
							return (
								<div
									className="flex flex-col text-end"
									key={`user-${msg.msgId}`}
								>
									<Markdown>{msg.content}</Markdown>
								</div>
							);
						}
						if (msg.role === "assistant") {
							return (
								<div
									className="flex flex-col gap-2 p-2 m-2 w-[50%]"
									key={`assistant-${msg.msgId}`}
								>
									<Markdown>{msg.content}</Markdown>
								</div>
							);
						}
					})}
				</div>
			</div>
			<form onSubmit={handleSubmit} className="flex flex-row gap-2 p-2 w-[75%]">
				<Input
					onChange={handleInputChange}
					value={input}
					className="flex w-full"
				/>
				<Button
					type="submit"
					variant={"secondary"}
					className="cursor-pointer flex items-center w-auto"
				>
					<SendHorizonal />
				</Button>
			</form>
		</main>
	);
};
