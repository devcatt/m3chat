"use client";

import { Button } from "@/components/ui/button";
import { useAddUser} from "@/lib/use-add-user";
import { useChat } from "@ai-sdk/react";
import { Input } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { usePathname } from "next/navigation";
import { Id } from "@/../convex/_generated/dataModel";
import type { Message } from "ai";
import Markdown from "react-markdown";

export default function Page() {
	useAddUser();
	const threadId = usePathname().split("/")[2];
	const thread = useQuery(api.threads.getThread, {
		threadId: threadId as Id<"threads">,
	});
	const updateMessageThreads = useMutation(api.threads.update);
	const { input, handleSubmit, handleInputChange } = useChat({
		"onFinish": async (msg: Message) => {
			if(!thread?.messages || !msg.createdAt) return;
			const user = {
				id: msg.id,
				createdAt: msg.createdAt.toISOString(),
				content: input,
				role: "user"
			};
			const assistant = {
				id: msg.id,
				createdAt: msg.createdAt.toISOString(),
				content: msg.content,
				role: "assistant"
			};
			await updateMessageThreads({
				threadId: threadId as Id<"threads">,
				messages: [...thread.messages, user, assistant],
			})
		}
	});
	return (
		<main className="flex flex-col min-h-screen items-center justify-between overscroll-none">
			<div className="flex flex-col text-2xl w-full p-10">
				<div className="flex flex-col text-xl">
					{thread?.messages?.map(msg => {
						if (msg.role === "user") {
							return (
								<div className="flex flex-col gap-2 justify-end" key={`user-${msg.id}`}>
									<div className="flex flex-col gap-2 text-end">
										<Markdown>{msg.content}</Markdown>
									</div>
								</div>
							)
						}
						if (msg.role === "assistant") {
							return (
								<div className="flex flex-col gap-2 p-2 m-2" key={`assistant-${msg.id}`}>
									<div className="flex flex-col gap-2 w-[50%]">
										<Markdown>{msg.content}</Markdown>
									</div>
								</div>
							)
						}
					})}
				</div>
				{/* <div className="flex flex-col text-xl">
					{messages.map(msg => {
						if (msg.role === "user") {
							return (
								<div className="flex flex-col gap-2 justify-end" key={msg.id}>
									<div className="flex flex-col gap-2 justify-end">
										{msg.parts.map((part, i) => {
											if (part.type === "text") {
												return (
													<div key={i}
														className="flex flex-col gap-2 justify-end">
														<Markdown>{part.text}</Markdown>
													</div>
												)
											}
										})}
									</div>
								</div>
							)
						}
						if (msg.role === "assistant") {
							return (
								<div className="flex flex-col gap-2 justify-start" key={msg.id}>
									<div className="flex flex-col gap-2">
										{msg.parts.map((part, i) => {
											if (part.type === "text") {
												return (
													<div key={i}
														className="flex flex-col gap-2">
														<Markdown>{part.text}</Markdown>
													</div>
												)
											}
										})}
									</div>
								</div>
							)
						}
					})}
				</div> */}
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
