'use client';

import { AnimatePresence, motion, Transition } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '../components/button';

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
				<motion.h1
					className="text-center text-4xl font-bold"
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.1, ...slowTransition }}
				>
					<span className="block">Transform Your</span>
					<AnimatePresence initial={false} mode="wait">
						<motion.span
							key={currentImage}
							transition={fastTransition}
							exit={{ y: -10, opacity: 0 }}
							className="block"
						>
							{(currentImage + '.').split('').map((char, index) => {
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
					transition={{ delay: 0.2, ...slowTransition }}
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
				transition={{ delay: 0.3, ...slowTransition }}
				initial={{ y: 100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
			>
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
			</motion.div>
		</section>
	);
}

export { Hero };
