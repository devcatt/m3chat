"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { useUser } from "@clerk/nextjs";
import { SendHorizonal } from "lucide-react";
import { usePathname } from "next/navigation";
import type { Id } from "../../convex/_generated/dataModel";
import { useAddUser } from "@/hooks/use-add-user";

export default function Home() {
	const { messages, input, handleSubmit, handleInputChange } = useChat();
	const { user } = useUser();
	const threadId = usePathname().split("/")[2] as Id<"threads">;
	if (!threadId) return;
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
				<div hidden={messages.length > 0 || input.length > 0}>
					<div className="m-2 text-center items-center flex flex-col">
						{user?.fullName ? (
							<div>
								How can I help you,{" "}
								<span className="font-bold">{user?.fullName}</span>?{" "}
							</div>
						) : (
							"How can I help you?"
						)}
					</div>
				</div>
			</div>
			<form onSubmit={handleSubmit} className="flex flex-row gap-2 p-2">
				<Input
					placeholder="Enter your message..."
					onChange={handleInputChange}
					value={input}
					className="w-full"
				/>
				<Button
					type="submit"
					className="cursor-pointer flex items-center w-auto"
				>
					<SendHorizonal />
				</Button>
			</form>
		</main>
	);
};
