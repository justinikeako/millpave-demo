import { MdCheck, MdClose } from 'react-icons/md';
import { Button } from '@/components/button';
import React from 'react';
import classNames from 'classnames';
import { InfillStage } from './stages/infill';
// import { ShapeStage } from './stages/shape';
// import { DimensionsStage } from './stages/dimensions';

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
				className={classNames(
					'rounded-md font-semibold',
					completed ? 'p-0.5' : 'px-1.5',
					selected || completed
						? 'bg-gray-900 text-white'
						: 'border border-gray-900'
				)}
			>
				{completed ? <MdCheck className="text-[1.25em]" /> : index + 1}
			</span>
			<span>{children}</span>
		</li>
	);
}

export default function Page() {
	return (
		<div className="space-y-24">
			<header>
				<div className="flex items-center justify-between px-32 py-6">
					<MdClose className="text-[1.5rem]" />
					<h1 className="font-semibold">Get a quote</h1>
					<Button variant="primary">Next</Button>
				</div>
				<ul className="flex items-center justify-center gap-2 bg-gray-100 px-32 py-6">
					<StageSelector index={0} completed>
						Shape
					</StageSelector>
					<li className="h-[1px] w-8 bg-current" />
					<StageSelector index={1} selected>
						Dimensions
					</StageSelector>
					<li className="h-[1px] w-8 bg-current" />
					<StageSelector index={2}>Infill</StageSelector>
					<li className="h-[1px] w-8 bg-current" />
					<StageSelector index={3}>Border</StageSelector>
					<li className="h-[1px] w-8 bg-current" />
					<StageSelector index={4}>Review Items</StageSelector>
				</ul>
			</header>

			<InfillStage />
		</div>
	);
}
