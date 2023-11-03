'use client';

import { useRouter } from 'next/navigation';
import { useStageContext } from './stage-context';
import { api } from '~/trpc/react';
import { Button } from '~/components/button';
import { Icon } from '~/components/icon';
import React from 'react';
import Link from 'next/link';
import { maximumStageIndex, stages } from './stages';

export function StageFooter() {
	const { currentStageIndex, stageStatus, getStageStatus, quote } =
		useStageContext();
	const router = useRouter();

	const nextStage = stages.at(currentStageIndex + 1);

	const highestValidIndex = getHighestValidIndex(stageStatus);

	const currentStageIsValid = getStageStatus(currentStageIndex).valid;
	const currentStageSkipped = getStageStatus(currentStageIndex).skipped;
	const createQuote = api.quote.addItems.useMutation();

	return (
		<footer className="fixed inset-x-0 bottom-0 z-10 -mt-px border-t  border-gray-500/5 bg-gray-100 bg-gray-100/90 before:absolute before:inset-0 before:-z-10 before:backdrop-blur-sm">
			<div className="flex h-16 items-center justify-between px-6 2xl:container lg:px-16">
				<nav className="hidden md:block">
					<ul className="flex select-none items-center justify-center gap-3">
						{stages
							.filter((stage) => !stage.hidden)
							.map(({ pathname, displayName }) => {
								const index = stages.findIndex(
									(stage) => stage.pathname === pathname
								);

								return (
									<React.Fragment key={pathname}>
										<StageSelector
											pathname={pathname}
											selected={currentStageIndex === index}
											completed={currentStageIndex > index}
											disabled={
												pathname === '/quote-studio/configure'
													? // Only enabled the configure stage if all prior stages are valid
													  highestValidIndex < maximumStageIndex - 1
													: // Otherwise only enable the next stage IF the current stage is valid
													  index >
													  (currentStageIsValid
															? highestValidIndex + 1
															: highestValidIndex)
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
								);
							})}
					</ul>
				</nav>

				<div className="flex flex-1 justify-end gap-2">
					<Button
						intent="secondary"
						type="button"
						className="flex-1 md:flex-none"
						disabled={currentStageIndex <= 0}
						onClick={() => router.back()}
					>
						Back
					</Button>
					{!nextStage && (
						<Button
							intent="primary"
							type="submit"
							form="stage-form"
							id="finish"
							disabled={createQuote.isLoading}
							className="flex-1 focus:outline md:flex-none"
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
					{nextStage && (
						<Button
							intent="primary"
							type="submit"
							form="stage-form"
							className="flex-1 md:flex-none"
							disabled={!currentStageIsValid || currentStageSkipped === null}
							asChild
						>
							<Link href={nextStage.pathname}>Next</Link>
						</Button>
					)}
				</div>
			</div>
		</footer>
	);
}

type StageSelectorProps = React.PropsWithChildren<{
	pathname: string;
	disabled: boolean;
	selected: boolean;
	completed: boolean;
}>;

function StageSelector({
	pathname,
	selected,
	completed,
	disabled,
	children
}: StageSelectorProps) {
	return (
		<li>
			<Link
				href={pathname}
				data-selected={selected || undefined}
				data-completed={completed || undefined}
				data-disabled={disabled || undefined}
				className="flex items-center gap-2 data-[disabled]:cursor-not-allowed data-[completed]:font-semibold data-[selected]:font-semibold data-[disabled]:text-gray-400 data-[selected]:text-gray-900"
			>
				{children}
			</Link>
		</li>
	);
}

function getHighestValidIndex(arr: { valid: boolean | undefined }[]): number {
	let count = 0;

	for (const item of arr) {
		if (item?.valid !== false) count++;
		else break; // Exit the loop if a false value is encountered
	}

	return count - 1;
}
