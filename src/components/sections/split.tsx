import { ViewportReveal } from '~/components/reveal';

type SplitSectionProps = {
	tagline: string;
	heading: string;
	body: string;
	actions: React.ReactNode;
	slot: React.ReactNode;
};

export function SplitSection({
	tagline,
	heading,
	body,
	actions,
	slot
}: SplitSectionProps) {
	return (
		<ViewportReveal asChild>
			<section className="flex">
				<div className="flex-[6]">{slot}</div>
				<div className="flex flex-[5] flex-col justify-center py-48 pr-16">
					<div className="max-w-sm">
						<p className="font-display text-lg">{tagline}</p>
						<h2 className="mt-2 font-display text-3xl">{heading}</h2>
						<p className="mt-6">{body}</p>
						<div className="mt-8 flex gap-2">{actions}</div>
					</div>
				</div>
			</section>
		</ViewportReveal>
	);
}
