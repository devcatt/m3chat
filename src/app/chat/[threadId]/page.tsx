"use client";

import { Button } from "@/components/ui/button";
import { useAddUser} from "@/lib/use-add-user";
import { useChat } from "@ai-sdk/react";
import { Input } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { usePathname } from "next/navigation";
import { Id } from "../../../../convex/_generated/dataModel";
import type { UIMessage, Message } from "ai";

async function useOnMessageFinish(newMsg: Message, messages: UIMessage[], threadId: Id<"threads">) {		
	const thread = useQuery(api.threads.getThread, {
		threadId: threadId,
	});
	const updateMessageThreads = useMutation(api.threads.update);
	const allMessages = [{
		role: newMsg.role,
		parts: newMsg.parts,
		id: newMsg.id,
		createdAt: newMsg.createdAt?.toISOString()
	},
	...messages.map((msg) => {
		return {
			role: msg.role,
			parts: msg.parts,
			id: msg.id,
			createdAt: msg.createdAt?.toISOString()
		}
	})]
	console.log("newMsg", newMsg);
	console.log("messages", messages);
	if(!thread) return;
	await updateMessageThreads({
		threadId: thread._id,
		newParts: allMessages,
	})
}

export default function Page() {
	useAddUser();
	const threadId = usePathname().split("/")[2];
	const thread = useQuery(api.threads.getThread, {
		threadId: threadId as Id<"threads">,
	});
	const updateMessageThreads = useMutation(api.threads.update);
	const { messages, input, handleSubmit, handleInputChange } = useChat({
		"onFinish": async (newMsg: Message) => {
			console.log(newMsg);
			const allMessages = [
				// later fix this shit that it's one message behind
				// my idea is that messages doesn't have the new message yet
				...messages.map((msg) => {
					return {
						role: msg.role,
						parts: msg.parts,
						id: msg.id,
						createdAt: msg.createdAt?.toISOString()
				}
			})]
			if(!thread) return;
			await updateMessageThreads({
				threadId: thread._id,
				newParts: allMessages,	
			})
		}
	});
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
