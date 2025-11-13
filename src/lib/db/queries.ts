import { eq, sql } from "drizzle-orm";
import { db } from "./client";
import { responses } from "./schema";
import type {
	Distribution,
	HistogramBucket,
	OverallStats,
	QuestionStats,
	QuestionSummary,
} from "@/types/stats";

export async function getQuestionStats(
	questionId: string,
): Promise<QuestionStats | null> {
	// Get basic stats (average, median, count)
	const [statsResult] = await db
		.select({
			avg: sql<number>`COALESCE(AVG(${responses.positionValue}), 0)`,
			median: sql<number>`COALESCE(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ${responses.positionValue}), 0)`,
			count: sql<number>`COUNT(*)`,
		})
		.from(responses)
		.where(eq(responses.questionId, questionId));

	if (!statsResult || statsResult.count === 0) {
		return null;
	}

	// Get histogram data (grouped by tens)
	const histogramData = await db
		.select({
			value: sql<number>`FLOOR(${responses.positionValue} / 10) * 10`,
			count: sql<number>`COUNT(*)`,
		})
		.from(responses)
		.where(eq(responses.questionId, questionId))
		.groupBy(sql`FLOOR(${responses.positionValue} / 10)`)
		.orderBy(sql`FLOOR(${responses.positionValue} / 10)`);

	// Calculate distribution by ranges
	const distribution: Distribution = {
		"0-20": 0,
		"21-40": 0,
		"41-60": 0,
		"61-80": 0,
		"81-100": 0,
	};

	for (const bucket of histogramData) {
		if (bucket.value >= 0 && bucket.value <= 20) {
			distribution["0-20"] += Number(bucket.count);
		} else if (bucket.value >= 21 && bucket.value <= 40) {
			distribution["21-40"] += Number(bucket.count);
		} else if (bucket.value >= 41 && bucket.value <= 60) {
			distribution["41-60"] += Number(bucket.count);
		} else if (bucket.value >= 61 && bucket.value <= 80) {
			distribution["61-80"] += Number(bucket.count);
		} else if (bucket.value >= 81 && bucket.value <= 100) {
			distribution["81-100"] += Number(bucket.count);
		}
	}

	const histogram: HistogramBucket[] = histogramData.map((item) => ({
		value: Number(item.value),
		count: Number(item.count),
	}));

	return {
		questionId,
		totalResponses: Number(statsResult.count),
		average: Math.round(Number(statsResult.avg) * 100) / 100,
		median: Math.round(Number(statsResult.median) * 100) / 100,
		distribution,
		histogram,
	};
}

export async function getOverallStats(): Promise<OverallStats> {
	// Get total response count
	const [totalResult] = await db
		.select({
			count: sql<number>`COUNT(*)`,
		})
		.from(responses);

	// Get stats per question
	const questionStatsData = await db
		.select({
			questionId: responses.questionId,
			count: sql<number>`COUNT(*)`,
			avg: sql<number>`COALESCE(AVG(${responses.positionValue}), 0)`,
		})
		.from(responses)
		.groupBy(responses.questionId);

	const questions: QuestionSummary[] = questionStatsData.map((item) => ({
		questionId: item.questionId,
		responseCount: Number(item.count),
		average: Math.round(Number(item.avg) * 100) / 100,
	}));

	return {
		totalResponses: Number(totalResult?.count || 0),
		questions,
	};
}
