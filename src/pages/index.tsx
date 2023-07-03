import {
	AnimatePresence,
	motion,
	MotionStyle,
	Transition,
	useCycle,
	useScroll,
	useTransform
} from 'framer-motion';
import Head from 'next/head';
import { Footer } from '~/components/footer';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
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

function Hero() {
	const heroRef = useRef<HTMLDivElement>(null);
	const [example, cycleExample] = useCycle(
		'Driveway',
		'Patio',
		'Plaza',
		'Garden',
		'Pool Deck'
	);

	const { scrollY, scrollYProgress } = useScroll({
		target: heroRef,
		offset: ['end end', 'end start']
	});
	const { scrollYProgress: scrollYProgressFromStart } = useScroll({
		target: heroRef,
		offset: ['start start', 'end start']
	});
	const line1Opacity = useTransform(scrollY, [50, 150], [1, 0]);
	const line2Opacity = useTransform(scrollY, [50, 200], [1, 0]);

	useEffect(() => {
		// Set an interval to cycle through examples state variable after 5 seconds
		const intervalId = setInterval(() => {
			cycleExample();
		}, 5000);

		return () => clearInterval(intervalId);
	}, [cycleExample]);

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
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.25 }}
				style={
					{
						'--scroll-progress': scrollYProgress,
						'--scroll-progress-from-start': scrollYProgressFromStart
					} as unknown as MotionStyle
				}
				className="sticky top-0 -z-10 -mt-16 h-[100lvh] w-full overflow-hidden [--gutter-x:--gutter] [--gutter-y:--gutter] [--gutter:24px] [clip-path:inset(calc(var(--gutter-y)*var(--scroll-progress))_calc(var(--gutter-x)*var(--scroll-progress))_round_calc(16px*var(--scroll-progress)))] after:absolute after:inset-0  after:bg-gray-950/75 after:opacity-[calc(1-var(--scroll-progress-from-start)*1)] lg:[--gutter:64px] 2xl:w-[100lvw] 2xl:[--gutter-x:calc(50vw-768px+64px)]"
			>
				<Image
					src="/hero.jpg"
					width={1000}
					height={747}
					alt="Picture of the author"
					className="-z-50 h-full w-full scale-[calc(1+var(--scroll-progress-from-start)*0.25)] object-cover object-center"
				/>
			</motion.div>

			<div className="mt-[-100lvh] flex h-[100lvh] items-center justify-center space-y-12">
				<motion.h1 className="text-center font-display text-5xl">
					<motion.span
						className="inline-block"
						style={{ opacity: line1Opacity }}
					>
						<OrchestratedReveal asChild delay={0.1}>
							<span className="inline-block">Transform Your</span>
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
										key={example}
										className="inline-block"
										exit={{ y: -10, opacity: 0, transition: fastTransition }}
									>
										{(example + '.').split('').map((char, index) => {
											if (char === ' ')
												return <span key={char + index}>&nbsp;</span>;

											return (
												<motion.span
													key={char + index}
													initial={{ y: 10, opacity: 0 }}
													transition={{
														delay: index / 10,
														...slowTransition
													}}
													animate={{ y: 0, opacity: 1 }}
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
						<div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
							<h2 className="font-display text-3xl">Products</h2>
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
								link="/product/colonial_classic"
								className="w-80 shrink-0 grow snap-center"
							/>
							<ProductCard
								name="Banjo"
								startingSku={{ price: 219, unit: 'sqft' }}
								link="/product/banjo"
								className="w-80 shrink-0 grow snap-center"
							/>
							<ProductCard
								name="Heritage Series"
								startingSku={{ price: 219, unit: 'sqft' }}
								link="/product/heritage"
								className="w-80 shrink-0 grow snap-center"
							/>
							<ProductCard
								name="Cobble Mix"
								startingSku={{ price: 219, unit: 'sqft' }}
								link="/product/cobble_mix"
								className="w-80 shrink-0 grow snap-center"
							/>
							<ProductCard
								name="Old World Cobble"
								startingSku={{ price: 203, unit: 'sqft' }}
								link="/product/owc"
								className="w-80 shrink-0 grow snap-center"
							/>
						</HorizontalScroller>
						<Button intent="secondary" className="mx-auto w-fit" asChild>
							<Link href="/products">View All Products</Link>
						</Button>
					</FullWidthSection>
				</ViewportReveal>

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
