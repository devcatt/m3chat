"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { examplePrompts } from "@/lib/example-prompts";
import useAddUser from "@/lib/use-add-user";
import { useUser } from "@clerk/nextjs";
import { SendHorizonal } from "lucide-react";
import { useChat } from "@ai-sdk/react";

function ExamplePrompts() {
	return (
		<div className="flex flex-row gap-2 justify-center items-center">
			{Object.values(examplePrompts).map(
				(category: string[], index: number) => (
					<Popover key={index}>
						<PopoverTrigger
							className={`cursor-pointer ${buttonVariants({ variant: "secondary" })}`}
						>
							{Object.keys(examplePrompts)[index]}
						</PopoverTrigger>
						<PopoverContent
							className="flex flex-col"
						>
							{" "}
							{/* hidden is for a random bug: when you entered an example prompt it would leave the ui in a corner */}
							{category.map((prompt: string, index: number) => (
								<Button
									key={index}
									variant={"link"}
									className="cursor-pointer"
									onClick={(e) => console.log(e.currentTarget.value)}
								>
									{prompt}
								</Button>
							))}
						</PopoverContent>
					</Popover>
				),
			)}
		</div>
	);
};

export default function Home() {
	const { messages, input, handleSubmit, handleInputChange } = useChat();
	const { user } = useUser();
	useAddUser();
	return (
		<main className="flex flex-col min-h-screen items-center justify-between">
			<div className="flex flex-col text-2xl w-full">
				<div className="flex flex-col my-10 mx-10">
					{messages.map(msg => {
						switch(msg.role) {
							case "user":
								return (
									<div key={msg.id} className="flex justify-end">
										{msg.parts.map((part, i) => {
											switch (part.type) {
												case "text": 
												return <div key={`${msg.id}-${i}`}>{part.text}</div>
											}
										})}
									</div>
								)
							case "assistant":
								return (
									<div key={msg.id} className="flex justify-start">
										{msg.parts.map((part, i) => {
											switch (part.type) {
												case "text": 
												return <div key={`${msg.id}-${i}`}>{part.text}</div>
											}
										})}
									</div>
								)
							default:
								return null
						}
					})}
				</div>
				<div hidden={messages.length > 0}>
					<div className="m-2 text-center items-center flex flex-col">
						{user?.fullName ? `How can I help you, ${user?.fullName}?` : "How can I help you?"}
						{user?.fullName && <span className="font-bold">{user?.fullName}</span>}
						&nbsp;
					</div>
					<ExamplePrompts />
				</div>
			</div>
			<form onSubmit={handleSubmit} className="flex flex-row container gap-2 my-4">
				<Input
					placeholder="Ask something..."
					className="flex-grow"
					value={input}
					onChange={handleInputChange}
				/>
				<Button type="submit" className="cursor-pointer">
					<SendHorizonal />
				</Button>
			</form>
		</main>
	);
};
