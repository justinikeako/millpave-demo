import {
	AnimatePresence,
	AnimateSharedLayout,
	motion,
	Transition,
	useAnimationFrame,
	useMotionValue,
	useScroll,
	useSpring,
	useTransform,
	useVelocity,
	wrap
} from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../components/button';
import { ProductCard } from '../components/product-card';

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
	const [strings, setStrings] = useState([
		'Driveway',
		'Patio',
		'Plaza',
		'Garden',
		'Pool Deck'
	]);
	const currentIndex = getMiddleIndex(strings);

	const currentString = strings[currentIndex];

	// This effect will run every time the "strings" state variable changes
	useEffect(() => {
		// Set an interavl to cycle through "strings" state variable after 5 seconds
		const intervalId = setInterval(() => {
			setStrings(cycle(strings));
		}, 5000);

		return () => clearInterval(intervalId);
	}, [strings]);

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
				<motion.h1
					className="text-center text-4xl font-bold"
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={slowTransition}
				>
					<span className="block">Transform Your</span>
					<AnimatePresence initial={false} mode="wait">
						<motion.span
							key={currentString}
							transition={fastTransition}
							exit={{ y: -10, opacity: 0 }}
							className="block"
						>
							{(currentString + '.').split('').map((char, index) => {
								if (char === ' ') return <span key={char + index}>&nbsp;</span>;

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
				</motion.h1>

				<motion.div
					className="flex space-x-2"
					transition={{ delay: 0.1, ...slowTransition }}
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
				>
					<Button variant="primary" asChild>
						<Link href="/contact?form=quote">
							<span>Get a Quote</span>
						</Link>
					</Button>
					<Button variant="secondary" asChild>
						<Link href="/gallery">
							<span>Get Inspired</span>
						</Link>
					</Button>
				</motion.div>
			</div>

			<motion.div
				className="-mx-8 flex h-[55vmin] items-center justify-center space-x-4 overflow-hidden md:-mx-24 lg:-mx-32 lg:space-x-8"
				transition={{ delay: 0.2, ...slowTransition }}
				initial={{ y: 100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
			>
				<AnimateSharedLayout>
					{strings.map((string, index) => (
						<motion.div
							key={'picture' + string}
							className="grid aspect-square place-items-center bg-gray-200 text-2xl text-gray-300"
							layout
							transition={slowTransition}
							animate={{ opacity: 1 - Math.abs(index - currentIndex) * 0.5 }}
							style={{
								height: 100 - Math.abs(index - currentIndex) * 12.5 + '%'
							}}
						>
							{string}
						</motion.div>
					))}
				</AnimateSharedLayout>
			</motion.div>
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
				className="flex h-[40vmin] space-x-4  md:space-x-8"
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

function Page() {
	return (
		<>
			<Head>
				<title>Millennium Paving Stones</title>
			</Head>

			<main className="space-y-48 px-8 pt-16 md:px-24 lg:px-32">
				{/* Hero */}
				<Hero />

				{/* Products */}
				<section className="flex flex-col space-y-32">
					<p className="max-w-[28ch] self-center text-center font-display text-lg text-gray-500 md:text-xl">
						<span className="text-gray-900">Our concrete pavers</span> can turn
						your outdoor walkway, deck, patio, or plaza into a functional work
						of art.
					</p>

					<div className="flex flex-col space-y-8">
						<ul className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-8">
							<ProductCard
								variant="display"
								name="Colonial Classic"
								startingPrice={203}
								link="/colonial_classic?sku=grey"
								className="md:col-span-3"
							/>
							<ProductCard
								variant="display"
								name="Banjo"
								startingPrice={219}
								link="/banjo?sku=grey"
								className="md:col-span-3"
							/>
							<ProductCard
								variant="display"
								name="Heritage Series"
								startingPrice={219}
								link="/heritage?sku=regular+grey"
								className="md:col-span-6 lg:col-span-2"
							/>
							<ProductCard
								variant="display"
								name="Cobble Mix"
								startingPrice={219}
								link="/cobble_mix?sku=oblong+grey"
								className="md:col-span-3 lg:col-span-2"
							/>
							<ProductCard
								variant="display"
								name="Old World Cobble"
								startingPrice={203}
								link="/owc?sku=grey"
								className="md:col-span-3 lg:col-span-2"
							/>
						</ul>
						<Button variant="secondary" className="self-center" asChild>
							<Link href="/products">View Product Catalogue</Link>
						</Button>
					</div>
				</section>

				{/* Inspiration */}
				<section className="flex flex-col space-y-16">
					<div className="flex flex-col items-center">
						<p className="font-display text-lg">Inspiration</p>
						<h2 className="max-w-[20ch] text-center font-display text-3xl">
							Don&apos;t know where to start? Look at our best projects.
						</h2>

						<br />

						<Button variant="primary">
							<Link href="/gallery">Get Inspired</Link>
						</Button>
					</div>

					<div className="-mx-8 flex flex-col space-y-4 md:-mx-24 md:space-y-8 lg:-mx-32">
						<Marquee baseVelocity={2}>
							<div className="flex aspect-square shrink-0 bg-gray-200" />
						</Marquee>
						<Marquee baseVelocity={-2}>
							<div className="flex aspect-square shrink-0 bg-gray-200" />
						</Marquee>
					</div>
				</section>

				{/* Locations */}
				<section
					id="where-to-buy"
					className="flex scroll-m-16 flex-col gap-8 lg:flex-row lg:items-center lg:gap-32"
				>
					<div className="flex-1">
						<p className="font-display text-lg">Our Locations</p>
						<h2 className="max-w-[20ch] font-display text-3xl">
							Where to buy.
						</h2>
						<br />
						<p className="font-display text-lg">
							We operate from two locations, namely, our manufacturing plant in
							Yallahs, St Thomas and our main office and showroom at 27 Mannings
							Hill Road, Kingston.
						</p>
						<br />
						<Button variant="primary" asChild className="w-fit">
							<Link href="/contact?form=quote">Get a Quote</Link>
						</Button>
					</div>

					<div className="aspect-square bg-gray-200 lg:w-[30vw]" />
				</section>

				{/* Process */}
				<section className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-32">
					<div className="flex-1 lg:order-2">
						<p className="font-display text-lg">Our Process</p>
						<h2 className="max-w-[20ch] font-display text-3xl">
							Starting from zero.
						</h2>

						<br />

						<p className="font-display text-lg">
							Integer a velit in sapien aliquam consectetur et vitae ligula.
							Integer ornare egestas enim a malesuada. Suspendisse arcu lectus,
							blandit nec gravida at, maximus ut lorem. Nulla malesuada vehicula
							neque at laoreet. Nullam efficitur mauris sit amet accumsan
							pulvinar.
						</p>

						<br />

						<Button variant="primary">Find an Installer</Button>
					</div>

					<div className="aspect-video w-full bg-gray-200 lg:w-[30vw]"></div>
				</section>

				{/* About */}
				<section className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-32">
					<div className="flex-1 space-y-8">
						<div>
							<p className="font-display text-lg">About Us</p>
							<h2 className="max-w-[20ch] font-display text-3xl">
								Millennium Paving Stones LTD.
							</h2>
							<br />
							<p className="font-display text-lg">
								Millennium Paving Stones Limited is the largest manufacturer of
								paving stones in Jamaica, and has been in operation since 2000.
								We also manufacture stepping stones, grasscrete, curb wall and
								distribute such complementary products as sealers, cleaners and
								polymeric sand.
							</p>
						</div>
						<div className="flex gap-4">
							<Button variant="primary">
								<Link href="/products">Explore Products</Link>
							</Button>
							<Button variant="secondary">
								<Link href="/contact?form=quote">Get a Quote</Link>
							</Button>
						</div>
					</div>

					<div className="aspect-square bg-gray-200  lg:w-[30vw]" />
				</section>
			</main>
		</>
	);
}

export default Page;
