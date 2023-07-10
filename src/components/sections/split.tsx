import { ViewportReveal } from '~/components/reveal';
import { FullWidthSection } from './full-width';
import { Balancer } from 'react-wrap-balancer';
import { Slot } from '@radix-ui/react-slot';

type SplitSectionProps = {
	tagline: string;
	heading: string;
	body: string;
	actions: React.ReactNode;
	slot: React.ReactElement;
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
			<FullWidthSection className="flex flex-col gap-4 sm:flex-row sm:gap-2 md:gap-4 lg:gap-16">
				<div className="flex flex-col justify-center px-6 pt-16 sm:order-2 sm:flex-[5] sm:py-32 lg:pl-0 lg:pr-16">
					<div className="max-w-sm xl:max-w-md">
						<p className="font-display text-lg">{tagline}</p>
						<h2 className="mt-2 font-display text-4xl md:text-5xl xl:text-6xl">
							<Balancer>{heading}</Balancer>
						</h2>
						<p className="mt-6">
							<Balancer>{body}</Balancer>
						</p>
						<div className="mt-8 flex gap-2">{actions}</div>
					</div>
				</div>
				<Slot className="sm:order-1 sm:flex-[6]">{slot}</Slot>
			</FullWidthSection>
		</ViewportReveal>
	);
}
