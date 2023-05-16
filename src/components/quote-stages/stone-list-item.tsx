import { Button } from '@/components/button';
import { SheetTrigger } from '@/components/sheet';
import { Edit } from 'lucide-react';
import { Coverage, CoverageUnit } from '../stage-context';
import { cn } from '@/lib/utils';

type StoneProps = React.PropsWithChildren<{
	displayName: string;
	coverage: Coverage;
	selected: boolean;
	onSelect?(): void;
}>;

const coverageUnitDisplayNameDictionary: {
	[key in CoverageUnit]: [string, string];
} = {
	fr: ['part', 'parts'],
	unit: ['unit', 'units'],
	ft: ['ft', 'ft'],
	in: ['in', 'in'],
	sqft: ['sqft', 'sqft'],
	sqin: ['sqin', 'sqin'],
	m: ['m', 'm'],
	cm: ['cm', 'cm'],
	sqm: ['sqm', 'sqm'],
	sqcm: ['sqcm', 'sqcm']
};

export function StoneListItem({
	displayName,
	coverage,
	selected,
	onSelect
}: StoneProps) {
	const coverageUnitDisplayName =
		coverageUnitDisplayNameDictionary[coverage.unit][
			coverage.value == 1 ? 0 : 1
		];

	return (
		<li className="relative flex h-64 w-64 flex-col p-6">
			<div className="flex-1" />
			<SheetTrigger asChild>
				<button
					type="button"
					className={cn(
						'absolute inset-0 rounded-lg ring-1 ring-inset ring-gray-400 hover:bg-gray-100',
						selected && 'bg-gray-100 ring-2 ring-gray-950'
					)}
					onClick={onSelect}
				/>
			</SheetTrigger>
			<div className="pointer-events-none z-10 flex items-start">
				<div className="flex-1">
					<p className="font-semibold">{displayName}</p>
					<p className="text-sm">
						{coverage.value} {coverageUnitDisplayName}
					</p>
				</div>

				<Button
					variant="tertiary"
					type="button"
					className="pointer-events-auto z-10"
				>
					<Edit className="h-5 w-5" />
				</Button>
			</div>
		</li>
	);
}
