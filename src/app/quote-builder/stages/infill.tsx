import { Button } from '@/components/button';
import {
	Sheet,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/sheet';
import { LayoutTemplate, RectangleHorizontal } from 'lucide-react';
import { MoreVertical } from 'lucide-react';

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
						<MoreVertical className="h-5 w-5" />
					</Button>
				</SheetTrigger>
			</div>
		</li>
	);
}

export function InfillStage() {
	return (
		<section className="space-y-16 px-32">
			<h2 className="text-center text-2xl">Add an infill.</h2>

			<div className="flex flex-wrap justify-center gap-4">
				<div className="flex h-64 w-64 flex-col gap-4">
					<button className="roun ded-lg flex w-full flex-1 items-center justify-center gap-2 border border-gray-400 p-6">
						<span className="font-semibold">Add Stone</span>
						<RectangleHorizontal className="h-5 w-5" />
					</button>
					<button className="flex w-full flex-1 items-center justify-center gap-2  rounded-lg border border-gray-400 p-6">
						<span className="font-semibold">Add Pattern</span>
						<LayoutTemplate className="h-5 w-5" />
					</button>
					{/* <button className='w-full flex-1 p-6'>Add </button> */}
				</div>

				<Sheet>
					<SheetContent position="right" size="sm">
						<SheetHeader>
							<SheetTitle>Edit Stone</SheetTitle>
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
