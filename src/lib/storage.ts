import type { ResponsesMap } from "@/types/question";

const STORAGE_KEY = "position-selector-responses";

export const saveResponse = (questionId: string, value: number): void => {
	if (typeof window === "undefined") return;

	try {
		const responses = getResponses();
		responses[questionId] = value;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
	} catch (error) {
		console.error("Failed to save response:", error);
	}
};

export const getResponse = (questionId: string): number | null => {
	if (typeof window === "undefined") return null;

	try {
		const responses = getResponses();
		return responses[questionId] ?? null;
	} catch (error) {
		console.error("Failed to get response:", error);
		return null;
	}
};

export const getResponses = (): ResponsesMap => {
	if (typeof window === "undefined") return {};

	try {
		const data = localStorage.getItem(STORAGE_KEY);
		return data ? JSON.parse(data) : {};
	} catch (error) {
		console.error("Failed to get responses:", error);
		return {};
	}
};
