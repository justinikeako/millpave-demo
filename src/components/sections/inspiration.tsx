import Link from 'next/link';
import { useRef } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { ViewportReveal } from '../reveal';
import { FullWidthSection } from './full-width';
import { Balancer } from 'react-wrap-balancer';
import Image from 'next/image';

function InspirationSection() {
	const carouselRef = useRef<HTMLAnchorElement>(null);

	return (
		<ViewportReveal className="space-y-16 px-6 py-16 lg:px-16" asChild>
			<FullWidthSection>
				<div className="space-y-4">
					<p className="m-auto text-center font-display text-lg md:text-xl">
						Inspiration Gallery
					</p>

					<h2 className="mx-auto max-w-3xl text-center font-display text-4xl md:text-5xl xl:text-6xl">
						<Balancer>
							Don&apos;t know where to start? Explore our best projects
						</Balancer>
					</h2>

					<br />

					<Button asChild intent="primary" className="group mx-auto w-fit">
						<Link href="/inspiration">
							<span>Get Inspired</span>

							<Icon
								name="arrow_right_alt"
								className="transition-transform group-focus-within:translate-x-1 group-hover:translate-x-0.5"
							/>
						</Link>
					</Button>
				</div>

				<Link
					href="/inspiration"
					// Purely visual duplicate link. Not designed to be accessible
					tabIndex={-1}
					className="relative -mx-6 flex overflow-hidden before:absolute before:left-0 before:z-[1] before:-mr-4 before:h-full before:w-6 before:shrink-0 before:bg-gradient-to-r before:from-gray-100 after:absolute after:right-0 after:z-[1] after:-ml-4 after:h-full after:w-6 after:shrink-0 after:bg-gradient-to-l after:from-gray-100 lg:-mx-16 lg:before:w-16 lg:after:w-16"
					ref={carouselRef}
				>
					<div className="flex flex-none animate-marquee justify-start gap-4 pr-4 md:gap-6 md:pr-6 lg:pr-8 2xl:gap-8">
						<div className="relative aspect-video h-48 flex-none bg-gray-200 md:h-64 lg:h-96">
							<Image
								fill
								src="/inspo-0.png"
								alt="Paving stones Patio"
								className="object-cover"
								sizes="(max-width: 480px) 90vw, (max-width: 768px) 60vw, (max-width: 1536px) 33vw"
							/>
						</div>
						<div className="relative aspect-video h-48 flex-none bg-gray-200 md:h-64 lg:h-96">
							<Image
								fill
								src="/inspo-1.png"
								alt="Paving stones Patio"
								className="object-cover"
								sizes="(max-width: 480px) 90vw, (max-width: 768px) 50vw, (max-width: 1536px) 33vw"
							/>
						</div>
						<div className="relative aspect-video h-48 flex-none bg-gray-200 md:h-64 lg:h-96">
							<Image
								fill
								src="/inspo-2.png"
								alt="Paving stones Patio"
								className="object-cover"
								sizes="(max-width: 480px) 90vw, (max-width: 768px) 50vw, (max-width: 1536px) 33vw"
							/>
						</div>
					</div>
					<div className="flex flex-none animate-marquee justify-start gap-4 pr-4 md:gap-6 md:pr-6 lg:gap-8 lg:pr-8">
						<div className="relative aspect-video h-48 flex-none bg-gray-200 md:h-64 lg:h-96">
							<Image
								fill
								src="/inspo-0.png"
								alt="Paving stones Patio"
								className="object-cover"
								sizes="(max-width: 480px) 90vw, (max-width: 768px) 50vw, (max-width: 1536px) 33vw"
							/>
						</div>
						<div className="relative aspect-video h-48 flex-none bg-gray-200 md:h-64 lg:h-96">
							<Image
								fill
								src="/inspo-1.png"
								alt="Paving stones Patio"
								className="object-cover"
								sizes="(max-width: 480px) 90vw, (max-width: 768px) 50vw, (max-width: 1536px) 33vw"
							/>
						</div>
						<div className="relative aspect-video h-48 flex-none bg-gray-200 md:h-64 lg:h-96">
							<Image
								fill
								src="/inspo-2.png"
								alt="Paving stones Patio"
								className="object-cover"
								sizes="(max-width: 480px) 90vw, (max-width: 768px) 50vw, (max-width: 1536px) 33vw"
							/>
						</div>
					</div>
				</Link>
			</FullWidthSection>
		</ViewportReveal>
	);
}

export { InspirationSection };
