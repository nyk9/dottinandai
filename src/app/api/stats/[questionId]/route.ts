import { getQuestionStats } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ questionId: string }> },
) {
	try {
		// Check if DATABASE_URL is set
		if (!process.env.DATABASE_URL) {
			console.error("DATABASE_URL is not set");
			return NextResponse.json(
				{ error: "Database is not configured. Please set DATABASE_URL environment variable." },
				{ status: 500 },
			);
		}

		const { questionId } = await params;

		console.log("GET /api/stats/[questionId] - Request:", questionId);

		if (!questionId) {
			return NextResponse.json(
				{ error: "questionId is required" },
				{ status: 400 },
			);
		}

		const stats = await getQuestionStats(questionId);

		console.log("GET /api/stats/[questionId] - Result:", stats);

		if (!stats) {
			console.log("No statistics found for question:", questionId);
			return NextResponse.json(
				{ error: "No statistics found for this question" },
				{ status: 404 },
			);
		}

		return NextResponse.json(stats);
	} catch (error) {
		console.error("Error fetching question stats:", error);
		const errorMessage = error instanceof Error ? error.message : "Unknown error";

		// Check for common database errors
		if (errorMessage.includes("relation") && errorMessage.includes("does not exist")) {
			return NextResponse.json(
				{ error: "Database table does not exist. Please run: npm run db:push" },
				{ status: 500 },
			);
		}

		return NextResponse.json(
			{ error: `Failed to fetch statistics: ${errorMessage}` },
			{ status: 500 },
		);
	}
}
