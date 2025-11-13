"use client";

import { useCallback, useRef, useState } from "react";

interface PositionAreaProps {
	value: number | null;
	onChange: (value: number) => void;
	leftLabel: string;
	rightLabel: string;
	ticks?: number[];
}

const clamp = (value: number, min: number, max: number): number => {
	return Math.min(Math.max(value, min), max);
};

export function PositionArea({
	value,
	onChange,
	leftLabel,
	rightLabel,
	ticks = [0, 25, 50, 75, 100],
}: PositionAreaProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	const calculateValueFromPosition = useCallback((clientX: number): number => {
		if (!containerRef.current) return 50;

		const rect = containerRef.current.getBoundingClientRect();
		const x = clientX - rect.left;
		const percentage = (x / rect.width) * 100;
		return clamp(Math.round(percentage), 0, 100);
	}, []);

	const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
		const newValue = calculateValueFromPosition(e.clientX);
		onChange(newValue);
	};

	const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!isDragging) return;
		e.preventDefault();
		const newValue = calculateValueFromPosition(e.clientX);
		onChange(newValue);
	};

	const handlePointerUp = () => {
		setIsDragging(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		const currentValue = value ?? 50;
		let newValue = currentValue;

		switch (e.key) {
			case "ArrowLeft":
				e.preventDefault();
				newValue = currentValue - (e.shiftKey ? 10 : 1);
				break;
			case "ArrowRight":
				e.preventDefault();
				newValue = currentValue + (e.shiftKey ? 10 : 1);
				break;
			case "Home":
				e.preventDefault();
				newValue = 0;
				break;
			case "End":
				e.preventDefault();
				newValue = 100;
				break;
			default:
				return;
		}

		onChange(clamp(newValue, 0, 100));
	};

	const displayValue = value ?? 50;

	return (
		<div className="w-full space-y-6">
			{/* ラベル */}
			<div className="flex justify-between text-sm font-medium text-zinc-700 dark:text-zinc-300 px-2">
				<span>{leftLabel}</span>
				<span>{rightLabel}</span>
			</div>

			{/* 選択エリア */}
			<div
				ref={containerRef}
				role="slider"
				aria-label="位置を選択"
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={displayValue}
				tabIndex={0}
				className="relative h-32 w-full rounded-lg bg-teal-50 dark:bg-teal-950 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerLeave={handlePointerUp}
				onKeyDown={handleKeyDown}
			>
				{/* 目盛り */}
				{ticks.map((tick) => (
					<div
						key={tick}
						className="absolute top-0 bottom-0 w-px bg-zinc-300 dark:bg-zinc-700"
						style={{ left: `${tick}%` }}
					>
						<span className="absolute top-full mt-2 -translate-x-1/2 text-xs text-zinc-500 dark:text-zinc-400">
							{tick}
						</span>
					</div>
				))}

				{/* 選択位置マーカー */}
				<div
					className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-teal-500 border-4 border-white dark:border-teal-900 shadow-lg transition-all"
					style={{ left: `${displayValue}%` }}
					aria-hidden="true"
				/>
			</div>

			{/* 操作説明 */}
			<p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
				クリックまたはドラッグで位置を決めてください（キーボード: ← →
				キー、Shift+矢印で10ずつ移動）
			</p>

			{/* 現在値表示 */}
			<div className="text-center">
				<p className="text-sm text-zinc-600 dark:text-zinc-400">
					あなたの位置:{" "}
					<span className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
						{displayValue}
					</span>{" "}
					/ 100
				</p>
			</div>
		</div>
	);
}
