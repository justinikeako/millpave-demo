import * as Select from '@/components/select';
import { Controller, useFormContext } from 'react-hook-form';
import { useStageContext } from './stage-context';
import { Dimensions, Shape } from '@/types/quote';
import { StageForm } from './form';
import { set } from 'lodash-es';
import { unitDisplayNameDictionary } from '@/lib/utils';

type DimensionInputProps = React.PropsWithChildren<{
	fieldName: string;
	label: string;
	placeholder?: string;
	dimension?: '1D' | '2D';
}>;

function DimensionInput({
	fieldName,
	label,
	placeholder,
	dimension = '1D'
}: DimensionInputProps) {
	const { register, control } = useFormContext();

	return (
		<div className="max-w-xs flex-1 space-y-4">
			<label htmlFor={`${fieldName}.value`}>{label}</label>
			<label
				htmlFor={`${fieldName}.value`}
				className="flex w-full rounded-md bg-gray-200 p-4 pr-2"
			>
				<input
					{...register(`${fieldName}.value`)}
					id={`${fieldName}.value`}
					type="number"
					className="no-arrows w-full flex-1 bg-transparent outline-none"
					placeholder={placeholder}
				/>
				<Controller
					name={`${fieldName}.unit`}
					control={control}
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

function calculateRunningFoot(shape: Shape, dimensions: Dimensions) {
	switch (shape) {
		case 'rect':
			return dimensions.length.value * 2 + dimensions.width.value * 2;
		case 'circle':
			return dimensions.circumference.value
				? dimensions.circumference.value
				: Math.PI * dimensions.diameter.value;
		case 'arbitrary':
			return dimensions.runningLength.value;
	}
}

export function DimensionsStage() {
	const { values, setValues } = useStageContext();

	return (
		<StageForm
			onSubmit={(values) => {
				const newValues = set(
					structuredClone(values),
					'border.runningLength.value',
					calculateRunningFoot(values.shape, values.dimensions)
				);

				setValues(newValues);
			}}
		>
			<div className="space-y-16 px-32">
				<h2 className="text-center text-2xl">Now, enter your measurements.</h2>
				<div className="flex justify-center gap-4">
					{values.shape === 'rect' && (
						<>
							<DimensionInput
								fieldName="dimensions.width"
								label="Width"
								placeholder="Amount"
							/>
							<DimensionInput
								fieldName="dimensions.length"
								label="Height"
								placeholder="Amount"
							/>
						</>
					)}
					{values.shape === 'circle' && (
						<DimensionInput
							fieldName="dimensions.circumference"
							label="Circumference"
							placeholder="Amount"
						/>
					)}
					{values.shape === 'arbitrary' && (
						<>
							<DimensionInput
								fieldName="dimensions.area"
								label="Area"
								placeholder="Amount"
								dimension="2D"
							/>
							<DimensionInput
								fieldName="dimensions.runningFoot"
								label="Running Foot"
								placeholder="Amount"
							/>
						</>
					)}
				</div>
			</div>
		</StageForm>
	);
}
