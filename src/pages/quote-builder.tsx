import React, { useState } from 'react';
import Head from 'next/head';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ShapeStage } from '@/components/quote-stages/shape';
import { DimensionsStage } from '@/components/quote-stages/dimensions';
import { FormProvider, useForm } from 'react-hook-form';
import { InfillStage } from '@/components/quote-stages/infill';
import { BorderStage } from '@/components/quote-stages/border';
import { ReviewStage } from '@/components/quote-stages/review';

type StageSelectorProps = React.PropsWithChildren<{
	index: number;
	currentStage: number;
	onClick: (newStage: number) => void;
}>;

function StageSelector({
	index,
	currentStage,
	onClick,
	children
}: StageSelectorProps) {
	const selected = currentStage === index,
		completed = currentStage > index;

	return (
		<li>
			<button
				className="flex items-center gap-2"
				onClick={() => onClick(index)}
			>
				<span
					className={cn(
						'rounded-md p-[3px] align-middle font-semibold',
						selected || completed
							? 'bg-gray-900 text-white'
							: 'border border-gray-900'
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

function Page() {
	const [stage, setStage] = useState(0);
	const methods = useForm({ defaultValues });

	return (
		<>
			<Head>
				<title>Get a Quote — Millennium Paving Stones</title>
			</Head>

			<main className="space-y-24">
				<ul className="flex items-center justify-center gap-2 bg-gray-100 px-32 py-6">
					<StageSelector
						index={0}
						currentStage={stage}
						onClick={(newStage) => setStage(newStage)}
					>
						Shape
					</StageSelector>
					<li className="h-[1px] w-8 bg-current" />
					<StageSelector
						index={1}
						currentStage={stage}
						onClick={(newStage) => setStage(newStage)}
					>
						Dimensions
					</StageSelector>
					<li className="h-[1px] w-8 bg-current" />
					<StageSelector
						index={2}
						currentStage={stage}
						onClick={(newStage) => setStage(newStage)}
					>
						Infill
					</StageSelector>
					<li className="h-[1px] w-8 bg-current" />
					<StageSelector
						index={3}
						currentStage={stage}
						onClick={(newStage) => setStage(newStage)}
					>
						Border
					</StageSelector>
					<li className="h-[1px] w-8 bg-current" />
					<StageSelector
						index={4}
						currentStage={stage}
						onClick={(newStage) => setStage(newStage)}
					>
						Review Items
					</StageSelector>
				</ul>

				<FormProvider {...methods}>
					<form onSubmit={methods.handleSubmit(onSubmit)}>
						{stage === 0 && <ShapeStage />}
						{stage === 1 && <DimensionsStage />}
						{stage === 2 && <InfillStage />}
						{stage === 3 && <BorderStage />}
						{stage === 4 && <ReviewStage />}
						<button type="button" onClick={() => setStage(stage - 1)}>
							Prev Stage
						</button>
						<button type="button" onClick={() => setStage(stage + 1)}>
							Next Stage
						</button>
						<button type="submit">Submit</button>
					</form>
				</FormProvider>
			</main>
		</>
	);
}

export default Page;
