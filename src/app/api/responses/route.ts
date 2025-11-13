import { db } from "@/lib/db/client";
import { responses } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { questionId, value, sessionId } = body;

		// Validation
		if (!questionId || typeof questionId !== "string") {
			return NextResponse.json(
				{ error: "questionId is required and must be a string" },
				{ status: 400 },
			);
		}

		if (typeof value !== "number" || value < 0 || value > 100) {
			return NextResponse.json(
				{ error: "value must be a number between 0 and 100" },
				{ status: 400 },
			);
		}

		// Get user agent from headers
		const userAgent = request.headers.get("user-agent") || undefined;

		// Insert response into database
		const [result] = await db
			.insert(responses)
			.values({
				questionId,
				positionValue: value,
				sessionId: sessionId || null,
				userAgent,
			})
			.returning({ id: responses.id });

		return NextResponse.json({
			success: true,
			id: result.id,
		});
	} catch (error) {
		console.error("Error saving response:", error);
		return NextResponse.json(
			{ error: "Failed to save response" },
			{ status: 500 },
		);
	}
}
