import { SplitSection } from './split';
import { Button } from '~/components/button';
import Link from 'next/link';
import { Icon } from '../icon';

export function GetAQuoteSection() {
	return (
		<SplitSection
			slot={
				<div className="flex flex-col items-center justify-center gap-2 px-6 pb-16 md:pb-0 md:pr-0 lg:pl-16">
					<div className="flex w-full flex-col overflow-hidden rounded-md shadow-lg ring-1 ring-gray-900/10 lg:w-5/6">
						<div className="flex h-8 items-center bg-gray-200 px-3 py-1.5">
							<div className="flex flex-1 justify-start gap-1">
								<div className="relative h-2.5 w-2.5 rounded-full border border-red-500 bg-red-500 bg-gradient-to-b from-white/50" />
								<div className="relative h-2.5 w-2.5 rounded-full border border-yellow-500 bg-yellow-500 bg-gradient-to-b from-white/50" />
								<div className="relative h-2.5 w-2.5 rounded-full border border-lime-500 bg-lime-500 bg-gradient-to-b from-white/50" />
							</div>

							<div className="flex h-full flex-[2_2_0%] items-center justify-center gap-px rounded-sm bg-gray-300 text-[9px] text-gray-500">
								<Icon name="lock" size={10} />
								<span className="mt-px">Quote Studio</span>
							</div>

							<div className="flex flex-1 justify-end text-gray-400">
								<Icon name="plus" size={12} />
							</div>
						</div>
						<div className="aspect-video"></div>
					</div>
					<p className="text-sm text-gray-500">Step 1: Shape & Measurements</p>
				</div>
			}
			tagline="Project Cost"
			heading="Get a quote in 3 simple steps."
			body="All you need are the dimensions of your project, and an idea of the patterns you wish to use in your space."
			actions={
				<>
					<Button asChild intent="primary" className="group">
						<Link href="/quote-studio">
							<span>Get Your Quote</span>
							<Icon
								name="arrow_right_alt"
								className="transition-transform group-focus-within:translate-x-1 group-hover:translate-x-1"
							/>
						</Link>
					</Button>
				</>
			}
		/>
	);
}
