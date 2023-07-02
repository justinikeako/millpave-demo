import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Sku, ExtendedPaverDetails } from '~/types/product';
import { Measurements, QuoteItem, Shape, Unit } from '~/types/quote';

export function roundFractionDigits(
	value: number | number,
	fractionDigits: number
) {
	const valueAsNumber = typeof value === 'string' ? parseFloat(value) : value;

	return parseFloat(valueAsNumber.toFixed(fractionDigits));
}

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

	totalArea = roundFractionDigits(totalArea, 2);
	totalWeight = roundFractionDigits(totalWeight, 2);
	subtotal = roundFractionDigits(subtotal, 2);
	const tax = roundFractionDigits(subtotal * 0.15, 2);
	const total = roundFractionDigits(subtotal + tax, 2);

	return { totalArea, totalWeight, subtotal, tax, total };
}

export function calculateRunningFoot(shape: Shape, measurements: Measurements) {
	function inner(shape: Shape, measurements: Measurements) {
		switch (shape) {
			case 'rect':
				return measurements.length * 2 + measurements.width * 2;
			case 'circle':
				return 2 * Math.PI * measurements.radius;
			case 'other':
				return measurements.runningLength;
		}
	}

	return roundFractionDigits(inner(shape, measurements), 2);
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

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
