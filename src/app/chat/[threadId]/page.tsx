"use client";

import { Button } from "@/components/ui/button";
import useAddUser from "@/lib/use-add-user";
import { useChat } from "@ai-sdk/react";
import { Input } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { usePathname } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";

export default function Page() {
	const threadId = usePathname().split("/")[2]
	const updateMessageThreads = useMutation(api.threads.update);
	const thread = useQuery(api.threads.getThread, {
		threadId: threadId as Id<"threads">,
	});
	interface Message {
		id: string
		role: string
		content: string
		createdAt?: Date | string | undefined
		parts: Array<{ type: string, text?: string }>
	}
	const { messages, input, handleSubmit, handleInputChange } = useChat({ 
		"onFinish": async () => {
			if(!thread || !thread.messages) return;
			const newMessages = messages.map((msg) => msg);
			const allMessages: Array<Message> = [...thread.messages.map(msg => {
				return {
					id: msg.id,
					role: msg.role,
					content: msg.content,
					createdAt: msg.createdAt?.toLocaleString(),
					parts: msg.parts,
				}
			}), ...newMessages];
			const mappedMessages = () => {
				let messages: Message[] = [];
				allMessages.map(msg => {
					messages.push({
						id: msg.id,
						role: msg.role,
						content: msg.content,
						createdAt: msg.createdAt?.toLocaleString(),
						parts: msg.parts,
					})
				})
				return messages;
			}
			const allMappedMessages = mappedMessages();
			updateMessageThreads({
				threadId: threadId as Id<"threads">,
				newMessages: {
					id: allMappedMessages,
				},
			})
		},
		// fix whatever the fuck this is or use patchpackage
	});
	useAddUser();	
	
	return (
		<main className="flex flex-col min-h-screen items-center justify-between">
			<div className="flex flex-col text-2xl w-full">
				<div className="flex flex-col m-10 text-xl">
					{messages.map((msg) => {
						switch (msg.role) {
							case "user":
								return (
									<div key={msg.id} className="flex justify-end p-2">
										{msg.parts.map((part, i) => {
											switch (part.type) {
												case "text":
													return <div key={`${msg.id}-${i}`}>{part.text}</div>;
											}
										})}
									</div>
								);
							case "assistant":
								return (
									<div key={msg.id} className="flex justify-start w-[75%] p-2">
										{msg.parts.map((part, i) => {
											switch (part.type) {
												case "text":
													return <div key={`${msg.id}-${i}`}>{part.text}</div>;
											}
										})}
									</div>
								);
						}
					})}
				</div>
			</div>
			<form 
				onSubmit={handleSubmit} 
				className="flex flex-row gap-2 p-2"
			>
				<Input 
					placeholder="Enter your message..." 
					onChange={handleInputChange} 
					value={input}
					className="w-full"
				/>
				<Button type="submit" className="cursor-pointer flex items-center w-auto">
					<SendHorizonal />
				</Button>
			</form>
		</main>
	);
};
