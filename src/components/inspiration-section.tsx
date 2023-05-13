import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { Button } from './button';
import { ViewportReveal } from './reveal';

function InspirationSection() {
	const carouselRef = useRef<HTMLDivElement>(null);

	const { scrollYProgress } = useScroll({
		target: carouselRef,
		offset: ['start end', 'end start']
	});
	const x1 = useTransform(scrollYProgress, [0, 1], [150, -150]);
	const x2 = useTransform(scrollYProgress, [0, 1], [-150, 150]);

	return (
		<ViewportReveal className="space-y-16">
			<div>
				<p className="m-auto text-center font-display text-lg">Inspiration</p>

				<h2 className="mx-auto max-w-[20ch] text-center font-display text-3xl">
					Don&apos;t know where to start? Look at our best projects.
				</h2>

				<br />

				<Button asChild variant="primary" className="mx-auto w-fit">
					<Link scroll={false} href="/gallery">
						Get Inspired
					</Link>
				</Button>
			</div>

			<div
				className="-mx-8 space-y-4 overflow-hidden md:-mx-24 md:space-y-6 lg:-mx-32 lg:space-y-8"
				ref={carouselRef}
			>
				<motion.div
					className="flex h-[40vmin] justify-start gap-4 md:gap-6 lg:gap-8"
					style={{ x: x1 }}
				>
					<div className="flex aspect-square shrink-0 bg-gray-200" />
					<div className="flex aspect-square shrink-0 bg-gray-200" />
					<div className="flex aspect-square shrink-0 bg-gray-200" />
					<div className="flex aspect-square shrink-0 bg-gray-200" />
					<div className="flex aspect-square shrink-0 bg-gray-200" />
					<div className="flex aspect-square shrink-0 bg-gray-200" />
				</motion.div>
				<motion.div
					className="flex h-[40vmin] justify-end gap-4 md:gap-6 lg:gap-8"
					style={{ x: x2 }}
				>
					<div className="flex aspect-square shrink-0 bg-gray-200" />
					<div className="flex aspect-square shrink-0 bg-gray-200" />
					<div className="flex aspect-square shrink-0 bg-gray-200" />
					<div className="flex aspect-square shrink-0 bg-gray-200" />
					<div className="flex aspect-square shrink-0 bg-gray-200" />
					<div className="flex aspect-square shrink-0 bg-gray-200" />
					<div className="flex aspect-square shrink-0 bg-gray-200" />
					<div className="flex aspect-square shrink-0 bg-gray-200" />
					<div className="flex aspect-square shrink-0 bg-gray-200" />
				</motion.div>
			</div>
		</ViewportReveal>
	);
}

export { InspirationSection };
