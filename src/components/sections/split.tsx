import { ViewportReveal } from '~/components/reveal';
import { FullWidthSection } from './full-width';
import { Balancer } from 'react-wrap-balancer';

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
			<FullWidthSection className="flex flex-col lg:flex-row">
				<div className="flex flex-col justify-center px-6 pt-32 lg:order-2 lg:flex-[5] lg:py-32 lg:pl-0 lg:pr-16">
					<div className="max-w-sm">
						<p className="font-display text-lg">{tagline}</p>
						<h2 className="mt-2 font-display text-3xl">
							<Balancer>{heading}</Balancer>
						</h2>
						<p className="mt-6">{body}</p>
						<div className="mt-8 flex gap-2">{actions}</div>
					</div>
				</div>
				<div className="h-96 lg:order-1 lg:h-auto lg:flex-[6]">{slot}</div>
			</FullWidthSection>
		</ViewportReveal>
	);
}
