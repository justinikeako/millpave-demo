import classNames from 'classnames';
import { Sku, ExtendedPaverDetails } from '@/types/product';
import { Dimensions, QuoteItem, Shape, Unit } from '@/types/quote';
import { round } from 'mathjs';

export function getQuoteDetails(
	quoteItems: Omit<QuoteItem, 'displayName' | 'signatures' | 'unit'>[]
) {
	let subtotal = 0,
		totalArea = 0,
		totalWeight = 0;

	for (const cartItem of quoteItems) {
		subtotal += cartItem.cost;
		totalArea += cartItem?.area || 0;
		totalWeight += cartItem.weight;
	}

	totalArea = round(totalArea, 2);
	totalWeight = round(totalWeight, 2);
	subtotal = round(subtotal, 2);
	const tax = round(subtotal * 0.15, 2);
	const total = round(subtotal + tax, 2);

	return { totalArea, totalWeight, subtotal, tax, total };
}

export function calculateRunningFoot(shape: Shape, dimensions: Dimensions) {
	function inner(shape: Shape, dimensions: Dimensions) {
		switch (shape) {
			case 'rect':
				return dimensions.length.value * 2 + dimensions.width.value * 2;
			case 'circle':
				return 2 * Math.PI * dimensions.radius.value;
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

export function pluralize(value: number, [singular, plural]: [string, string]) {
	return value + ' ' + (value === 1 ? singular : plural);
}

export function stopPropagate(
	callback: (e: React.FormEvent<HTMLFormElement>) => void
) {
	return (e: React.FormEvent<HTMLFormElement>) => {
		e.stopPropagation();

		callback(e);
	};
}

export const cn = classNames;
