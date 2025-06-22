"use client";

import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";

const openaiModels = {
	"o3-mini": {
		fn: openai("o3-mini"),
		name: "o3-mini",
	},
	"o3": {
		fn: openai("o3"),
		name: "o3",
	},
	"4o-mini": {
		fn: openai("gpt-4o-mini"),
		name: "4o-mini",
	},
	"4o": {
		fn: openai("gpt-4o"),
		name: "4o",
	},
};

const googleModels = {
	"2.5-flash": {
		fn: google("gemini-2.5-flash-preview-04-17"),
		name: "gemini-2.5-flash-preview-04-17",
	},
	"2.0-pro": {
		fn: google("gemini-2.5-pro-exp-03-25"),
		name: "gemini-2.5-pro-exp-03-25",
	},
	"2.0-flash": {
		fn: google("gemini-2.0-flash"),
		name: "gemini-2.0-flash",
	},
};

export const models = [
	...Object.keys(openaiModels),
	...Object.keys(googleModels),
];
