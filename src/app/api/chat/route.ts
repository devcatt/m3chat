import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
	const { messages } = await req.json();

	const result = streamText({
		// idea here, get value from a select in the / form, (it has to be the specific like gpt-4o-mini) and do openai(model)
		model: openai("gpt-4o-mini"),
		messages,
	});

	return result.toDataStreamResponse();
}
