import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { roundPrice } from '../../utils/price';
import { getSku, getSkuDetails } from '../mock-db';
import { get } from 'lodash-es';
import { QuoteInputItem, QuoteItemMetadata } from '../../types/quote';

type QuoteItemCreateManyQuoteInput = {
	metadata: QuoteItemMetadata;
} & Prisma.QuoteItemCreateManyQuoteInput;

function generateQuoteItem(inputItem: QuoteInputItem) {
	const sku = getSku(inputItem.skuId);
	const skuDetails = getSkuDetails(inputItem.skuId);

	const { area, quantity } = inputItem;

	const skuPrice =
		inputItem.pickupLocation === 'FACTORY' ? sku.price : sku.price + 20;

	const outputMetadata: QuoteItemMetadata = {
		area: area,
		weight: quantity * skuDetails.lbs_per_unit,
		...inputItem.input
	};

	const outputItem: QuoteItemCreateManyQuoteInput = {
		skuId: sku.id,
		displayName: sku.displayName,
		quantity: quantity,
		pickupLocation: inputItem.pickupLocation,
		price: roundPrice(area * skuPrice),
		metadata: outputMetadata
	};

	return outputItem;
}

function generateQuote(inputItems: QuoteInputItem[]) {
	const outputItems = inputItems.map(generateQuoteItem);

	const generatedQuote: Prisma.QuoteCreateInput = {
		id: nanoid(8),
		title: 'Draft Quote',
		items: { create: outputItems },
		...calculateDetails(outputItems)
	};

	return generatedQuote;
}

type QuoteDetails = {
	area: number;
	subtotal: number;
	tax: number;
	total: number;
	weight: number;
};

function sumNestedKeys<T>(objects: T[], keys: string): number {
	let sum = 0;

	for (const obj of objects) {
		// Use the lodash.get() method to retrieve the value of the nested key.
		const value = get(obj, keys);

		// If the value is a number, add it to the sum.
		if (typeof value === 'number') {
			sum += value;
		}
	}

	return sum;
}

function calculateDetails(
	inputItems: QuoteItemCreateManyQuoteInput[]
): QuoteDetails {
	const subtotal = roundPrice(sumNestedKeys(inputItems, 'price')),
		tax = roundPrice(subtotal * 0.15),
		total = roundPrice(subtotal + tax);

	return {
		area: sumNestedKeys(inputItems, 'metadata.area'),
		weight: sumNestedKeys(inputItems, 'metadata.weight'),
		subtotal: subtotal,
		tax: tax,
		total: total
	};
}

export { generateQuote, generateQuoteItem };
