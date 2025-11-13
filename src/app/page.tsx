"use client";

import { useEffect, useState } from "react";
import { QuestionList } from "@/components/QuestionList";
import { questions } from "@/data/questions";
import { getResponses } from "@/lib/storage";

export default function Home() {
	const [responses, setResponses] = useState<Record<string, number>>({});
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		setResponses(getResponses());
		setIsLoaded(true);
	}, []);

	if (!isLoaded) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
				<div className="text-zinc-600 dark:text-zinc-400">読み込み中...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
			<div className="max-w-4xl mx-auto">
				<header className="mb-12 text-center">
					<h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
						立ち位置セレクター
					</h1>
					<p className="text-lg text-zinc-600 dark:text-zinc-400">
						質問に対するあなたの考えを、左右の一次元ライン上で表現してください
					</p>
				</header>

				<main className="flex justify-center">
					<QuestionList questions={questions} responses={responses} />
				</main>
			</div>
		</div>
	);
}
