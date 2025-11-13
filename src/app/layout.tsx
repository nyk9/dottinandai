import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "立ち位置セレクター",
	description:
		"2択の質問に対して、あなたの立ち位置を左右の一次元ライン上で表現するアプリ",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body className="antialiased">{children}</body>
		</html>
	);
}
