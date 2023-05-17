import classNames from 'classnames';
import { CoverageUnit } from '@/types/quote';

export const unitDisplayNameDictionary: {
	[key in CoverageUnit]: [string, string];
} = {
	fr: ['part', 'parts'],
	unit: ['unit', 'units'],
	ft: ['ft', 'ft'],
	in: ['in', 'in'],
	sqft: ['ft²', 'ft²'],
	sqin: ['in²', 'in²'],
	m: ['m', 'm'],
	cm: ['cm', 'cm'],
	sqm: ['m²', 'm²'],
	sqcm: ['cm²', 'cm²']
};

export function stopPropagate(
	callback: (e: React.FormEvent<HTMLFormElement>) => void
) {
	return (e: React.FormEvent<HTMLFormElement>) => {
		e.stopPropagation();

		callback(e);
	};
}

export const cn = classNames;
