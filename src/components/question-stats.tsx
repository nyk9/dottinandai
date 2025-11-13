"use client";

import { useEffect, useState } from "react";
import type { QuestionStats } from "@/types/stats";
import { Card } from "@/components/ui/card";

interface QuestionStatsProps {
	questionId: string;
	refreshKey?: number;
}

export function QuestionStatsComponent({ questionId, refreshKey }: QuestionStatsProps) {
	const [stats, setStats] = useState<QuestionStats | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchStats() {
			try {
				setLoading(true);
				console.log("Fetching stats for question:", questionId);
				const response = await fetch(`/api/stats/${questionId}`);
				console.log("Stats response status:", response.status);

				if (response.status === 404) {
					console.log("No stats found (404)");
					setStats(null);
					setError(null);
					return;
				}

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					console.error("Failed to fetch stats:", response.status, errorData);
					throw new Error(`統計の取得に失敗しました: ${errorData.error || response.statusText}`);
				}

				const data = await response.json();
				console.log("Stats data:", data);
				setStats(data);
				setError(null);
			} catch (err) {
				console.error("Error fetching stats:", err);
				setError(
					err instanceof Error ? err.message : "エラーが発生しました",
				);
			} finally {
				setLoading(false);
			}
		}

		fetchStats();
	}, [questionId, refreshKey]);

	if (loading) {
		return (
			<Card className="p-6">
				<p className="text-center text-muted-foreground">読み込み中...</p>
			</Card>
		);
	}

	if (error) {
		return (
			<Card className="p-6">
				<p className="text-center text-red-500">{error}</p>
			</Card>
		);
	}

	if (!stats || stats.totalResponses === 0) {
		return (
			<Card className="p-6">
				<p className="text-center text-muted-foreground">
					まだ統計データがありません
				</p>
			</Card>
		);
	}

	return (
		<Card className="p-6 space-y-6">
			<div>
				<h2 className="text-2xl font-medium mb-4">統計データ</h2>
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
					<div className="space-y-1">
						<p className="text-sm text-muted-foreground">総回答数</p>
						<p className="text-2xl font-bold">{stats.totalResponses}</p>
					</div>
					<div className="space-y-1">
						<p className="text-sm text-muted-foreground">平均値</p>
						<p className="text-2xl font-bold">{stats.average}</p>
					</div>
					<div className="space-y-1">
						<p className="text-sm text-muted-foreground">中央値</p>
						<p className="text-2xl font-bold">{stats.median}</p>
					</div>
				</div>
			</div>

			<div>
				<h3 className="text-lg font-medium mb-3">分布</h3>
				<div className="space-y-2">
					{Object.entries(stats.distribution).map(([range, count]) => {
						const percentage =
							stats.totalResponses > 0
								? Math.round((count / stats.totalResponses) * 100)
								: 0;
						return (
							<div key={range} className="space-y-1">
								<div className="flex justify-between text-sm">
									<span>{range}</span>
									<span>
										{count} 件 ({percentage}%)
									</span>
								</div>
								<div className="w-full bg-secondary rounded-full h-2">
									<div
										className="bg-teal-500 h-2 rounded-full transition-all"
										style={{ width: `${percentage}%` }}
									/>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<div>
				<h3 className="text-lg font-medium mb-3">ヒストグラム</h3>
				<div className="flex items-end justify-between gap-1 h-48">
					{stats.histogram.map((bucket) => {
						const maxCount = Math.max(...stats.histogram.map((b) => b.count));
						const heightPercentage = (bucket.count / maxCount) * 100;
						return (
							<div key={bucket.value} className="flex-1 flex flex-col items-center gap-1">
								<div className="w-full flex items-end justify-center h-40">
									<div
										className="w-full bg-teal-500 rounded-t transition-all"
										style={{ height: `${heightPercentage}%` }}
										title={`${bucket.value}-${bucket.value + 9}: ${bucket.count}件`}
									/>
								</div>
								<span className="text-xs text-muted-foreground">
									{bucket.value}
								</span>
							</div>
						);
					})}
				</div>
			</div>
		</Card>
	);
}
