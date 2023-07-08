import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue
} from '~/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { StageForm } from './form';
import { Controller, useFormContext } from 'react-hook-form';
import { StoneEditor } from './stone-editor';
import { BorderOrientation, StoneProject } from '~/types/quote';
import { calculateRunningFoot, unitDisplayNameDictionary } from '~/lib/utils';
import { useStageContext } from './stage-context';
import { Button } from '../button';
import Balancer from 'react-wrap-balancer';
import { Icon } from '../icon';

export function BorderStage() {
	const {
		getStageStatus,
		currentStageIndex,
		setStageIndex,
		setValidity,
		setSkipped
	} = useStageContext();
	const { watch } = useFormContext<StoneProject>();

	const hasStones = watch('border.stones').length > 0;
	const isSkipped = getStageStatus('border').skipped;
	const infillStageIsSkipped = getStageStatus('infill').skipped;

	if (
		infillStageIsSkipped === false &&
		((!hasStones && isSkipped === null) || isSkipped === true)
	)
		return (
			<StageForm className="space-y-8">
				<h2 className="mx-auto max-w-sm text-center font-display text-2xl">
					<Balancer>Would you like to add a border?</Balancer>
				</h2>
				<p className="mx-auto max-w-sm text-center">
					<Balancer>
						A border consists of the pavers that create a defined edge or
						boundary around the paved area.
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
						Add Border
					</Button>
				</div>
			</StageForm>
		);

	return (
		<StageForm className="space-y-12">
			<h2 className="mx-auto max-w-sm text-center font-display text-2xl">
				Customize your border...
			</h2>

			<BorderOptions />

			<StoneEditor name="border.stones" dimension="1D" stageIndex={3} />
		</StageForm>
	);
}

function BorderOptions() {
	const { register, watch, control, setValue } = useFormContext<StoneProject>();

	const runningLengthUnit = watch('border.runningLength.unit');
	const measurementsUnit = watch('measurements.unit');
	const inheritedUnitDisplayName =
		unitDisplayNameDictionary[measurementsUnit][0];
	return (
		<div className="flex flex-wrap justify-center gap-4">
			<div className="min-w-full flex-1 space-y-2 xs:min-w-0 xs:max-w-sm">
				<div className="flex gap-2">
					<label htmlFor="border.runningLength.value" className="font-semibold">
						Running Length
					</label>

					<Popover>
						<PopoverTrigger asChild>
							<Button type="button" intent="tertiary" className="-m-1 p-1">
								<span className="sr-only">Help</span>
								<Icon name="help" />
							</Button>
						</PopoverTrigger>

						<PopoverContent>
							Running length is a fancy term for the length of your border. By
							default your running length is calculated based on the
							measurements you specified. If you would like to edit this value
							manually, you can do so by&nbsp;
							<label htmlFor="border.runningLength.unit" className="underline">
								selecting another unit.
							</label>
						</PopoverContent>
					</Popover>
				</div>
				<div className="flex h-12 w-full rounded-sm border border-gray-400 bg-gray-50 outline-2 -outline-offset-2 outline-pink-700 focus-within:outline">
					<input
						type="number"
						id="border.runningLength.value"
						step="any"
						{...register('border.runningLength.value', { min: 0.01 })}
						readOnly={runningLengthUnit === 'auto'}
						className="no-arrows h-full w-full flex-1 bg-transparent pl-3 outline-none placeholder:text-gray-500 read-only:text-gray-400"
						placeholder="Amount"
					/>

					<Controller
						control={control}
						name="border.runningLength.unit"
						render={(runningLengthUnit) => (
							<Select
								value={runningLengthUnit.field.value}
								onValueChange={(value: 'auto' | 'inherit') => {
									if (value === 'auto') {
										setValue(
											'border.runningLength.value',
											calculateRunningFoot(
												watch('shape'),
												watch('measurements')
											)
										);
									}

									runningLengthUnit.field.onChange(value);
								}}
							>
								<SelectTrigger
									unstyled
									className="h-full pr-3"
									id="border.runningLength.unit"
								>
									<SelectValue />
								</SelectTrigger>

								<SelectContent>
									<SelectItem value="auto">
										auto ({inheritedUnitDisplayName})
									</SelectItem>
									<SelectItem value="inherit">
										{inheritedUnitDisplayName}
									</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
				</div>
			</div>

			<div className="min-w-full flex-1 space-y-2 xs:min-w-0 xs:max-w-sm">
				<label className="font-semibold">Stone Orientation</label>

				<Controller
					control={control}
					name="border.orientation"
					render={(borderOrientation) => (
						<Select
							value={borderOrientation.field.value}
							onValueChange={(value: BorderOrientation) =>
								borderOrientation.field.onChange(value)
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>

							<SelectContent>
								<SelectItem value="SOLDIER_ROW">Soldier Row</SelectItem>
								<SelectItem value="TIP_TO_TIP">Tip to Tip</SelectItem>
							</SelectContent>
						</Select>
					)}
				/>
			</div>
		</div>
	);
}
