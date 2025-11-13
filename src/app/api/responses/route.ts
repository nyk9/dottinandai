import { db } from "@/lib/db/client";
import { responses } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		// Check if DATABASE_URL is set
		if (!process.env.DATABASE_URL) {
			console.error("DATABASE_URL is not set");
			return NextResponse.json(
				{ error: "Database is not configured. Please set DATABASE_URL environment variable." },
				{ status: 500 },
			);
		}

		const body = await request.json();
		const { questionId, value, sessionId } = body;

		console.log("POST /api/responses - Request:", { questionId, value, sessionId });

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

		console.log("POST /api/responses - Success:", result);

		return NextResponse.json({
			success: true,
			id: result.id,
		});
	} catch (error) {
		console.error("Error saving response:", error);
		const errorMessage = error instanceof Error ? error.message : "Unknown error";

		// Check for common database errors
		if (errorMessage.includes("relation") && errorMessage.includes("does not exist")) {
			return NextResponse.json(
				{ error: "Database table does not exist. Please run: npm run db:push" },
				{ status: 500 },
			);
		}

		return NextResponse.json(
			{ error: `Failed to save response: ${errorMessage}` },
			{ status: 500 },
		);
	}
}
