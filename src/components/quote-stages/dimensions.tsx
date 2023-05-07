import * as Select from '@/components/select';
import { useFormContext } from 'react-hook-form';

type DimensionInputProps = React.PropsWithChildren<{
	fieldName: string;
	label: string;
	placeholder?: string;
}>;

function DimensionInput({
	fieldName,
	label,
	placeholder
}: DimensionInputProps) {
	const { register } = useFormContext();

	return (
		<div className="max-w-xs flex-1 space-y-4">
			<label htmlFor={fieldName}>{label}</label>
			<div className="flex w-full rounded-md bg-gray-200 p-6 pr-4">
				<input
					{...register(fieldName)}
					id={fieldName}
					type="number"
					className="no-arrows w-full flex-1 bg-transparent outline-none"
					placeholder={placeholder}
				/>
				<Select.Root defaultValue="ft">
					<Select.Trigger basic />

					<Select.Content>
						<Select.ScrollUpButton />
						<Select.Viewport>
							<Select.Item value="ft">ft</Select.Item>
							<Select.Item value="in">in</Select.Item>
							<Select.Item value="m">m</Select.Item>
							<Select.Item value="cm">cm</Select.Item>
						</Select.Viewport>
						<Select.ScrollDownButton />
					</Select.Content>
				</Select.Root>
			</div>
		</div>
	);
}

export function DimensionsStage() {
	const { watch } = useFormContext();

	const shape = watch().shape;

	return (
		<section className="space-y-16 px-32">
			<h2 className="text-center text-2xl">Now enter your measurements.</h2>
			<div className="flex justify-center gap-4">
				{shape === 'rectangle' && (
					<>
						<DimensionInput
							fieldName="dimensions.width"
							label="Width"
							placeholder="Amount"
						/>
						<DimensionInput
							fieldName="dimensions.height"
							label="Height"
							placeholder="Amount"
						/>
					</>
				)}
				{shape === 'circle' && (
					<DimensionInput
						fieldName="dimensions.circumference"
						label="Circumference"
						placeholder="Amount"
					/>
				)}
				{shape === 'arbitrary' && (
					<>
						<DimensionInput
							fieldName="dimensions.area"
							label="Area"
							placeholder="Amount"
						/>
						<DimensionInput
							fieldName="dimensions.runningFoot"
							label="Running Foot"
							placeholder="Amount"
						/>
					</>
				)}
			</div>
		</section>
	);
}
