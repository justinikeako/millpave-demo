import classNames from 'classnames';
import { Unit } from '@/types/quote';
import { Sku } from '@/types/product';
import { ExtendedPaverDetails } from '@/types/product';

export function findSku(
	skuId: string | undefined,
	skus: Sku[] | undefined,
	details: ExtendedPaverDetails[] | undefined
) {
	const foundSku = skus?.find((currentSku) => currentSku.id === skuId);
	const foundDetails = details?.find((details) =>
		skuId?.includes(details.matcher)
	);

	if (!foundSku || !foundDetails) return undefined;

	return {
		...foundSku,
		details: foundDetails
	};
}

export const unitDisplayNameDictionary: {
	[key in Unit]: [string, string];
} = {
	fr: ['part', 'parts'],
	pal: ['pallet', 'pallets'],
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
