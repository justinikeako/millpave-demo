import * as Select from '@/components/select';
import { Controller, Path, useFormContext } from 'react-hook-form';
import { StoneProject } from '@/types/quote';
import { StageForm } from './form';
import { calculateRunningFoot, unitDisplayNameDictionary } from '@/lib/utils';
import { useState } from 'react';

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
				<Controller
					name={`${fieldName}.unit`}
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
			</label>
		</div>
	);
}

type SelectDimensionInputProps = React.PropsWithChildren<{
	fields: { name: Path<StoneProject>; label: string; required: boolean }[];
	placeholder?: string;
	dimension?: '1D' | '2D';
}>;

function DimensionSelectInput({
	fields,
	placeholder,
	dimension = '1D'
}: SelectDimensionInputProps) {
	const { register, control, watch, setValue } = useFormContext();
	const [fieldIndex, setFieldIndex] = useState(0);

	const field = fields[fieldIndex] as {
		name: string;
		label: string;
		required: boolean;
	};

	return (
		<div className="max-w-xs flex-1 space-y-4">
			<Select.Root
				value={fieldIndex.toString()}
				onValueChange={(newFieldIndex) =>
					setFieldIndex(parseInt(newFieldIndex))
				}
			>
				<Select.Trigger basic />

				<Select.Content>
					<Select.ScrollUpButton />
					<Select.Viewport>
						{fields.map((field, index) => (
							<Select.Item key={field.name} value={index.toString()}>
								{field.label}
							</Select.Item>
						))}
					</Select.Viewport>
					<Select.ScrollDownButton />
				</Select.Content>
			</Select.Root>
			<label
				htmlFor={`${field.name}.value`}
				className="flex w-full rounded-md bg-gray-200 p-4 pr-2"
			>
				<input
					{...register(`${field.name}.value`, {
						required: field.required,
						onChange() {
							if (watch('border.runningLength.unit') === 'auto') {
								setValue(
									'border.runningLength.value',
									calculateRunningFoot(watch('shape'), watch('dimensions'))
								);
							}
						}
					})}
					id={`${field.name}.value`}
					inputMode="decimal"
					type="number"
					step="any"
					className="no-arrows w-full flex-1 bg-transparent outline-none"
					placeholder={placeholder}
				/>
				<Controller
					name={`${field.name}.unit`}
					control={control}
					rules={{ required: field.required }}
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
			</label>
		</div>
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
					{shape === 'circle' && (
						<DimensionSelectInput
							fields={[
								{
									label: 'Circumference',
									name: 'dimensions.circumference',
									required: true
								},
								{
									label: 'Diameter',
									name: 'dimensions.diameter',
									required: true
								}
							]}
							placeholder="Amount"
						/>
					)}
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
