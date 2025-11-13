"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PositionArea } from "@/components/PositionArea";
import { questions } from "@/data/questions";
import { getResponse, saveResponse } from "@/lib/storage";

export default function QuestionPage() {
	const params = useParams();
	const router = useRouter();
	const questionId = params.id as string;

	const question = questions.find((q) => q.id === questionId);
	const [value, setValue] = useState<number | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		const savedValue = getResponse(questionId);
		setValue(savedValue);
		setIsLoaded(true);
	}, [questionId]);

	if (!question) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
						質問が見つかりませんでした
					</h1>
					<Link
						href="/"
						className="inline-block px-6 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
					>
						トップに戻る
					</Link>
				</div>
			</div>
		);
	}

	const handleChange = (newValue: number) => {
		setValue(newValue);
		saveResponse(questionId, newValue);
	};

	if (!isLoaded) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
				<div className="text-zinc-600 dark:text-zinc-400">読み込み中...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
			<div className="max-w-3xl mx-auto">
				{/* ヘッダー */}
				<div className="mb-8">
					<Link
						href="/"
						className="inline-flex items-center text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-4"
					>
						<svg
							className="w-4 h-4 mr-1"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>戻る</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						質問一覧に戻る
					</Link>
					<h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
						{question.title}
					</h1>
				</div>

				{/* 選択エリア */}
				<div className="bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-sm border border-zinc-200 dark:border-zinc-800">
					<PositionArea
						value={value}
						onChange={handleChange}
						leftLabel={question.left}
						rightLabel={question.right}
					/>
				</div>

				{/* アクション */}
				<div className="mt-8 flex justify-center">
					<button
						type="button"
						onClick={() => router.push("/")}
						className="px-8 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors shadow-sm"
					>
						完了
					</button>
				</div>
			</div>
		</div>
	);
}
