import { AnimatePresence, motion, Transition } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/button';
import { ProductCard } from '@/components/product-card';
import { ViewportReveal } from '@/components/reveal';
import { InspirationSection } from '@/components/inspiration-section';
import { OrchestratedReveal } from '@/components/reveal';
import { Main } from '@/components/main';

function getMiddleIndex(arr: unknown[]) {
	const middleIndex = Math.floor(arr.length / 2);
	return middleIndex;
}

function cycle<T>(arr: T[]) {
	if (arr.length === 0) return arr;

	const lastElement = arr[arr.length - 1] as T;
	return [lastElement, ...arr.slice(0, arr.length - 1)];
}

function Hero() {
	const [images, setImages] = useState([
		'Driveway',
		'Patio',
		'Plaza',
		'Garden',
		'Pool Deck'
	]);
	const currentIndex = getMiddleIndex(images);
	const currentImage = images[currentIndex];

	useEffect(() => {
		// Set an interavl to cycle through "images" state variable after 5 seconds
		const intervalId = setInterval(() => {
			setImages(cycle(images));
		}, 5000);

		return () => clearInterval(intervalId);
	}, [images]);

	const fastTransition: Transition = {
		duration: 0.3
	};

	const slowTransition = {
		type: 'spring',
		stiffness: 100,
		damping: 20
	};

	return (
		<section className="space-y-20">
			<div className="flex flex-col items-center space-y-12">
				<OrchestratedReveal delay={0.1} asChild>
					<h1 className="text-center text-4xl">
						<span className="block">Transform Your</span>
						<AnimatePresence initial={false} mode="wait">
							<motion.span
								key={currentImage}
								transition={fastTransition}
								exit={{ y: -10, opacity: 0 }}
								className="block"
							>
								{(currentImage + '.').split('').map((char, index) => {
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
					</h1>
				</OrchestratedReveal>

				<OrchestratedReveal delay={0.2} asChild>
					<div className="flex space-x-2">
						<Button variant="primary" asChild>
							<Link scroll={false} href="/quote-builder">
								<span>Get a Quote</span>
							</Link>
						</Button>
						<Button variant="secondary" asChild>
							<Link scroll={false} href="/gallery">
								<span>Get Inspired</span>
							</Link>
						</Button>
					</div>
				</OrchestratedReveal>
			</div>

			<OrchestratedReveal delay={0.3} asChild>
				<div className="-mx-8 flex h-[55vmin] items-center justify-center space-x-4 overflow-hidden md:-mx-24 lg:-mx-32 lg:space-x-8">
					{images.map((image, index) => (
						<motion.div
							key={'picture' + image}
							className="grid aspect-square place-items-center bg-gray-200 text-2xl text-gray-300"
							layout
							transition={slowTransition}
							animate={{ opacity: 1 - Math.abs(index - currentIndex) * 0.5 }}
							style={{
								height: 100 - Math.abs(index - currentIndex) * 12.5 + '%'
							}}
						>
							{image}
						</motion.div>
					))}
				</div>
			</OrchestratedReveal>
		</section>
	);
}

function Page() {
	return (
		<>
			<Head>
				<title>Millennium Paving Stones</title>
			</Head>

			<Main className="space-y-48 !pt-24">
				{/* Hero */}
				<Hero />

				{/* Products */}
				<ViewportReveal className="flex flex-col space-y-32">
					<p className="max-w-[28ch] self-center text-center text-lg text-gray-500 md:text-xl">
						<span className="text-gray-900">Our concrete pavers</span> can turn
						your outdoor walkway, deck, patio, or plaza into a functional work
						of art.
					</p>

					<div className="flex flex-col space-y-8" data-ai-hidden>
						<ul className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-8">
							<ProductCard
								variant="display"
								name="Colonial Classic"
								startingSku={{ price: 203, unit: 'sqft' }}
								link="/product/colonial_classic"
								className="md:col-span-3"
							/>
							<ProductCard
								variant="display"
								name="Banjo"
								startingSku={{ price: 219, unit: 'sqft' }}
								link="/product/banjo"
								className="md:col-span-3"
							/>
							<ProductCard
								variant="display"
								name="Heritage Series"
								startingSku={{ price: 219, unit: 'sqft' }}
								link="/product/heritage"
								className="md:col-span-6 lg:col-span-2"
							/>
							<ProductCard
								variant="display"
								name="Cobble Mix"
								startingSku={{ price: 219, unit: 'sqft' }}
								link="/product/cobble_mix"
								className="md:col-span-3 lg:col-span-2"
							/>
							<ProductCard
								variant="display"
								name="Old World Cobble"
								startingSku={{ price: 203, unit: 'sqft' }}
								link="/product/owc"
								className="md:col-span-3 lg:col-span-2"
							/>
						</ul>
						<Button variant="secondary" className="self-center" asChild>
							<Link scroll={false} href="/products/all">
								View Product Catalogue
							</Link>
						</Button>
					</div>
				</ViewportReveal>

				{/* Inspiration */}
				<InspirationSection />

				{/* Locations */}
				<ViewportReveal
					id="where-to-buy"
					className="flex scroll-m-48 flex-col gap-8 md:flex-row md:items-center md:gap-16 lg:gap-32"
				>
					<div className="flex-1">
						<p className="text-lg">Our Locations</p>
						<h2 className="max-w-[20ch] text-3xl">Where to buy.</h2>
						<br />
						<p className="text-lg">
							We operate from two locations, namely, our manufacturing plant in
							Yallahs, St Thomas and our main office and showroom at 27 Mannings
							Hill Road, Kingston.
						</p>
						<br />
						<Button variant="primary" asChild className="w-fit">
							<Link scroll={false} href="/contact?form=quote">
								Get a Quote
							</Link>
						</Button>
					</div>

					<div className="aspect-square bg-gray-200 md:w-[30vw]" />
				</ViewportReveal>

				{/* Process */}
				<ViewportReveal
					className="flex scroll-m-16 flex-col gap-8 md:flex-row md:items-center md:gap-16 lg:gap-32"
					data-ai-hidden
				>
					<div className="flex-1 md:order-2">
						<p className="text-lg">Our Process</p>
						<h2 className="max-w-[20ch] text-3xl">Starting from zero.</h2>

						<br />

						<p className="text-lg">
							Integer a velit in sapien aliquam consectetur et vitae ligula.
							Integer ornare egestas enim a malesuada. Suspendisse arcu lectus,
							blandit nec gravida at, maximus ut lorem. Nulla malesuada vehicula
							neque at laoreet. Nullam efficitur mauris sit amet accumsan
							pulvinar.
						</p>

						<br />

						<Button variant="primary">Find an Installer</Button>
					</div>

					<div className="grid aspect-video w-full place-items-center bg-gray-200 text-center text-2xl text-gray-300 md:w-[30vw]">
						Installation Video
					</div>
				</ViewportReveal>

				{/* About */}
				<ViewportReveal className="flex scroll-m-16 flex-col gap-8 md:flex-row md:items-center md:gap-16 lg:gap-32">
					<div className="flex-1 space-y-8">
						<div>
							<p className="text-lg">About Us</p>
							<h2 className="max-w-[20ch] text-3xl">
								Millennium Paving Stones LTD.
							</h2>
							<br />
							<p className="text-lg">
								Millennium Paving Stones Limited is the largest manufacturer of
								paving stones in Jamaica, and has been in operation since 2000.
								We also manufacture stepping stones, grasscrete, curb wall and
								distribute such complementary products as sealers, cleaners and
								polymeric sand.
							</p>
						</div>
						<div className="flex gap-4">
							<Button variant="primary">
								<Link scroll={false} href="/products/all">
									Explore Products
								</Link>
							</Button>
							<Button variant="secondary">
								<Link scroll={false} href="/contact?form=quote">
									Get a Quote
								</Link>
							</Button>
						</div>
					</div>

					<div className="aspect-square bg-gray-200 md:w-[30vw]" />
				</ViewportReveal>
			</Main>
		</>
	);
}

export default Page;
