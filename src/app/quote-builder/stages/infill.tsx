import * as Select from '@/components/select';

type OptionProps = React.PropsWithChildren<{
	id: string;
	fieldName: string;
	title: string;
	subtitle: string;
}>;

function Option({ id, fieldName, title, subtitle }: OptionProps) {
	return (
		<li>
			<label htmlFor={id} className="relative flex h-full w-64 flex-col p-6">
				<input name={fieldName} id={id} type="radio" className="peer hidden" />

				<div className="flex-1" />
				<div className="absolute inset-0 -z-10 rounded-lg border border-gray-400 peer-checked:border-2 peer-checked:border-black peer-checked:bg-gray-100" />
				<p className="font-semibold">{title}</p>
				<p>{subtitle}</p>
			</label>
		</li>
	);
}

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
							<Select.Item value="ft">parts</Select.Item>
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

export function InfillStage() {
	return (
		<section className="space-y-16 px-32">
			<h2 className="text-center text-2xl">Add an infill.</h2>

			<div className="flex flex-wrap justify-center gap-4">
				<div className="flex h-64 w-64 flex-col gap-4">
					<button className="w-full flex-1 rounded-lg border border-gray-400 p-6">
						<span className="font-semibold">Add Stone</span>
					</button>
					<button className="w-full flex-1 rounded-lg border border-gray-400 p-6">
						<span className="font-semibold">Add Pattern</span>
					</button>
					{/* <button className='w-full flex-1 p-6'>Add </button> */}
				</div>
				<ul className="contents">
					<Option
						title="Colonial Classic Gray"
						subtitle="Covers 2 parts"
						fieldName="nubi"
						id="a"
					/>
					<Option
						title="Colonial Classic Red"
						subtitle="Covers 2 parts"
						fieldName="nubi"
						id="b"
					/>
				</ul>
			</div>
		</section>
	);
}
