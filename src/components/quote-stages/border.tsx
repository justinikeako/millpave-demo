import * as Select from '~/components/select';
import { StageForm } from './form';
import { Controller, useFormContext } from 'react-hook-form';
import { StoneEditor } from './stone-editor';
import { StoneProject } from '~/types/quote';
import { calculateRunningFoot, unitDisplayNameDictionary } from '~/lib/utils';
import { useStageContext } from './stage-context';
import { Button } from '../button';
import Balancer from 'react-wrap-balancer';

export function BorderStage() {
	const {
		skippedStages,
		currentStageIndex,
		setStageIndex,
		setStageValidity,
		setStageSkipped
	} = useStageContext();
	const { watch } = useFormContext<StoneProject>();

	const hasStones = watch('border.stones').length > 0;
	const isSkipped = skippedStages[3];
	const infillStageIsSkipped = skippedStages[2];

	if (
		infillStageIsSkipped === false &&
		((!hasStones && isSkipped === undefined) || isSkipped === true)
	)
		return (
			<StageForm className="space-y-8 px-32">
				<h2 className="text-center text-2xl">Add a border.</h2>
				<p className="mx-auto max-w-sm text-center">
					<Balancer ratio={1}>
						A border consists of the pavers that create a defined edge or
						boundary around the paved area.
					</Balancer>
				</p>
				<div className="mx-auto flex w-fit gap-2">
					<Button
						variant="secondary"
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
						variant="primary"
						type="button"
						onClick={() => setStageSkipped(currentStageIndex, false)}
					>
						Add Border
					</Button>
				</div>
			</StageForm>
		);

	return (
		<StageForm className="space-y-16 px-32">
			<h2 className="text-center text-2xl">Add stones to your border.</h2>

			<BorderOptions />

			<StoneEditor name="border.stones" dimension="1D" stageIndex={3} />
		</StageForm>
	);
}

function BorderOptions() {
	const { register, watch, control, setValue } = useFormContext<StoneProject>();

	const runningLengthUnit = watch('border.runningLength.unit');

	return (
		<div className="flex flex-wrap justify-center gap-4">
			<div className="max-w-xs flex-1 space-y-4">
				<label htmlFor="border.runningLength.value" className="font-semibold">
					Running Length
				</label>
				<label
					htmlFor="border.runningLength.value"
					className="flex w-full rounded-md bg-gray-200 p-4"
				>
					<input
						type="number"
						id="border.runningLength.value"
						step="any"
						{...register('border.runningLength.value', { min: 0.01 })}
						readOnly={runningLengthUnit === 'auto'}
						className="no-arrows w-full flex-1 bg-transparent outline-none read-only:text-gray-400"
						placeholder="Amount"
					/>

					<Controller
						control={control}
						name="border.runningLength.unit"
						render={(runningLengthUnit) => (
							<Select.Root
								value={runningLengthUnit.field.value}
								onValueChange={(value) => {
									if (value === 'auto') {
										setValue(
											'border.runningLength.value',
											calculateRunningFoot(watch('shape'), watch('dimensions'))
										);
									}

									runningLengthUnit.field.onChange(value);
								}}
							>
								<Select.Trigger basic />

								<Select.Content>
									<Select.ScrollUpButton />
									<Select.Viewport>
										<Select.Item value="auto">auto (ft)</Select.Item>
										<Select.Item value="ft">
											{unitDisplayNameDictionary['ft'][0]}
										</Select.Item>
										<Select.Item value="in">
											{unitDisplayNameDictionary['in'][0]}
										</Select.Item>
										<Select.Item value="m">
											{unitDisplayNameDictionary['m'][0]}
										</Select.Item>
										<Select.Item value="cm">
											{unitDisplayNameDictionary['cm'][0]}
										</Select.Item>
									</Select.Viewport>
									<Select.ScrollDownButton />
								</Select.Content>
							</Select.Root>
						)}
					/>
				</label>
			</div>

			<div className="max-w-xs flex-1 space-y-4">
				<label className="font-semibold">Stone Orientation</label>

				<Controller
					control={control}
					name="border.orientation"
					render={(borderOrientation) => (
						<Select.Root
							value={borderOrientation.field.value}
							onValueChange={borderOrientation.field.onChange}
						>
							<Select.Trigger className="w-full !rounded-md" />

							<Select.Content>
								<Select.ScrollUpButton />
								<Select.Viewport>
									<Select.Item value="SOLDIER_ROW">Soldier Row</Select.Item>
									<Select.Item value="TIP_TO_TIP">Tip to Tip</Select.Item>
								</Select.Viewport>
								<Select.ScrollDownButton />
							</Select.Content>
						</Select.Root>
					)}
				/>
			</div>
		</div>
	);
}
