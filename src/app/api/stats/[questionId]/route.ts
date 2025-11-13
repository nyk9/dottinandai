import { getQuestionStats } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ questionId: string }> },
) {
	try {
		const { questionId } = await params;

		if (!questionId) {
			return NextResponse.json(
				{ error: "questionId is required" },
				{ status: 400 },
			);
		}

		const stats = await getQuestionStats(questionId);

		if (!stats) {
			return NextResponse.json(
				{ error: "No statistics found for this question" },
				{ status: 404 },
			);
		}

		return NextResponse.json(stats);
	} catch (error) {
		console.error("Error fetching question stats:", error);
		return NextResponse.json(
			{ error: "Failed to fetch statistics" },
			{ status: 500 },
		);
	}
}
