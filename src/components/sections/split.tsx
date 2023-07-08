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
			<FullWidthSection className="flex flex-col gap-8 md:flex-row lg:gap-16">
				<div className="flex flex-col justify-center px-6 pt-16 md:order-2 md:flex-[5] md:py-32 lg:pl-0 lg:pr-16">
					<div className="max-w-sm">
						<p className="font-display text-lg">{tagline}</p>
						<h2 className="mt-2 font-display text-3xl">
							<Balancer>{heading}</Balancer>
						</h2>
						<p className="mt-6">
							<Balancer>{body}</Balancer>
						</p>
						<div className="mt-8 flex gap-2">{actions}</div>
					</div>
				</div>
				<Slot className="md:order-1 md:flex-[6]">{slot}</Slot>
			</FullWidthSection>
		</ViewportReveal>
	);
}
