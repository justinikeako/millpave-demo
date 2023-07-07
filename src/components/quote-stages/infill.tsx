import { StageForm } from './form';
import { StoneEditor } from './stone-editor';
import { Button } from '../button';
import { useStageContext } from './stage-context';
import Balancer from 'react-wrap-balancer';

export function InfillStage() {
	const {
		currentStageIndex,
		getStageStatus,
		setStageIndex,
		setValidity,
		setSkipped
	} = useStageContext();

	const isSkipped = getStageStatus('infill').skipped;

	if (isSkipped === null || isSkipped === true)
		return (
			<StageForm className="space-y-8">
				<h2 className="mx-auto max-w-sm text-center font-display text-2xl">
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
							setStageIndex(currentStageIndex + 1);
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
			<h2 className="mx-auto max-w-sm text-center font-display text-2xl">
				Customize your infill...
			</h2>

			<StoneEditor name="infill" dimension="2D" stageIndex={2} />
		</StageForm>
	);
}
