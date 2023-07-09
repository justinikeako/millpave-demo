import { SplitSection } from './split';
import { Button } from '~/components/button';
import Link from 'next/link';
import { Icon } from '../icon';
import { AnimatePresence, motion, useCycle, useInView } from 'framer-motion';
import { useEffect } from 'react';

export function GetAQuoteSection() {
	const [step, cycleStep] = useCycle(
		{ index: 0, name: 'Shape & Measurements' },
		{ index: 1, name: 'Infill Pattern' },
		{ index: 2, name: 'Border Pattern' }
	);

	useEffect(() => {
		// Set an interval to cycle through examples state variable after 5 seconds
		const intervalId = setInterval(() => {
			cycleStep();
		}, 10000);

		return () => clearInterval(intervalId);
	}, [cycleStep]);

	return (
		<SplitSection
			slot={
				<div className="flex flex-col items-center justify-center gap-3 overflow-hidden px-6 pb-16 md:pb-0 md:pr-0 lg:pl-16">
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
							<AnimatePresence initial={false} mode="popLayout">
								<motion.div
									key={'step-image-' + step.index}
									initial={{ x: '100%' }}
									animate={{ x: 0 }}
									exit={{ x: '-100%' }}
									transition={{ type: 'spring', duration: 1, bounce: 0 }}
									className="flex h-full w-full shrink-0 items-center justify-center bg-gray-100 p-4 text-center"
								>
									{step.name}
								</motion.div>
							</AnimatePresence>
						</div>
					</Link>
					<AnimatePresence initial={false} mode="popLayout">
						<motion.p
							key={'step-caption-' + step.index}
							initial={{ x: '100%', opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: '-100%', opacity: 0 }}
							transition={{ type: 'spring', duration: 1.25, bounce: 0 }}
							className="block whitespace-nowrap text-center  text-sm text-gray-500"
						>
							Step {step.index + 1}: {step.name}
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
