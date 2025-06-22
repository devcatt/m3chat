"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { examplePrompts } from "@/lib/example-prompts";
import useAddUser from "@/lib/use-add-user";
import { useChat } from "@ai-sdk/react";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";

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
						<PopoverContent className="flex flex-col gap-2 w-full">
							{" "}
							{category.map((prompt: string, index: number) => (
								<Button
									key={index}
									variant={"link"}
									className="cursor-pointer"
									onClick={() => console.log(prompt)}
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
}

export default function Home() {
	const { messages, input, handleSubmit, handleInputChange } = useChat();
	const { user } = useUser();
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
					<ExamplePrompts />
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
}
