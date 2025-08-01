"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddUser } from "@/hooks/use-add-user";
import { useChat } from "@ai-sdk/react";
import { SendHorizonal } from "lucide-react";
import Markdown from "react-markdown";
import { usePathname } from "next/navigation";
import type { Id } from "@/../convex/_generated/dataModel";
import { appendResponseMessages } from "ai";

export default function Page() {
	useAddUser();
	const { input, handleSubmit, handleInputChange, messages } = useChat({
		id: usePathname().split("/")[2] as Id<"threads">
	});
	return (
		<main className="flex flex-col min-h-screen items-center justify-between overscroll-none">
			<div className="flex flex-col text-2xl w-full p-14">
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
			<form onSubmit={handleSubmit} className="flex flex-row gap-2 p-2 w-[75%]">
				<Input
					onChange={handleInputChange}
					value={input}
					className="flex w-full"
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
}
