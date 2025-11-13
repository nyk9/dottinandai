export interface Distribution {
	"0-20": number;
	"21-40": number;
	"41-60": number;
	"61-80": number;
	"81-100": number;
}

export interface HistogramBucket {
	value: number;
	count: number;
}

export interface QuestionStats {
	questionId: string;
	totalResponses: number;
	average: number;
	median: number;
	distribution: Distribution;
	histogram: HistogramBucket[];
}

export interface QuestionSummary {
	questionId: string;
	responseCount: number;
	average: number;
}

export interface OverallStats {
	totalResponses: number;
	questions: QuestionSummary[];
}
