import React, { useContext } from 'react';
import Head from 'next/head';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShapeStage } from '@/components/quote-stages/shape';
import { DimensionsStage } from '@/components/quote-stages/dimensions';
import { FormProvider, useForm } from 'react-hook-form';
import { InfillStage } from '@/components/quote-stages/infill';
import { BorderStage } from '@/components/quote-stages/border';
import { ReviewStage } from '@/components/quote-stages/review';
import { Button } from '@/components/button';
import {
	StageContext,
	useStageContext,
	StageProvider
} from '../components/stage-context';

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
	const { currentStageIndex, setCurrentStageIndex } = useContext(StageContext);

	const selected = currentStageIndex === index,
		completed = currentStageIndex > index;

	return (
		<li>
			<button
				className="flex items-center gap-2"
				// disabled={completedStages[index - 1 < 0 ? 0 : index - 1] === false}
				onClick={() => setCurrentStageIndex(index)}
			>
				<span
					className={cn(
						'rounded-md p-[3px] align-middle font-semibold',
						selected || completed
							? 'bg-gray-900 text-white'
							: 'ring-1 ring-inset ring-gray-900'
					)}
				>
					{completed ? (
						<Check className="h-4 w-4" strokeWidth={3} />
					) : (
						<span className="flex h-4 w-4 items-center justify-center">
							<span className="block leading-none">{index + 1}</span>
						</span>
					)}
				</span>
				<span>{children}</span>
			</button>
		</li>
	);
}

function Header() {
	const {
		currentStageIndex,
		incrementCurrentStageIndex,
		decrementCurrentStageIndex
	} = useContext(StageContext);

	return (
		<header>
			<div className="flex justify-between p-4">
				<Button
					variant="secondary"
					type="button"
					disabled={currentStageIndex <= 0}
					onClick={decrementCurrentStageIndex}
				>
					Prev Stage
				</Button>
				{/* <Button variant="primary" type="submit">
					Submit
				</Button> */}
				<Button
					variant="primary"
					type="button"
					disabled={currentStageIndex >= maximumStageIndex}
					onClick={incrementCurrentStageIndex}
				>
					Next Stage
				</Button>
			</div>
			<nav>
				<ul className="flex items-center justify-center gap-2 bg-gray-100 px-32 py-6">
					<StageSelector index={0}>Shape</StageSelector>
					<li className="h-[1px] w-8 bg-current" />
					<StageSelector index={1}>Dimensions</StageSelector>
					<li className="h-[1px] w-8 bg-current" />
					<StageSelector index={2}>Infill</StageSelector>
					<li className="h-[1px] w-8 bg-current" />
					<StageSelector index={3}>Border</StageSelector>
					<li className="h-[1px] w-8 bg-current" />
					<StageSelector index={4}>Review Items</StageSelector>
				</ul>
			</nav>
		</header>
	);
}

function onSubmit(values: unknown) {
	console.log(values);
}

const defaultValues = {
	shape: null,
	dimensions: {
		width: 0,
		height: 0,
		circumference: 0,
		radius: 0,
		diameter: 0,
		area: 0,
		runningFoot: 0
	},
	infill: {
		stones: []
	},
	border: {
		orientation: 'SOLDIER_ROW',
		stones: []
	}
};

function CurrentStage() {
	const { currentStageIndex } = useStageContext();

	const CurrentStage = stages[currentStageIndex];

	return CurrentStage ? <CurrentStage /> : null;
}

function Page() {
	const methods = useForm({ defaultValues });

	return (
		<>
			<Head>
				<title>Get a Quote — Millennium Paving Stones</title>
			</Head>

			<StageProvider maximumStageIndex={maximumStageIndex}>
				<FormProvider {...methods}>
					<main className="flex flex-col gap-y-24 pb-32">
						<Header />
						<CurrentStage />
					</main>
				</FormProvider>
			</StageProvider>
		</>
	);
}

export default Page;
