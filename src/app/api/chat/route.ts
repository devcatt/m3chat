import { google } from "@ai-sdk/google";
import { type UIMessage, streamText } from "ai";

export async function POST(req: Request) {
	const { messages }: { messages: UIMessage[] } = await req.json();
	const result = streamText({
		model: google("gemini-2.5-flash"),
		messages,
	});
	return result.toDataStreamResponse();
};
