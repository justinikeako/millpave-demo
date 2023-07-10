import React, { useState } from 'react';
import Head from 'next/head';
import { Button } from '~/components/button';
import {
	useStageContext,
	StageProvider
} from '~/components/quote-stages/stage-context';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import { OrchestratedReveal } from '~/components/reveal';
import { api } from '~/utils/api';
import Link from 'next/link';
import { Icon } from '~/components/icon';
import { Balancer } from 'react-wrap-balancer';
import { Main } from '~/components/main';
import * as Dialog from '@radix-ui/react-dialog';
import { maximumStageIndex, stages } from '~/components/quote-stages/stages';
import { useRouter } from 'next/router';
import Image from 'next/image';

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

			<StageProvider>
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

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { duration: 0.5 } }}
							exit={{ opacity: 0, transition: { duration: 0.3 } }}
							className="absolute inset-0 -z-10 after:absolute after:inset-0  after:bg-gray-950/75"
						>
							<Image
								src="/firepit.png"
								width={765}
								height={517}
								alt="A stone firepit surrounded by paving stones"
								className="h-full w-full object-cover"
							/>
						</motion.div>

						<Dialog.Content forceMount asChild>
							<OrchestratedReveal
								delay={0.1}
								data-header-transparent
								exit={{ opacity: 0, transition: { duration: 0.3 } }}
								className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 text-gray-100"
							>
								<Dialog.Title asChild>
									<h1 className="max-w-xl text-center font-display text-2xl xs:text-3xl md:text-4xl lg:text-5xl">
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
										<Button intent="primary" backdrop="dark" className="group">
											<span>Get Started</span>
											<Icon
												name="arrow_right_alt"
												className="transition-transform group-focus-within:translate-x-1 group-hover:translate-x-1"
											/>
										</Button>
									</Dialog.Close>
									<Button asChild intent="secondary" backdrop="dark">
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
	const { currentStageIndex } = useStageContext();
	const [tuple, setTuple] = useState<[number, number]>([0, currentStageIndex]);

	if (tuple[1] !== currentStageIndex) {
		setTuple([tuple[1], currentStageIndex]);
	}

	const previousStageIndex = tuple[0];

	const direction = currentStageIndex > previousStageIndex ? 1 : -1;

	const CurrentStage = stages[currentStageIndex]?.component;

	return (
		<AnimatePresence initial={false} mode="wait" custom={direction}>
			<motion.div
				key={'stage-' + currentStageIndex}
				custom={direction}
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

function StageFooter() {
	const {
		currentStageIndex,
		stageStatus,
		getStageStatus,
		setStageIndex,
		queueStageIndex,
		quote
	} = useStageContext();
	const router = useRouter();

	const currentStageIsValid = getStageStatus(currentStageIndex).valid;
	const currentStageSkipped = getStageStatus(currentStageIndex).skipped;
	const maxValidIndex = getMaxValid(stageStatus);
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
						{stages.map(({ id, displayName }, index) => (
							<React.Fragment key={'stage-select-' + id}>
								<StageSelector
									stageIndex={index}
									disabled={
										id === 'review'
											? // Review stage is only enabled if the stages that preceed it are valid
											  maxValidIndex < 3
											: // For all other stages, only enable the following stage IF the current stage is valid
											  index >
											  (currentStageIsValid
													? maxValidIndex + 1
													: maxValidIndex)
									}
								>
									{displayName}
								</StageSelector>
								{index < maximumStageIndex && (
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
					{reachedLastStage && (
						<Button
							intent="primary"
							type="submit"
							form="stage-form"
							id="finish"
							disabled={createQuote.isLoading}
							className="flex-1 md:flex-none"
							onClick={async () => {
								const { quoteId } = await createQuote.mutateAsync({
									items: quote.items
								});

								router.push(`/quote/${quoteId}`);
							}}
						>
							{createQuote.isLoading ? (
								<>Redirecting</>
							) : (
								<>
									Finish <Icon name="arrow_right_alt" />
								</>
							)}
						</Button>
					)}
					{!reachedLastStage && (
						<Button
							intent="primary"
							type="submit"
							form="stage-form"
							className="flex-1 md:flex-none"
							disabled={!currentStageIsValid || currentStageSkipped === null}
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
	stageIndex: number;
	disabled: boolean;
}>;

function StageSelector({ stageIndex, disabled, children }: StageSelectorProps) {
	const { currentStageIndex, setStageIndex, queueStageIndex } =
		useStageContext();

	const selected = currentStageIndex === stageIndex,
		completed = currentStageIndex > stageIndex;

	const shouldSubmit = !disabled && stageIndex > currentStageIndex;

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
					if (shouldSubmit) queueStageIndex(stageIndex);
					else setStageIndex(stageIndex);
				}}
			>
				{children}
			</button>
		</li>
	);
}

function getMaxValid(arr: { valid: boolean | undefined }[]): number {
	let count = 0;

	for (let i = 0; i < arr.length; i++) {
		if (arr[i]?.valid !== false) count++;
		else break; // Exit the loop if a false value is encountered
	}

	return count - 1;
}

export default Page;
