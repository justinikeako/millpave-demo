import React, { useState } from 'react';
import Head from 'next/head';
import { ShapeStage } from '~/components/quote-stages/shape';
import { MeasurementsStage } from '~/components/quote-stages/measurements';
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
import { Icon } from '~/components/icon';
import { Balancer } from 'react-wrap-balancer';
import { Main } from '~/components/main';
import * as Dialog from '@radix-ui/react-dialog';

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
	const [showSplashScreen, setShowSplashScreen] = useState(true);

	return (
		<>
			<Head>
				<title>Get a Quote — Millennium Paving Stones</title>
			</Head>

			<style jsx global>{`
				body {
					height: 100%;
				}

				header {
					position: fixed !important;
					left: 0;
					right: 0;
					pointer-events: auto !important;
				}
			`}</style>

			<StageProvider maximumStageIndex={maximumStageIndex}>
				<Main className="flex min-h-full flex-col justify-center gap-y-24 overflow-x-hidden py-32">
					<SplashScreen
						open={showSplashScreen}
						onOpenChange={setShowSplashScreen}
					/>
					{!showSplashScreen && (
						<OrchestratedReveal delay={0.1}>
							<CurrentStage />
						</OrchestratedReveal>
					)}
				</Main>

				{!showSplashScreen && <StageFooter />}
			</StageProvider>
		</>
	);
}

function SplashScreen({
	open,
	onOpenChange
}: {
	open: boolean;
	onOpenChange(open: boolean): void;
}) {
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<AnimatePresence>
				{open && (
					<>
						<Dialog.Overlay />
						<Dialog.Content forceMount asChild>
							<OrchestratedReveal
								delay={0.1}
								exit={{ opacity: 0, transition: { duration: 0.3 } }}
								className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-gray-100"
							>
								<Dialog.Title asChild>
									<h1 className="max-w-xl text-center font-display text-2xl">
										<Balancer>
											Get a quote for your paving project in under 5 minutes.
										</Balancer>
									</h1>
								</Dialog.Title>
								<p className="max-w-xs text-center">
									<Balancer>
										Just enter your project&apos;s measurements, select your
										patterns, and get your quote! Yes, it&apos;s that easy.
									</Balancer>
								</p>
								<div className="flex flex-wrap justify-center gap-2">
									<Dialog.Close asChild>
										<Button intent="primary">
											<span>Get Started</span>
											<Icon
												name="arrow_right_alt"
												className="transition-transform group-focus-within:translate-x-1 group-hover:translate-x-1"
											/>
										</Button>
									</Dialog.Close>
									<Button asChild intent="secondary">
										<Link href="/">Return to Home Page</Link>
									</Button>
								</div>
							</OrchestratedReveal>
						</Dialog.Content>
					</>
				)}
			</AnimatePresence>
		</Dialog.Root>
	);
}

const stages = [
	ShapeStage,
	MeasurementsStage,
	InfillStage,
	BorderStage,
	ReviewStage
];

const variants: Variants = {
	enter: (direction: number) => ({
		x: direction > 0 ? 50 : -50,
		opacity: 0,
		transition: { type: 'spring', duration: 0.5, bounce: 0 }
	}),
	center: {
		x: 0,
		opacity: 1,
		zIndex: 1,
		transition: { type: 'spring', duration: 0.5, bounce: 0 }
	},
	exit: (direction: number) => ({
		x: direction > 0 ? -50 : 50,
		opacity: 0,
		zIndex: 0,
		transition: { type: 'spring', duration: 0.5, bounce: 0 }
	})
};

function CurrentStage() {
	const { navDirection, currentStageIndex } = useStageContext();

	const CurrentStage = stages[currentStageIndex];

	return (
		<AnimatePresence initial={false} mode="wait" custom={navDirection}>
			<motion.div
				key={'stage-' + currentStageIndex}
				custom={navDirection}
				variants={variants}
				initial="enter"
				animate="center"
				exit="exit"
			>
				{CurrentStage ? <CurrentStage /> : null}
			</motion.div>
		</AnimatePresence>
	);
}

const maximumStageIndex = stages.length - 1;

const stageDisplayNames = [
	'Shape',
	'Dimensions',
	'Infill',
	'Border',
	'Review Items'
];

function StageFooter() {
	const {
		currentStageIndex,
		stagesValidity,
		skippedStages,
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
		<footer className="fixed inset-x-0 bottom-0 z-10 -mt-px border-t  border-gray-500/5 bg-gray-100 bg-gray-100/90 before:absolute before:inset-0 before:-z-10 before:backdrop-blur-sm">
			<OrchestratedReveal
				delay={0.2}
				className="flex h-16 items-center justify-between px-6 2xl:container lg:px-16"
			>
				<nav className="hidden md:block">
					<ul className="flex select-none items-center justify-center gap-3">
						{stageDisplayNames.map((displayName, index) => (
							<React.Fragment key={'stage-selector-' + index}>
								<StageSelector
									index={index}
									disabled={
										index === 4
											? maxValidIndex < 3
											: index >
											  (currentStageIsValid
													? maxValidIndex + 1
													: maxValidIndex)
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

				<div className="flex flex-1 justify-end gap-2">
					<Button
						intent="secondary"
						type="button"
						className="flex-1 md:flex-none"
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
							className="flex-1 md:flex-none"
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
							className="flex-1 md:flex-none"
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
							className="flex-1 md:flex-none"
							disabled={
								!currentStageIsValid ||
								skippedStages[currentStageIndex] === null
							}
							onClick={() => queueStageIndex(currentStageIndex + 1)}
						>
							Next
						</Button>
					)}
				</div>
			</OrchestratedReveal>
		</footer>
	);
}

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

export default Page;
