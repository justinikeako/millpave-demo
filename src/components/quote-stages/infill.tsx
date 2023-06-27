import { StageForm } from './form';
import { StoneEditor } from './stone-editor';
import { Button } from '../button';
import { useStageContext } from './stage-context';
import Balancer from 'react-wrap-balancer';

export function InfillStage() {
	const {
		skippedStages,
		currentStageIndex,
		setStageIndex,
		setStageValidity,
		setStageSkipped
	} = useStageContext();

	const isSkipped = skippedStages[2];

	if (isSkipped === undefined || isSkipped === true)
		return (
			<StageForm className="space-y-8 px-32">
				<h2 className="mx-auto max-w-xs text-center font-display text-2xl">
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
							setStageValidity(currentStageIndex, true);
							setStageSkipped(currentStageIndex, true);
							setStageIndex(currentStageIndex + 1);
						}}
					>
						Skip
					</Button>
					<Button
						intent="primary"
						type="button"
						onClick={() => setStageSkipped(currentStageIndex, false)}
					>
						Add Infill
					</Button>
				</div>
			</StageForm>
		);

	return (
		<StageForm className="space-y-16 px-32">
			<h2 className="text-center font-display text-2xl">
				Add stones to your infill.
			</h2>

			<StoneEditor name="infill" dimension="2D" stageIndex={2} />
		</StageForm>
	);
}
