import React from 'react';
import Head from 'next/head';
import { ShapeStage } from '@/components/quote-stages/shape';
import { DimensionsStage } from '@/components/quote-stages/dimensions';
import { InfillStage } from '@/components/quote-stages/infill';
import { BorderStage } from '@/components/quote-stages/border';
import { ReviewStage } from '@/components/quote-stages/review';
import { Button } from '@/components/button';
import {
	useStageContext,
	StageProvider
} from '@/components/quote-stages/stage-context';
import Link from 'next/link';
import { Logo } from '@/components/logo';

const stages = [
	ShapeStage,
	DimensionsStage,
	InfillStage,
	BorderStage,
	ReviewStage
];

const maximumStageIndex = stages.length - 1;

type StageSelectorProps = React.PropsWithChildren<{
	index: number;
}>;

function StageSelector({ index, children }: StageSelectorProps) {
	const { currentStageIndex, queueStageIndex } = useStageContext();

	const selected = currentStageIndex === index,
		completed = currentStageIndex > index;

	return (
		<li>
			<button
				data-selected={selected || undefined}
				data-completed={completed || undefined}
				type="submit"
				form="stage-form"
				className="flex items-center gap-2 text-gray-500 data-[completed]:font-semibold data-[selected]:font-semibold data-[selected]:text-gray-900"
				onClick={() => queueStageIndex(index)}
			>
				{children}
			</button>
		</li>
	);
}

function StageFooter() {
	const { currentStageIndex, queueStageIndex } = useStageContext();

	return (
		<footer className="sticky bottom-0 z-40 flex justify-between bg-white px-32 pb-8 pt-6">
			<nav>
				<ul className="flex items-center justify-center gap-3">
					<StageSelector index={0}>Shape</StageSelector>
					<li>&middot;</li>
					<StageSelector index={1}>Dimensions</StageSelector>
					<li>&middot;</li>
					<StageSelector index={2}>Infill</StageSelector>
					<li>&middot;</li>
					<StageSelector index={3}>Border</StageSelector>
					<li>&middot;</li>
					<StageSelector index={4}>Review Items</StageSelector>
				</ul>
			</nav>

			<div className="flex gap-2">
				<Button
					variant="secondary"
					type="submit"
					form="stage-form"
					disabled={currentStageIndex <= 0}
					onClick={() => queueStageIndex(currentStageIndex - 1)}
				>
					Back
				</Button>
				<Button
					variant="primary"
					type="submit"
					form="stage-form"
					disabled={currentStageIndex >= maximumStageIndex}
					onClick={() => queueStageIndex(currentStageIndex + 1)}
				>
					Next
				</Button>
			</div>
		</footer>
	);
}

function CurrentStage() {
	const { currentStageIndex } = useStageContext();

	const CurrentStage = stages[currentStageIndex];

	return CurrentStage ? <CurrentStage /> : null;
}

function Page() {
	return (
		<div className="flex min-h-full flex-col">
			<Head>
				<title>Get a Quote — Millennium Paving Stones</title>
			</Head>

			<header className="flex select-none items-center justify-between px-8 py-8 md:px-24 lg:px-32">
				<Link href="/">
					<Logo />
				</Link>

				<Link href="/">Close Editor</Link>
			</header>

			<StageProvider maximumStageIndex={maximumStageIndex}>
				<main className="flex flex-1 flex-col gap-y-24 py-24">
					<CurrentStage />
				</main>
				<StageFooter />
			</StageProvider>
		</div>
	);
}

export default Page;
