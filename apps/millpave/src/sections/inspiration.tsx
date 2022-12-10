import {
	motion,
	useAnimationFrame,
	useMotionValue,
	useScroll,
	useSpring,
	useTransform,
	useVelocity,
	wrap
} from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { Button } from '../components/button';

function InspirationSection() {
	return (
		<section className="flex flex-col space-y-16">
			<div className="flex flex-col items-center">
				<p className="font-display text-lg">Inspiration</p>
				<h2 className="max-w-[20ch] text-center font-display text-3xl">
					Don&apos;t know where to start? Look at our best projects.
				</h2>

				<br />

				<Button variant="primary" asChild>
					<Link href="/gallery">Get Inspired</Link>
				</Button>
			</div>

			<div className="-mx-8 space-y-4 md:-mx-24 md:space-y-6 lg:-mx-32 lg:space-y-8">
				<Marquee baseVelocity={2}>
					<div className="flex aspect-square shrink-0 bg-gray-200" />
				</Marquee>
				<Marquee baseVelocity={-2}>
					<div className="flex aspect-square shrink-0 bg-gray-200" />
				</Marquee>
			</div>
		</section>
	);
}

type MarqueeProps = React.PropsWithChildren<{
	baseVelocity: number;
}>;

function Marquee({ children, baseVelocity = 100 }: MarqueeProps) {
	const baseX = useMotionValue(0);
	const { scrollY } = useScroll();
	const scrollVelocity = useVelocity(scrollY);
	const smoothVelocity = useSpring(scrollVelocity, {
		damping: 50,
		stiffness: 400
	});
	const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
		clamp: false
	});

	/**
	 * This is a magic wrapping for the length of the text - you
	 * have to replace for wrapping that works for you or dynamically
	 * calculate
	 */
	const x = useTransform(baseX, (v) => `${wrap(0, -44.5, v)}%`);

	const directionFactor = useRef<number>(1);
	useAnimationFrame((t, delta) => {
		let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

		/**
		 * This is what changes the direction of the scroll once we
		 * switch scrolling directions.
		 */
		if (velocityFactor.get() < 0) {
			directionFactor.current = -1;
		} else if (velocityFactor.get() > 0) {
			directionFactor.current = 1;
		}

		moveBy += directionFactor.current * moveBy * velocityFactor.get();

		baseX.set(baseX.get() + moveBy);
	});

	/**
	 * The number of times to repeat the child text should be dynamically calculated
	 * based on the size of the text and viewport. Likewise, the x motion value is
	 * currently wrapped between -20 and -45% - this 25% is derived from the fact
	 * we have four children (100% / 4). This would also want deriving from the
	 * dynamically generated number of children.
	 */
	return (
		<div className=" overflow-hidden">
			<motion.div
				className="flex h-[40vmin] gap-4 md:gap-6 lg:gap-8"
				style={{ x }}
			>
				{children}
				{children}
				{children}
				{children}
				{children}
				{children}
				{children}
			</motion.div>
		</div>
	);
}

export { InspirationSection };
