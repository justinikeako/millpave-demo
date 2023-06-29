import { MotionStyle, motion, useScroll } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { Button } from '../button';
import { Icon } from '../icon';
import { ViewportReveal } from '../reveal';
import { FullWidthSection } from './full-width';
import { Balancer } from 'react-wrap-balancer';

function InspirationSection() {
	const carouselRef = useRef<HTMLDivElement>(null);

	const { scrollYProgress } = useScroll({
		target: carouselRef,
		offset: ['start end', 'end start']
	});

	return (
		<ViewportReveal className="space-y-16 px-6 py-16 lg:px-16" asChild>
			<FullWidthSection>
				<div className="space-y-4">
					<p className="m-auto text-center font-display text-lg">
						Inspiration Gallery
					</p>

					<h2 className=" mx-auto max-w-3xl text-center font-display text-3xl">
						<Balancer>
							Don&apos;t know where to start? Explore our best projects
						</Balancer>
					</h2>

					<br />

					<Button asChild intent="primary" className="group mx-auto w-fit">
						<Link href="/gallery">
							<span>Get Inspired</span>

							<Icon
								name="arrow_right_alt"
								className="transition-transform group-focus-within:translate-x-1 group-hover:translate-x-1"
							/>
						</Link>
					</Button>
				</div>

				<div
					className="relative -mx-6 flex overflow-x-hidden before:absolute before:left-0 before:z-[1] before:-mr-4 before:h-full before:w-6 before:shrink-0 before:bg-gradient-to-r before:from-gray-100 after:absolute after:right-0 after:z-[1] after:-ml-4 after:h-full after:w-6 after:shrink-0 after:bg-gradient-to-l after:from-gray-100 lg:-mx-16 lg:before:w-16 lg:after:w-16"
					ref={carouselRef}
				>
					<motion.div
						className="flex h-64 w-fit shrink-0 translate-x-[calc(50vw-var(--scroll-progress)*67%)] justify-start gap-4 md:gap-6 lg:h-96 lg:translate-x-[calc(50vw-var(--scroll-progress)*67%)] lg:gap-8"
						style={{ '--scroll-progress': scrollYProgress } as MotionStyle}
					>
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
