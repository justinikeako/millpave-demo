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
import { AnimatePresence, Variants, motion } from 'framer-motion';

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
	const { currentStageIndex, setStageIndex, queueStageIndex, stagesValidity } =
		useStageContext();

	const selected = currentStageIndex === index,
		completed = currentStageIndex > index;

	const currentStageIsValid = stagesValidity[currentStageIndex];
	const currentStageIsInvalid = !currentStageIsValid;

	const allStagesValid = !stagesValidity.includes(false);

	const disabled = !(allStagesValid && stagesValidity[index])
		? (currentStageIsInvalid && index > currentStageIndex) ||
		  (currentStageIsValid && index > currentStageIndex + 1)
		: false;

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

function StageFooter() {
	const { currentStageIndex, stagesValidity, setStageIndex, queueStageIndex } =
		useStageContext();

	return (
		<footer className="sticky bottom-0 z-40 flex justify-between bg-white px-32 pb-8 pt-6">
			<nav>
				<ul className="flex select-none items-center justify-center gap-3">
					<StageSelector index={0}>Shape</StageSelector>
					<li className="[li:has(:disabled)+&]:text-gray-400">&middot;</li>
					<StageSelector index={1}>Dimensions</StageSelector>
					<li className="[li:has(:disabled)+&]:text-gray-400">&middot;</li>
					<StageSelector index={2}>Infill</StageSelector>
					<li className="[li:has(:disabled)+&]:text-gray-400">&middot;</li>
					<StageSelector index={3}>Border</StageSelector>
					<li className="[li:has(:disabled)+&]:text-gray-400">&middot;</li>
					<StageSelector index={4}>Review Items</StageSelector>
				</ul>
			</nav>

			<div className="flex gap-2">
				<Button
					variant="secondary"
					type="button"
					disabled={currentStageIndex <= 0}
					onClick={() => setStageIndex(currentStageIndex - 1)}
				>
					Back
				</Button>
				<Button
					id="next"
					variant="primary"
					type="submit"
					form="stage-form"
					disabled={
						!stagesValidity[currentStageIndex] ||
						currentStageIndex >= maximumStageIndex
					}
					onClick={() => queueStageIndex(currentStageIndex + 1)}
				>
					Next
				</Button>
			</div>
		</footer>
	);
}

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
				key={currentStageIndex}
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
					overflow-y: scroll !important;
				}

				#__next {
					height: 100% !important;
				}

				#nav-transition {
					display: flex;
					flex-direction: column;
					min-height: 100%;
				}
			`}</style>

			<header className="flex select-none items-center justify-between px-8 py-8 md:px-24 lg:px-32">
				<Link scroll={false} href="/">
					<Logo />
				</Link>

				<Link scroll={false} href="/">
					Close Editor
				</Link>
			</header>

			<StageProvider maximumStageIndex={maximumStageIndex}>
				<main className="flex flex-1 flex-col gap-y-24 overflow-x-hidden py-24">
					<CurrentStage />
				</main>
				<StageFooter />
			</StageProvider>
		</>
	);
}

export default Page;
