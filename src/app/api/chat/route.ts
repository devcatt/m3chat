import { randomUUID } from "node:crypto";
import { api } from "@/../convex/_generated/api";
import type { Id } from "@/../convex/_generated/dataModel";
import { google } from "@ai-sdk/google";
import { type UIMessage, appendResponseMessages, streamText } from "ai";
import { fetchMutation, fetchQuery } from "convex/nextjs";
export async function POST(req: Request) {
	const { messages, id }: { messages: UIMessage[]; id: Id<"threads"> } = await req.json();
	const result = streamText({
		model: google("gemini-2.5-flash"),
		messages,
		onFinish: async ({ response }) => {
			const dbMessages = await fetchQuery(api.threads.getThread, {
				threadId: id,
			});
			const newMessages = appendResponseMessages({
				messages,
				responseMessages: response.messages,
			}).slice(-2);
			const allMessages = [
				...(dbMessages?.messages ?? []),
				...newMessages
					.filter((msg) => msg.content)
					.map((msg) => {
						return {
							id: msg.id || randomUUID(),
							role: msg.role,
							content: msg.content,
							createdAt:
								msg.createdAt?.toISOString() || new Date().toISOString(),
						};
					}),
			];
			await fetchMutation(api.threads.update, {
				threadId: id,
				messages: allMessages,
			})
		},
	});
	return result.toDataStreamResponse();
}
