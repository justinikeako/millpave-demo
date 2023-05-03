import * as Select from '@/components/select';

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
	return (
		<div className="max-w-xs flex-1 space-y-4">
			<label htmlFor={fieldName}>{label}</label>
			<div className="flex w-full rounded-md bg-gray-200 p-6 pr-4">
				<input
					id={fieldName}
					name={fieldName}
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
	return (
		<section className="space-y-16 px-32">
			<h2 className="text-center text-2xl">Now enter your measurements.</h2>
			<div className="flex justify-center gap-4">
				<DimensionInput fieldName="width" label="Width" placeholder="Amount" />
				<DimensionInput
					fieldName="height"
					label="Height"
					placeholder="Amount"
				/>
			</div>
		</section>
	);
}
