import * as Select from '@/components/select';
import { Control, Controller, Path, useFormContext } from 'react-hook-form';
import { StoneProject } from '@/types/quote';
import { StageForm } from './form';
import { calculateRunningFoot, unitDisplayNameDictionary } from '@/lib/utils';
import { useState } from 'react';
import { round } from 'mathjs';

function UnitSelect({
	control,
	name,
	dimension,
	required
}: {
	name: string;
	required?: boolean;
	dimension?: '1D' | '2D';
	control: Control;
}) {
	return (
		<Controller
			name={name}
			control={control}
			rules={{ required }}
			render={({ field }) => (
				<Select.Root value={field.value} onValueChange={field.onChange}>
					<Select.Trigger basic />

					<Select.Content>
						<Select.ScrollUpButton />
						<Select.Viewport>
							{dimension === '1D' && (
								<>
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
								</>
							)}
							{dimension === '2D' && (
								<>
									<Select.Item value="sqft">
										{unitDisplayNameDictionary['sqft'][0]}
									</Select.Item>
									<Select.Item value="sqin">
										{unitDisplayNameDictionary['sqin'][0]}
									</Select.Item>
									<Select.Item value="sqm">
										{unitDisplayNameDictionary['sqm'][0]}
									</Select.Item>
									<Select.Item value="sqcm">
										{unitDisplayNameDictionary['sqcm'][0]}
									</Select.Item>
								</>
							)}
						</Select.Viewport>
						<Select.ScrollDownButton />
					</Select.Content>
				</Select.Root>
			)}
		/>
	);
}

type DimensionInputProps = React.PropsWithChildren<{
	fieldName: Path<StoneProject>;
	label: string;
	placeholder?: string;
	dimension?: '1D' | '2D';
	required?: boolean;
}>;

function DimensionInput({
	fieldName,
	label,
	placeholder,
	required,
	dimension = '1D'
}: DimensionInputProps) {
	const { register, control, watch, setValue } = useFormContext();

	return (
		<div className="max-w-xs flex-1 space-y-4">
			<label htmlFor={`${fieldName}.value`}>{label}</label>
			<label
				htmlFor={`${fieldName}.value`}
				className="flex w-full rounded-md bg-gray-200 p-4 pr-2"
			>
				<input
					{...register(`${fieldName}.value`, {
						required,
						min: 0.01,
						onChange() {
							if (watch('border.runningLength.unit') === 'auto') {
								setValue(
									'border.runningLength.value',
									calculateRunningFoot(watch('shape'), watch('dimensions'))
								);
							}
						}
					})}
					id={`${fieldName}.value`}
					type="number"
					step="any"
					className="no-arrows w-full flex-1 bg-transparent outline-none"
					placeholder={placeholder}
				/>
				<UnitSelect
					control={control}
					name={`${fieldName}.unit`}
					dimension={dimension}
					required
				/>
			</label>
		</div>
	);
}

function CircleInputs() {
	const { watch, setValue, control } = useFormContext();
	const radius = structuredClone(watch('dimensions.radius.value'));

	const [{ diameter, circumference }, setCircleDimensions] = useState({
		diameter: round(radius * 2, 2),
		circumference: round(2 * Math.PI * radius, 2)
	});

	return (
		<Controller
			control={control}
			name="dimensions.radius.value"
			rules={{
				required: true,
				min: 0.01,
				onChange() {
					if (watch('border.runningLength.unit') === 'auto') {
						setValue(
							'border.runningLength.value',
							calculateRunningFoot(watch('shape'), watch('dimensions'))
						);
					}
				}
			}}
			render={({ field }) => {
				function handleDiameterChange(newDiameter: number) {
					setCircleDimensions({
						diameter: newDiameter,
						circumference: round(Math.PI * newDiameter, 2)
					});

					field.onChange(round(newDiameter / 2, 2));
				}

				// Event handler for circumference field change
				function handleCircumferenceChange(newCircumference: number) {
					setCircleDimensions({
						circumference: newCircumference,
						diameter: round(newCircumference / Math.PI, 2)
					});

					field.onChange(round(newCircumference / (2 * Math.PI), 2));
				}

				return (
					<>
						<div className="max-w-xs flex-1 space-y-4">
							<label htmlFor="diameter">Diameter</label>
							<label
								htmlFor="diameter"
								className="flex w-full rounded-md bg-gray-200 p-4 pr-2"
							>
								<input
									{...field}
									value={diameter}
									onChange={(e) =>
										handleDiameterChange(e.target.valueAsNumber || 0)
									}
									id="diameter"
									type="number"
									step="any"
									className="no-arrows w-full flex-1 bg-transparent outline-none"
									placeholder="Amount"
								/>
								<UnitSelect
									control={control}
									name="dimensions.radius.unit"
									dimension="1D"
									required
								/>
							</label>
						</div>
						<div className="max-w-xs flex-1 space-y-4">
							<label htmlFor="circumference">Circumference</label>
							<label
								htmlFor="circumference"
								className="flex w-full rounded-md bg-gray-200 p-4 pr-2"
							>
								<input
									{...field}
									value={circumference}
									onChange={(e) =>
										handleCircumferenceChange(e.target.valueAsNumber || 0)
									}
									id="circumference"
									type="number"
									step="any"
									className="no-arrows w-full flex-1 bg-transparent outline-none"
									placeholder="Amount"
								/>
								<UnitSelect
									control={control}
									name="dimensions.radius.unit"
									dimension="1D"
									required
								/>
							</label>
						</div>
					</>
				);
			}}
		/>
	);
}

export function DimensionsStage() {
	const { watch } = useFormContext<StoneProject>();

	const shape = watch('shape');

	return (
		<StageForm>
			<div className="space-y-16 px-32">
				<h2 className="text-center text-2xl">Now, enter your measurements.</h2>
				<div className="flex justify-center gap-4">
					{shape === 'rect' && (
						<>
							<DimensionInput
								fieldName="dimensions.width"
								label="Width"
								placeholder="Amount"
								required
							/>
							<DimensionInput
								fieldName="dimensions.length"
								label="Length"
								placeholder="Amount"
								required
							/>
						</>
					)}
					{shape === 'circle' && <CircleInputs />}
					{shape === 'arbitrary' && (
						<>
							<DimensionInput
								fieldName="dimensions.area"
								label="Area"
								placeholder="Amount"
								dimension="2D"
							/>
							<DimensionInput
								fieldName="dimensions.runningLength"
								label="Running Length"
								placeholder="Amount"
							/>
						</>
					)}
				</div>
			</div>
		</StageForm>
	);
}
