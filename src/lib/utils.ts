import classNames from 'classnames';
import { Sku, ExtendedPaverDetails } from '@/types/product';
import { Dimensions, Shape, Unit } from '@/types/quote';
import { round } from 'mathjs';

export function calculateRunningFoot(shape: Shape, dimensions: Dimensions) {
	function inner(shape: Shape, dimensions: Dimensions) {
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

	return round(inner(shape, dimensions), 2);
}

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
	pcs: ['piece', 'pieces'],
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
