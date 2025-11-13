import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
	return (
		<div className="min-h-screen">
			<header className="border-b">
				<div className="container flex h-16 items-center justify-between px-4">
					<h1 className="text-xl font-bold">Next.js + shadcn/ui</h1>
					<ThemeToggle />
				</div>
			</header>
			<main className="container px-4 py-8">
				<div className="mx-auto max-w-2xl space-y-8">
					<section className="space-y-4">
						<h2 className="text-3xl font-bold tracking-tight">
							Welcome to your new app
						</h2>
						<p className="text-muted-foreground text-lg">
							This is a Next.js application with TypeScript, Tailwind CSS v4,
							Biome, and shadcn/ui. Dark mode is now enabled! Try clicking the
							theme toggle button in the header.
						</p>
					</section>

					<section className="space-y-4">
						<h3 className="text-2xl font-semibold">Features</h3>
						<ul className="list-inside list-disc space-y-2 text-muted-foreground">
							<li>Next.js 16 with App Router</li>
							<li>TypeScript for type safety</li>
							<li>Tailwind CSS v4 for styling</li>
							<li>Biome for linting and formatting</li>
							<li>shadcn/ui components ready to use</li>
							<li>Dark mode with next-themes</li>
						</ul>
					</section>

					<section className="space-y-4">
						<h3 className="text-2xl font-semibold">Color Examples</h3>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
								<h4 className="mb-2 font-semibold">Card</h4>
								<p className="text-muted-foreground text-sm">
									This is a card component using theme colors.
								</p>
							</div>
							<div className="rounded-lg border bg-primary p-6 text-primary-foreground shadow-sm">
								<h4 className="mb-2 font-semibold">Primary</h4>
								<p className="text-sm opacity-90">
									This card uses primary colors.
								</p>
							</div>
							<div className="rounded-lg border bg-secondary p-6 text-secondary-foreground shadow-sm">
								<h4 className="mb-2 font-semibold">Secondary</h4>
								<p className="text-sm opacity-90">
									This card uses secondary colors.
								</p>
							</div>
							<div className="rounded-lg border bg-muted p-6 text-muted-foreground shadow-sm">
								<h4 className="mb-2 font-semibold">Muted</h4>
								<p className="text-sm">This card uses muted colors.</p>
							</div>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}
