'use client';

import { StageForm } from '../components/form';
import { PatternEditor } from '../components/pattern-editor';
import { Button } from '~/components/button';
import { useStageContext } from '../components/stage-context';
import Balancer from 'react-wrap-balancer';
import { useRouter } from 'next/navigation';

export default function Page() {
	const { currentStageIndex, getStageStatus, setValidity, setSkipped } =
		useStageContext();
	const router = useRouter();

	const isSkipped = getStageStatus('/quote-studio/infill').skipped;

	if (isSkipped === null || isSkipped === true)
		return (
			<StageForm className="space-y-8">
				<h2 className="mx-auto max-w-sm text-center font-display text-3xl md:text-4xl lg:text-5xl">
					<Balancer>Would you like to add an infill?</Balancer>
				</h2>
				<p className="mx-auto max-w-sm text-center">
					<Balancer>
						An infill consists of the pavers that fill the area inside the
						border, making up the majority of the paved surface. If you only
						require edging, an infill is not required.
					</Balancer>
				</p>
				<div className="mx-auto flex w-fit gap-2">
					<Button
						intent="secondary"
						type="button"
						onClick={() => {
							setValidity(currentStageIndex, true);
							setSkipped(currentStageIndex, true);
							router.push('/quote-studio/border');
						}}
					>
						Skip
					</Button>
					<Button
						intent="primary"
						type="button"
						onClick={() => setSkipped(currentStageIndex, false)}
					>
						Add Infill
					</Button>
				</div>
			</StageForm>
		);

	return (
		<StageForm className="space-y-12">
			<h2 className="mx-auto max-w-sm text-center font-display text-3xl md:text-4xl lg:text-5xl">
				Customize your infill...
			</h2>

			<PatternEditor name="infill.contents" dimension="2D" stageIndex={2} />
		</StageForm>
	);
}
