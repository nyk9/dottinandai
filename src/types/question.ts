export interface Question {
	id: string;
	title: string;
	left: string;
	right: string;
}

export interface Response {
	questionId: string;
	value: number; // 0-100
}

export interface ResponsesMap {
	[questionId: string]: number;
}
