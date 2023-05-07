import { Button } from '@/components/button';
import * as Select from '@/components/select';
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/sheet';
import { Edit, LayoutTemplate, RectangleHorizontal } from 'lucide-react';

type OptionProps = React.PropsWithChildren<{
	title: string;
	subtitle: string;
}>;

function Option({ title, subtitle }: OptionProps) {
	return (
		<li className="flex h-64 w-64 flex-col rounded-lg border border-gray-400 p-6">
			<div className="flex-1" />
			{/* <div className="absolute inset-0 -z-10 rounded-lg border border-gray-400 peer-checked:border-2 peer-checked:border-black peer-checked:bg-gray-100" /> */}
			<div className="flex items-start">
				<div className="flex-1">
					<p className="font-semibold">{title}</p>
					<p>{subtitle}</p>
				</div>
				<SheetTrigger asChild>
					<Button variant="tertiary">
						<Edit className="h-5 w-5" />
					</Button>
				</SheetTrigger>
			</div>
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
			<label htmlFor={fieldName} className="font-semibold">
				{label}
			</label>
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

export function BorderStage() {
	return (
		<section className="space-y-16 px-32">
			<h2 className="text-center text-2xl">Add a border.</h2>

			<div className="flex flex-wrap justify-center gap-4">
				<DimensionInput
					fieldName="runningLength"
					label="Running Length"
					placeholder="Amount"
				/>

				<div className="max-w-xs flex-1 space-y-4">
					<label className="font-semibold">Stone Orientation</label>
					{/* <div className="flex w-full rounded-md bg-gray-200 p-6 pr-4"> */}
					<Select.Root defaultValue="SOLDIER_ROW">
						<Select.Trigger className="w-full !rounded-md p-6 pr-4" />

						<Select.Content>
							<Select.ScrollUpButton />
							<Select.Viewport>
								<Select.Item value="SOLDIER_ROW">Soldier Row</Select.Item>
								<Select.Item value="TIP_TO_TIP">Tip to Tip</Select.Item>
							</Select.Viewport>
							<Select.ScrollDownButton />
						</Select.Content>
					</Select.Root>
					{/* </div> */}
				</div>
			</div>

			<div className="flex flex-wrap justify-center gap-4">
				<div className="flex h-64 w-64 flex-col gap-4">
					<button className="flex w-full flex-1 items-center justify-center gap-2 rounded-lg border border-gray-400 p-6">
						<span className="font-semibold">Add Stone</span>
						<RectangleHorizontal className="h-5 w-5" />
					</button>
					<button className="flex w-full flex-1 items-center justify-center gap-2 rounded-lg border border-gray-400 p-6">
						<span className="font-semibold">Add Pattern</span>
						<LayoutTemplate className="h-5 w-5" />
					</button>
					{/* <button className='w-full flex-1 p-6'>Add </button> */}
				</div>

				<Sheet>
					<SheetContent position="right" size="sm">
						<SheetHeader>
							<SheetTitle>Edit stone.</SheetTitle>
						</SheetHeader>
						<SheetFooter>
							<Button variant="primary" type="submit">
								Save changes
							</Button>
						</SheetFooter>
					</SheetContent>

					<ul className="contents">
						<Option title="Colonial Classic Gray" subtitle="Covers 2 parts" />
						<Option title="Colonial Classic Red" subtitle="Covers 2 parts" />
					</ul>
				</Sheet>
			</div>
		</section>
	);
}
