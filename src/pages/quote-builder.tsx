import React from 'react';
import Head from 'next/head';
import { ReviewStage } from '@/components/quote-stages/review';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type StageSelectorProps = React.PropsWithChildren<{
	index: number;
	completed?: boolean;
	selected?: boolean;
}>;

function StageSelector({
	index,
	selected,
	completed,
	children
}: StageSelectorProps) {
	return (
		<li className="flex items-center gap-2">
			<span
				className={cn(
					'rounded-md font-semibold',
					completed ? 'p-[3px]' : 'px-1.5',
					selected || completed
						? 'bg-gray-900 text-white'
						: 'border border-gray-900'
				)}
			>
				{completed ? <Check className="h-4 w-4" strokeWidth={3} /> : index + 1}
			</span>
			<span>{children}</span>
		</li>
	);
}

function Page() {
	return (
		<>
			<Head>
				<title>Inspiration Gallery — Millennium Paving Stones</title>
			</Head>

			<div className="-mt-12 space-y-24">
				<ul className="flex items-center justify-center gap-2 bg-gray-100 px-32 py-6">
					<StageSelector index={0} completed>
						Shape
					</StageSelector>
					<li className="h-[1px] w-8 bg-current" />
					<StageSelector index={1} completed>
						Dimensions
					</StageSelector>
					<li className="h-[1px] w-8 bg-current" />
					<StageSelector index={2} completed>
						Infill
					</StageSelector>
					<li className="h-[1px] w-8 bg-current" />
					<StageSelector index={3} completed>
						Border
					</StageSelector>
					<li className="h-[1px] w-8 bg-current" />
					<StageSelector index={4} selected>
						Review Items
					</StageSelector>
				</ul>

				<ReviewStage />
			</div>
		</>
	);
}

export default Page;
