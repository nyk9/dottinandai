import type { ResponsesMap } from "@/types/question";

const STORAGE_KEY = "position-selector-responses";
const FINALIZED_KEY = "position-selector-finalized";

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

export const loadResponse = getResponse;

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

export const isResponseFinalized = (questionId: string): boolean => {
	if (typeof window === "undefined") return false;

	try {
		const data = localStorage.getItem(FINALIZED_KEY);
		const finalized = data ? JSON.parse(data) : {};
		return finalized[questionId] === true;
	} catch (error) {
		console.error("Failed to check finalized status:", error);
		return false;
	}
};

export const setResponseFinalized = (questionId: string, finalized: boolean): void => {
	if (typeof window === "undefined") return;

	try {
		const data = localStorage.getItem(FINALIZED_KEY);
		const finalizedMap = data ? JSON.parse(data) : {};
		finalizedMap[questionId] = finalized;
		localStorage.setItem(FINALIZED_KEY, JSON.stringify(finalizedMap));
	} catch (error) {
		console.error("Failed to set finalized status:", error);
	}
};
