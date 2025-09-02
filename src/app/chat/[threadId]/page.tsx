"use client";

import type { Id } from "@/../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddUser } from "@/hooks/use-add-user";
import { useChat } from "@ai-sdk/react";
import { useQuery } from "convex/react";
import { SendHorizonal } from "lucide-react";
import { usePathname } from "next/navigation";
import Markdown from "react-markdown";
import { api } from "../../../../convex/_generated/api";

export default function Page() {
	const id = usePathname().split("/")[2] as Id<"threads">;
	useAddUser();
	const { input, handleSubmit, handleInputChange, messages } = useChat({
		onFinish: async (msg) => {
			console.log(msg);
			console.log(messages)
			const userObj = {
				id: `user-${crypto.randomUUID()}`,
				role: "user",
				content: input,
			};
			console.log(userObj);
		},
	});
	const dbMessages = useQuery(api.threads.getThread, { threadId: id })?.messages;
	return (
		<main className="flex flex-col min-h-screen items-center justify-between overscroll-none">
			<div className="flex flex-col text-2xl w-full p-14">
				<div>
					{dbMessages?.map((msg) => {
						if (msg.role === "user") {
							return (
								<div className="flex flex-col text-end" key={`user-${msg.id}`}>
									<Markdown>{msg.content}</Markdown>
								</div>
							);
						}
						if (msg.role === "assistant") {
							return (
								<div
									className="flex flex-col gap-2 p-2 m-2 w-[50%]"
									key={`assistant-${msg.id}`}
								>
									<Markdown>{msg.content}</Markdown>
								</div>
							);
						}
					})}
				</div>
				<div>
					{messages.map((msg) => {
						if (msg.role === "user") {
							return (
								<div
									className="flex flex-col gap-2 justify-end"
									key={`user-${msg.id}`}
								>
									{msg.parts.map((part, i) => {
										switch (part.type) {
											case "text":
												return (
													<div
														className="flex flex-col gap-4 text-end"
														key={`user-${msg.id}-${i}`}
													>
														<Markdown>{part.text}</Markdown>
													</div>
												);
										}
									})}
								</div>
							);
						}
						if (msg.role === "assistant") {
							return (
								<div
									className="flex flex-col gap-2 p-2 m-2"
									key={`assistant-${msg.id}`}
								>
									{msg.parts.map((part, i) => {
										switch (part.type) {
											case "text":
												return (
													<div
														className="flex flex-col gap-4 w-[50%]"
														key={`assistant-${msg.id}-${i}`}
													>
														<Markdown>{part.text}</Markdown>
													</div>
												);
										}
									})}
								</div>
							);
						}
					})}
				</div>
			</div>
			<form onSubmit={(e) => handleSubmit(e)} className="flex flex-row gap-2 p-2 w-[75%]">
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
