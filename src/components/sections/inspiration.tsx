import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { Button } from '../button';
import { ViewportReveal } from '../reveal';
import { FullWidthSection } from './full-width';

function InspirationSection() {
	const carouselRef = useRef<HTMLDivElement>(null);

	const { scrollYProgress } = useScroll({
		target: carouselRef,
		offset: ['start end', 'end start']
	});
	const offset = useTransform(scrollYProgress, [0, 1], [150, -150]);

	return (
		<ViewportReveal className="space-y-16 p-16" asChild>
			<FullWidthSection>
				<div className="space-y-4">
					<p className="m-auto text-center font-display text-lg">
						Inspiration Gallery
					</p>

					<h2 className=" mx-auto max-w-3xl text-center font-display text-3xl">
						Don&apos;t know where to start? Explore our best projects
					</h2>

					<br />

					<Button asChild intent="primary" className="mx-auto w-fit">
						<Link href="/gallery">
							<span>Get Inspired</span>
						</Link>
					</Button>
				</div>

				<div className="-mx-16 overflow-x-hidden" ref={carouselRef}>
					<motion.div
						className="flex h-96 justify-start gap-4 md:gap-6 lg:gap-8"
						style={{ x: offset }}
					>
						<div className="flex aspect-video shrink-0 bg-gray-200" />
						<div className="flex aspect-video shrink-0 bg-gray-200" />
						<div className="flex aspect-video shrink-0 bg-gray-200" />
						<div className="flex aspect-video shrink-0 bg-gray-200" />
					</motion.div>
				</div>
			</FullWidthSection>
		</ViewportReveal>
	);
}

export { InspirationSection };
