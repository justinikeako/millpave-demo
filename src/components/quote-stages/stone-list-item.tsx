import { Button } from '@/components/button';
import { SheetTrigger } from '@/components/sheet';
import { Edit } from 'lucide-react';
import { Coverage, CoverageUnit } from '../stage-context';

type StoneProps = React.PropsWithChildren<{
	displayName: string;
	coverage: Coverage;
	onClick?(): void;
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

export function StoneListItem({ displayName, coverage, onClick }: StoneProps) {
	const coverageUnitDisplayName =
		coverageUnitDisplayNameDictionary[coverage.unit][
			coverage.value == 1 ? 0 : 1
		];

	return (
		<li className="flex h-64 w-64 flex-col rounded-lg border border-gray-400 p-6">
			<div className="flex-1" />
			{/* <div className="absolute inset-0 -z-10 rounded-lg border border-gray-400 peer-checked:border-2 peer-checked:border-black peer-checked:bg-gray-100" /> */}
			<div className="flex items-start">
				<div className="flex-1">
					<p className="font-semibold">{displayName}</p>
					<p className="text-sm">
						{coverage.value} {coverageUnitDisplayName}
					</p>
				</div>

				<SheetTrigger asChild>
					<Button variant="tertiary" onClick={onClick}>
						<Edit className="h-5 w-5" />
					</Button>
				</SheetTrigger>
			</div>
		</li>
	);
}
