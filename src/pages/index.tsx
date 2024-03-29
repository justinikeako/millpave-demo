import {
	AnimatePresence,
	motion,
	MotionStyle,
	Transition,
	useInView,
	useScroll,
	useTransform
} from 'framer-motion';
import Head from 'next/head';
import { Footer } from '~/components/footer';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Balancer } from 'react-wrap-balancer';
import { Button } from '~/components/button';
import { ProductCard } from '~/components/product-card';
import { OrchestratedReveal, ViewportReveal } from '~/components/reveal';
import { AugmentedRealityGallerySection } from '~/components/sections/ar-gallery';
import { InspirationSection } from '~/components/sections/inspiration';
import { LocationsSection } from '~/components/sections/locations';
import { LearnSection } from '~/components/sections/learn';
import { Main } from '~/components/main';
import { FullWidthSection } from '~/components/sections/full-width';
import { HorizontalScroller } from '~/components/horizontal-scroller';
import Image from 'next/image';
import { GetAQuoteSection } from '~/components/sections/get-a-quote';

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
function Hero() {
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

function Page() {
	return (
		<>
			<Head>
				<title>Millennium Paving Stones</title>
			</Head>

			<Main>
				<Hero />

				<ViewportReveal asChild>
					<FullWidthSection className="space-y-8 p-6 lg:space-y-12 lg:p-16">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<h2 className="font-display text-4xl sm:text-6xl md:text-6xl">
								Products
							</h2>
							<p className="w-80 self-end text-right font-display text-lg">
								<Balancer>
									Our concrete pavers can turn your outdoor walkway, deck,
									patio, or plaza into a functional work of art.
								</Balancer>
							</p>
						</div>
						<HorizontalScroller className="gap-4" snap>
							<ProductCard
								name="Colonial Classic"
								startingSku={{ price: 203, unit: 'sqft' }}
								productId="colonial_classic"
								className="w-80 shrink-0 grow snap-center"
							/>
							<ProductCard
								name="Banjo"
								startingSku={{ price: 219, unit: 'sqft' }}
								productId="banjo"
								className="w-80 shrink-0 grow snap-center"
							/>
							<ProductCard
								name="Heritage Series"
								startingSku={{ price: 219, unit: 'sqft' }}
								productId="heritage"
								className="w-80 shrink-0 grow snap-center"
							/>
							<ProductCard
								name="Cobble Mix"
								startingSku={{ price: 219, unit: 'sqft' }}
								productId="cobble_mix"
								className="w-80 shrink-0 grow snap-center"
							/>
							<ProductCard
								name="Old World Cobble"
								startingSku={{ price: 203, unit: 'sqft' }}
								productId="owc"
								className="w-80 shrink-0 grow snap-center"
							/>
						</HorizontalScroller>
						<Button intent="secondary" className="mx-auto w-fit" asChild>
							<Link href="/products">View All Products</Link>
						</Button>
					</FullWidthSection>
				</ViewportReveal>

				<GetAQuoteSection />
				<InspirationSection />

				<LocationsSection />

				<LearnSection />

				<AugmentedRealityGallerySection />
			</Main>

			<Footer />
		</>
	);
}

export default Page;
