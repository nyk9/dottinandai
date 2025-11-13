"use client";

import Link from "next/link";
import type { Question } from "@/types/question";

interface QuestionListProps {
	questions: Question[];
	responses: Record<string, number>;
}

export function QuestionList({ questions, responses }: QuestionListProps) {
	return (
		<div className="grid gap-4 w-full max-w-2xl">
			{questions.map((question) => {
				const hasResponse = question.id in responses;
				const responseValue = responses[question.id];

				return (
					<Link
						key={question.id}
						href={`/questions/${question.id}`}
						className="block p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all"
					>
						<h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
							{question.title}
						</h2>
						<div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400 mb-3">
							<span>{question.left}</span>
							<span>{question.right}</span>
						</div>
						{hasResponse ? (
							<div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
								<p className="text-sm text-zinc-600 dark:text-zinc-400">
									回答済み:{" "}
									<span className="font-semibold text-zinc-900 dark:text-zinc-100">
										{responseValue}
									</span>{" "}
									/ 100
								</p>
							</div>
						) : (
							<div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
								<p className="text-sm text-zinc-500 dark:text-zinc-500">
									未回答
								</p>
							</div>
						)}
					</Link>
				);
			})}
		</div>
	);
}
