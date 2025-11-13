import { getOverallStats } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const stats = await getOverallStats();
		return NextResponse.json(stats);
	} catch (error) {
		console.error("Error fetching overall stats:", error);
		return NextResponse.json(
			{ error: "Failed to fetch statistics" },
			{ status: 500 },
		);
	}
}
