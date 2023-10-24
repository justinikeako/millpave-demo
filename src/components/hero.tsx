'use client';

import {
	type MotionStyle,
	type Transition,
	AnimatePresence,
	motion,
	useInView,
	useScroll,
	useTransform
} from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { OrchestratedReveal } from '~/components/reveal';
import Image from 'next/image';
import { FullWidthSection } from '~/components/sections/full-width';

function useCycle<T>(array: T[]) {
	const [currentIndex, setCurrentIndex] = useState(0);

	const currentElement = array[currentIndex] as T;
	const nextIndex = currentIndex === array.length - 1 ? 0 : currentIndex + 1;
	const nextElement = array[nextIndex] as T;

	const cycle = () => {
		setCurrentIndex(nextIndex);
	};

	return [currentElement, nextElement, cycle] as const;
}

const MotionImage = motion(Image);

export function Hero() {
	const useCases: { imageSrc: string; text: string }[] = [
		{ text: 'Driveway', imageSrc: '/driveway.jpg' },
		{ text: 'Patio', imageSrc: '/patio.webp' },
		{ text: 'Plaza', imageSrc: '/plaza.jpg' },
		{ text: 'Garden', imageSrc: '/garden.jpg' },
		{ text: 'Pool Deck', imageSrc: '/pool-deck.jpg' }
	];
	const cycleDuration = 5; // seconds

	const [imageLoadPriority, setImageLoadPriority] = useState(true);
	const heroRef = useRef<HTMLDivElement>(null);
	const [current, next, cycleUseCase] = useCycle(useCases);
	const { scrollY, scrollYProgress } = useScroll({
		target: heroRef,
		offset: ['end end', 'end start']
	});
	const { scrollYProgress: scrollYProgressFromStart } = useScroll({
		target: heroRef,
		offset: ['start start', 'end start']
	});

	const line1Ref = useRef<HTMLDivElement>(null);
	const line1InView = useInView(line1Ref);
	const line1Opacity = useTransform(scrollY, [50, 150], [1, 0]);
	const line2Opacity = useTransform(scrollY, [50, 200], [1, 0]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setImageLoadPriority(true);
		}, cycleDuration * 1000);

		return () => clearTimeout(timeoutId);
	}, [imageLoadPriority, cycleDuration]);

	useEffect(() => {
		let intervalId: NodeJS.Timeout;

		// Set an interval to cycle through the steps after 7.5 seconds
		if (line1InView) {
			intervalId = setInterval(() => {
				cycleUseCase();
			}, cycleDuration * 1000);
		}

		return () => clearInterval(intervalId);
	}, [cycleDuration, line1InView, cycleUseCase]);

	const fastTransition: Transition = {
		type: 'spring',
		duration: 0.5,
		bounce: 0
	};

	const slowTransition = {
		type: 'spring',
		duration: 1,
		bounce: 0
	};

	return (
		<FullWidthSection
			ref={heroRef}
			className="flex h-[150lvh] flex-col items-center text-gray-100"
			data-header-transparent
		>
			<motion.div
				style={
					{
						'--scroll-progress': scrollYProgress,
						'--scroll-progress-from-start': scrollYProgressFromStart
					} as unknown as MotionStyle
				}
				className="sticky top-0 -z-10 -mt-16 h-[100lvh] w-full overflow-hidden [--gutter-x:--gutter] [--gutter-y:--gutter] [--gutter:24px] [clip-path:inset(calc(var(--gutter-y)*var(--scroll-progress))_calc(var(--gutter-x)*var(--scroll-progress))_round_calc(16px*var(--scroll-progress)))] after:absolute  after:inset-0 after:bg-gray-950/75 after:opacity-[calc(1-var(--scroll-progress-from-start)*1)] lg:[--gutter:64px] 2xl:w-[100lvw] 2xl:[--gutter-x:calc(50vw-768px+64px)]"
			>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 1 }}
					className="relative -z-50 h-full w-full scale-[calc(1+var(--scroll-progress-from-start)*0.25)] bg-gray-900"
				>
					<Image
						key={next.imageSrc}
						fill
						src={next.imageSrc}
						alt="A large driveway paved with neutral-tone concrete pavers."
						className="invisible absolute left-0 top-0 h-full w-full bg-gray-900 object-cover object-center"
					/>
					<AnimatePresence>
						<MotionImage
							key={current.imageSrc}
							fill
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0, zIndex: 1 }}
							transition={{ duration: 1, delay: 0.25 }}
							src={current.imageSrc}
							priority={imageLoadPriority}
							fetchPriority={imageLoadPriority ? 'high' : 'auto'}
							alt="A large driveway paved with neutral-tone concrete pavers."
							className="absolute left-0 top-0 h-full w-full bg-gray-900 object-cover object-center"
						/>
					</AnimatePresence>
				</motion.div>
			</motion.div>

			<div className="mt-[-100lvh] flex h-[100lvh] items-center justify-center space-y-12">
				<motion.h1 className="text-center font-display text-5xl xs:text-6xl md:text-7xl lg:text-8xl">
					<motion.span
						className="inline-block"
						style={{ opacity: line1Opacity }}
					>
						<OrchestratedReveal asChild delay={0.1}>
							<span ref={line1Ref} className="inline-block">
								Transform Your
							</span>
						</OrchestratedReveal>
					</motion.span>
					<br />
					<motion.span
						className="inline-block"
						style={{ opacity: line2Opacity }}
					>
						<OrchestratedReveal asChild delay={0.2}>
							<span className="inline-block">
								<AnimatePresence initial={false} mode="wait">
									<motion.span
										key={current.text}
										initial={{ opacity: 1, y: 0 }}
										exit={{
											opacity: 0,
											y: '-10%',
											transition: fastTransition
										}}
										className="inline-block"
									>
										{(current.text + '.').split('').map((char, index) => {
											if (char === ' ')
												return <span key={char + index}>&nbsp;</span>;

											return (
												<motion.span
													key={index}
													initial={{ y: '25%', opacity: 0 }}
													animate={{
														y: 0,
														opacity: 1,
														transition: {
															delay: index / 10,
															...slowTransition
														}
													}}
													exit={{
														y: '-5%',
														opacity: 0,
														transition: fastTransition
													}}
													className="inline-block"
												>
													{char}
												</motion.span>
											);
										})}
									</motion.span>
								</AnimatePresence>
							</span>
						</OrchestratedReveal>
					</motion.span>
				</motion.h1>
			</div>

			<motion.div
				style={{ opacity: line1Opacity }}
				className="fixed inset-x-0 bottom-0 flex flex-col items-center"
			>
				<span className="block text-sm font-semibold">Scroll</span>
				<div className="h-2 w-[1px] bg-current" />
			</motion.div>
		</FullWidthSection>
	);
}
