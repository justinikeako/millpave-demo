import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select';
import { useFormContext, Controller, Path } from 'react-hook-form';
import { StoneProject, Unit1D, Unit2D } from '~/types/quote';
import { StageForm } from './form';
import {
	calculateRunningFoot,
	unitDisplayNameDictionary,
	roundFractionDigits
} from '~/lib/utils';
import { useState } from 'react';

function UnitSelect() {
	const { control } = useFormContext<StoneProject>();

	return (
		<div className="max-w-xs flex-1 space-y-2">
			<label className="font-semibold" htmlFor="measurements.unit">
				Unit
			</label>
			<Controller
				name="measurements.unit"
				control={control}
				rules={{ required: true }}
				render={({ field }) => (
					<Select
						value={field.value}
						onValueChange={(value: Unit1D) => field.onChange(value)}
					>
						<SelectTrigger id="measurements.unit">
							<SelectValue />
						</SelectTrigger>

						<SelectContent>
							<SelectItem value="ft">
								{unitDisplayNameDictionary['ft'][0]}
							</SelectItem>
							<SelectItem value="in">
								{unitDisplayNameDictionary['in'][0]}
							</SelectItem>
							<SelectItem value="m">
								{unitDisplayNameDictionary['m'][0]}
							</SelectItem>
							<SelectItem value="cm">
								{unitDisplayNameDictionary['cm'][0]}
							</SelectItem>
						</SelectContent>
					</Select>
				)}
			/>
		</div>
	);
}

type MeasurementInputProps = React.PropsWithChildren<{
	fieldName: Path<StoneProject>;
	label: string;
	placeholder?: string;
	dimension?: '1D' | '2D';
	required?: boolean;
}>;

function MeasurementInput({
	fieldName,
	label,
	placeholder,
	required,
	dimension = '1D'
}: MeasurementInputProps) {
	const { register, watch, setValue } = useFormContext<StoneProject>();

	return (
		<div className="max-w-xs flex-1 space-y-2">
			<label htmlFor={fieldName} className="font-semibold">
				{label}
			</label>
			<div className="flex w-full rounded-sm border border-gray-400 bg-gray-200 outline-2 -outline-offset-2 outline-pink-700 focus-within:outline">
				<input
					{...register(fieldName, {
						required,
						min: 0.01,
						onChange() {
							if (watch('border.runningLength.unit') === 'auto') {
								setValue(
									'border.runningLength.value',
									calculateRunningFoot(watch('shape'), watch('measurements'))
								);
							}
						}
					})}
					id={fieldName}
					type="number"
					step="any"
					className="no-arrows h-full w-full flex-1  bg-transparent p-4 outline-none"
					placeholder={placeholder}
				/>

				<UnitLabel dimension={dimension} />
			</div>
		</div>
	);
}

function UnitLabel({ dimension }: { dimension: '1D' | '2D' }) {
	const { watch } = useFormContext<StoneProject>();

	const unit = watch('measurements.unit');
	const unit2D = ('sq' + unit) as Unit2D;

	return (
		<label htmlFor="measurements.unit" className="p-4 pl-0 text-base">
			{unitDisplayNameDictionary[dimension === '1D' ? unit : unit2D][0]}
		</label>
	);
}

function CircleInputs() {
	const { watch, setValue, control } = useFormContext();
	const radius = structuredClone(watch('measurements.radius.value'));

	const [{ diameter, circumference }, setCircleMeasurements] = useState<{
		diameter: number | string;
		circumference: number | string;
	}>({
		diameter: roundFractionDigits(radius * 2, 2),
		circumference: roundFractionDigits(2 * Math.PI * radius, 2)
	});

	return (
		<Controller
			control={control}
			name="measurements.radius.value"
			rules={{
				required: true,
				min: 0.01,
				onChange() {
					if (watch('border.runningLength.unit') === 'auto') {
						setValue(
							'border.runningLength.value',
							calculateRunningFoot(watch('shape'), watch('measurements'))
						);
					}
				}
			}}
			render={({ field }) => {
				function handleDiameterChange(newDiameter: number) {
					if (isNaN(newDiameter)) {
						setCircleMeasurements({ diameter: '', circumference: '' });
						field.onChange(0);
					} else {
						setCircleMeasurements({
							diameter: newDiameter,
							circumference: roundFractionDigits(Math.PI * newDiameter, 2)
						});

						field.onChange(newDiameter / 2);
					}
				}

				// Event handler for circumference field change
				function handleCircumferenceChange(newCircumference: number) {
					if (isNaN(newCircumference)) {
						setCircleMeasurements({ diameter: '', circumference: '' });
						field.onChange(0);
					} else {
						setCircleMeasurements({
							circumference: newCircumference,
							diameter: roundFractionDigits(newCircumference / Math.PI, 2)
						});

						field.onChange(newCircumference / (2 * Math.PI));
					}
				}

				return (
					<>
						<div className="max-w-xs flex-1 space-y-2">
							<label htmlFor="diameter" className="font-semibold">
								Diameter
							</label>
							<div className="flex w-full rounded-sm border border-gray-400 bg-gray-200 outline-2 -outline-offset-2 outline-pink-700 focus-within:outline">
								<input
									{...field}
									value={diameter}
									onChange={(e) => handleDiameterChange(e.target.valueAsNumber)}
									id="diameter"
									type="number"
									step="any"
									className="no-arrows w-full flex-1 bg-transparent p-4 outline-none"
									placeholder="Amount"
								/>
								<UnitLabel dimension="1D" />
							</div>
						</div>
						<div className="max-w-xs flex-1 space-y-2">
							<label htmlFor="circumference" className="font-semibold">
								Circumference
							</label>
							<div className="flex w-full rounded-sm border border-gray-400 bg-gray-200 outline-2 -outline-offset-2 outline-pink-700 focus-within:outline">
								<input
									{...field}
									value={circumference}
									onChange={(e) =>
										handleCircumferenceChange(e.target.valueAsNumber)
									}
									id="circumference"
									type="number"
									step="any"
									className="no-arrows w-full flex-1 bg-transparent p-4 outline-none"
									placeholder="Amount"
								/>
								<UnitLabel dimension="1D" />
							</div>
						</div>
					</>
				);
			}}
		/>
	);
}

export function MeasurementsStage() {
	const { watch } = useFormContext<StoneProject>();

	const shape = watch('shape');

	return (
		<StageForm className="flex items-center justify-center gap-12">
			<h2 className="max-w-xs font-display text-2xl">
				Enter the measurements of your project.
			</h2>
			<div className="flex justify-center gap-4">
				{shape === 'rect' && (
					<>
						<MeasurementInput
							fieldName="measurements.width"
							label="Width"
							placeholder="Amount"
							required
						/>
						<MeasurementInput
							fieldName="measurements.length"
							label="Length"
							placeholder="Amount"
							required
						/>
					</>
				)}
				{shape === 'circle' && <CircleInputs />}
				{shape === 'arbitrary' && (
					<>
						<MeasurementInput
							fieldName="measurements.area"
							label="Area"
							placeholder="Amount"
							dimension="2D"
						/>
						<MeasurementInput
							fieldName="measurements.runningLength"
							label="Running Length"
							placeholder="Amount"
						/>
					</>
				)}

				<UnitSelect />
			</div>
		</StageForm>
	);
}
