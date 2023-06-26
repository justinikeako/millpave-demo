import React, { forwardRef } from 'react';
import Head from 'next/head';
import { ShapeStage } from '~/components/quote-stages/shape';
import { DimensionsStage } from '~/components/quote-stages/dimensions';
import { InfillStage } from '~/components/quote-stages/infill';
import { BorderStage } from '~/components/quote-stages/border';
import { ReviewStage } from '~/components/quote-stages/review';
import { Button } from '~/components/button';
import {
	useStageContext,
	StageProvider
} from '~/components/quote-stages/stage-context';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import { OrchestratedReveal } from '~/components/reveal';
import { api } from '~/utils/api';
import { pluralize } from '~/lib/utils';
import Link from 'next/link';

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
	disabled: boolean;
}>;

function StageSelector({ index, disabled, children }: StageSelectorProps) {
	const { currentStageIndex, setStageIndex, queueStageIndex } =
		useStageContext();

	const selected = currentStageIndex === index,
		completed = currentStageIndex > index;

	const shouldSubmit = !disabled && index > currentStageIndex;

	return (
		<li>
			<button
				disabled={disabled}
				{...(shouldSubmit
					? { type: 'submit', form: 'stage-form' }
					: { type: 'button' })}
				data-selected={selected || undefined}
				data-completed={completed || undefined}
				className="flex items-center gap-2 disabled:cursor-not-allowed disabled:text-gray-400 data-[completed]:font-semibold data-[selected]:font-semibold data-[selected]:text-gray-900"
				onClick={() => {
					if (shouldSubmit) queueStageIndex(index);
					else setStageIndex(index);
				}}
			>
				{children}
			</button>
		</li>
	);
}

function countConsecutiveTrueValues(arr: boolean[]): number {
	let count = 0;

	for (let i = 0; i < arr.length; i++) {
		if (arr[i]) count++;
		else break; // Exit the loop if a false value is encountered
	}

	return count - 1;
}

const stageDisplayNames = [
	'Shape',
	'Dimensions',
	'Infill',
	'Border',
	'Review Items'
];

const StageFooter = forwardRef<
	React.ElementRef<'footer'>,
	React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
	const {
		currentStageIndex,
		stagesValidity,
		setStageIndex,
		queueStageIndex,
		quote,
		setQuoteId
	} = useStageContext();

	const currentStageIsValid = stagesValidity[currentStageIndex];
	const maxValidIndex = countConsecutiveTrueValues(stagesValidity);
	const createQuote = api.quote.addItems.useMutation();

	const reachedLastStage = currentStageIndex >= maximumStageIndex;

	return (
		<footer
			{...props}
			ref={ref}
			className="sticky bottom-0 z-40 flex items-center justify-between bg-gray-100 px-16 py-4"
		>
			<nav>
				<ul className="flex select-none items-center justify-center gap-3">
					{stageDisplayNames.map((displayName, index) => (
						<React.Fragment key={'stage-selector-' + index}>
							<StageSelector
								index={index}
								disabled={
									index === 4
										? maxValidIndex < 3
										: index >
										  (currentStageIsValid ? maxValidIndex + 1 : maxValidIndex)
								}
							>
								{displayName}
							</StageSelector>
							{index < stageDisplayNames.length - 1 && (
								<li className="[li:has(:disabled)+&]:text-gray-400">
									&middot;
								</li>
							)}
						</React.Fragment>
					))}
				</ul>
			</nav>

			<div className="flex gap-2">
				<Button
					intent="secondary"
					type="button"
					disabled={currentStageIndex <= 0}
					onClick={() => setStageIndex(currentStageIndex - 1)}
				>
					Back
				</Button>
				{reachedLastStage && !createQuote.isSuccess && (
					<Button
						intent="primary"
						type="submit"
						form="stage-form"
						disabled={createQuote.isLoading}
						onClick={async () => {
							const { quoteId } = await createQuote.mutateAsync({
								items: quote.items
							});

							setQuoteId(quoteId);
						}}
					>
						Add {pluralize(quote.items.length, ['Item', 'Items'])} to Quote
					</Button>
				)}
				{reachedLastStage && createQuote.isSuccess && (
					<Button
						intent="primary"
						type="submit"
						form="stage-form"
						disabled={createQuote.isLoading}
						asChild
					>
						<Link href={`/quote/${quote.id}`}>Go to Quote #{quote.id}</Link>
					</Button>
				)}
				{!reachedLastStage && (
					<Button
						intent="primary"
						type="submit"
						form="stage-form"
						disabled={!currentStageIsValid}
						onClick={() => queueStageIndex(currentStageIndex + 1)}
					>
						Next
					</Button>
				)}
			</div>
		</footer>
	);
});

StageFooter.displayName = 'StageFooter';

const variants: Variants = {
	enter: (direction: number) => {
		return {
			x: direction > 0 ? 50 : -50,
			opacity: 0
		};
	},
	center: {
		zIndex: 1,
		x: 0,
		opacity: 1
	},
	exit: {
		zIndex: 0,
		x: 0,
		opacity: 0
	}
};

function CurrentStage() {
	const { navDirection, currentStageIndex } = useStageContext();

	const CurrentStage = stages[currentStageIndex];

	return (
		<AnimatePresence initial={false} mode="wait">
			<motion.div
				key={'stage-' + currentStageIndex}
				custom={navDirection}
				variants={variants}
				transition={{ type: 'spring', duration: 0.5 }}
				initial="enter"
				animate="center"
				exit="exit"
			>
				{CurrentStage ? <CurrentStage /> : null}
			</motion.div>
		</AnimatePresence>
	);
}

/**
 * SPEC
 * - Submit on enter 🤔
 * - Navigation must be animated ✅
 * - Allow optional stages to be skipped ✅
 * - Persist values between navigations ✅
 * - Navigation buttons should react in real time to the form's validity ✅
 * - Invalidate dependent stages when the stage they depend on changes ✅
 * - Indicate which dependent stages have become invalid once invalidated ✅
 * - Allow navigation to previous stages even if invalid ✅
 * - Allow navigation to arbitrary stages only when all are valid ✅
 */

function Page() {
	return (
		<>
			<Head>
				<title>Get a Quote — Millennium Paving Stones</title>
			</Head>

			<style jsx global>{`
				body {
					display: flex;
					flex-direction: column;
				}
			`}</style>

			<StageProvider maximumStageIndex={maximumStageIndex}>
				<OrchestratedReveal asChild delay={0.1}>
					<main className="flex flex-shrink-0 flex-grow flex-col gap-y-24 overflow-x-hidden py-24">
						<CurrentStage />
					</main>
				</OrchestratedReveal>

				<OrchestratedReveal asChild delay={0.2}>
					<StageFooter />
				</OrchestratedReveal>
			</StageProvider>
		</>
	);
}

export default Page;
