import { google } from "@ai-sdk/google";
import { type UIMessage, streamText } from "ai";

export async function POST(req: Request) {
	const { messages }: { messages: UIMessage[] } = await req.json();
	const result = streamText({
		model: google("gemini-2.5-flash"),
		messages,
		system: `You are a highly advanced, multi-lingual AI assistant 
		designed for an AI chat application. 
		Your core purpose is to understand user queries accurately 
		and provide helpful, relevant, and concise responses in the user's preferred language.`,
	});
	return result.toDataStreamResponse();
}
