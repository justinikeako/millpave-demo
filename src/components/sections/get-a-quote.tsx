import { SplitSection } from './split';
import { Button } from '~/components/button';
import Link from 'next/link';
import { Icon } from '../icon';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

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

export function GetAQuoteSection() {
	const [current, next, cycleStep] = useCycle([
		{ index: 0, id: 'shape', name: 'Shape & Measurements' },
		{ index: 1, id: 'infill', name: 'Infill Pattern' },
		{ index: 2, id: 'border', name: 'Border Pattern' }
	]);

	const slotRef = useRef<HTMLDivElement>(null);
	const slotInView = useInView(slotRef);

	useEffect(() => {
		let intervalId: NodeJS.Timer;

		// Set an interval to cycle through the steps after 7.5 seconds
		if (slotInView) {
			intervalId = setInterval(() => {
				cycleStep();
			}, 7500);
		}

		return () => clearInterval(intervalId);
	}, [slotInView, cycleStep]);

	return (
		<SplitSection
			slot={
				<div
					ref={slotRef}
					className="flex flex-col items-center justify-center gap-3 overflow-hidden px-6 sm:overflow-visible md:pr-0 lg:pl-16"
				>
					<Link
						href="/quote-studio"
						tabIndex={-1}
						className="flex w-full flex-col overflow-hidden rounded-md shadow-lg ring-1 ring-gray-900/5 lg:w-5/6"
					>
						<div className="flex h-7 items-center bg-gray-200 px-3 py-1">
							<div className="flex flex-1 justify-start gap-1">
								<div className="relative h-2.5 w-2.5 rounded-full border border-red-500 bg-red-500 bg-gradient-to-b from-white/50" />
								<div className="relative h-2.5 w-2.5 rounded-full border border-yellow-500 bg-yellow-500 bg-gradient-to-b from-white/50" />
								<div className="relative h-2.5 w-2.5 rounded-full border border-lime-500 bg-lime-500 bg-gradient-to-b from-white/50" />
							</div>

							<div className="flex h-full flex-1 grow-[3] items-center justify-center gap-px rounded-sm bg-gray-300 text-[9px] text-gray-500">
								<Icon name="lock" size={10} />
								<span className="mt-px">Quote Studio</span>
							</div>

							<div className="flex flex-1 justify-end text-gray-400">
								<Icon name="plus" size={14} />
							</div>
						</div>
						<div className="relative flex aspect-video w-full text-2xl text-black/20">
							<Image
								key={next.id}
								fill
								src={`/quote-studio-stages/${next.id}.jpg`}
								alt="A large driveway paved with neutral-tone concrete pavers."
								className="absolute left-0 top-0 h-full w-full object-cover object-center opacity-0"
							/>
							<AnimatePresence initial={false} mode="popLayout">
								<MotionImage
									fill
									key={current.id}
									alt={current.name}
									src={`/quote-studio-stages/${current.id}.jpg`}
									sizes="(max-width: 480px) 90vw, (max-width: 768px) 45vw, (max-width: 1536px) 33vw"
									initial={{ x: '100%' }}
									animate={{ x: 0 }}
									exit={{ x: '-100%' }}
									transition={{ type: 'spring', duration: 1.5, bounce: 0 }}
									className="flex h-full w-full shrink-0 items-center justify-center bg-gray-100 object-contain p-4 text-center"
								/>
							</AnimatePresence>
						</div>
					</Link>
					<AnimatePresence initial={false} mode="wait">
						<motion.p
							key={current.id}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
							className="block whitespace-nowrap text-center text-sm text-gray-500"
						>
							Step {current.index + 1}: {current.name}
						</motion.p>
					</AnimatePresence>
				</div>
			}
			tagline="Quote Studio"
			heading="Get a quote in 3 simple steps."
			body="All you need are the dimensions of your project, and an idea of the patterns you wish to use in your space."
			actions={
				<Button asChild intent="primary" className="group">
					<Link href="/quote-studio">
						<span>Get Your Quote</span>
						<Icon
							name="arrow_right_alt"
							className="transition-transform group-focus-within:translate-x-1 group-hover:translate-x-1"
						/>
					</Link>
				</Button>
			}
		/>
	);
}
