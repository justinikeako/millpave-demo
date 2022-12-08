import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { roundPrice } from '../../utils/price';
import { get } from 'lodash-es';
import { QuoteInputItem, QuoteItemMetadata } from '../../types/quote';
import { PaverSkuWithDetails } from '../../types/product';

type QuoteItemCreateManyQuoteInput = {
	metadata: QuoteItemMetadata;
} & Prisma.QuoteItemCreateManyQuoteInput;

function generateQuoteItem(input: QuoteInputItem, sku: PaverSkuWithDetails) {
	const skuPrice =
		input.pickupLocationId === 'KNG_SHOWROOM' ? sku.price + 20 : sku.price;
	const areaFromQuantity = input.quantity / sku.details.data.pcs_per_sqft;

	const generatedItem: QuoteItemCreateManyQuoteInput = {
		skuId: sku.id,
		quantity: input.quantity,
		pickupLocationId: input.pickupLocationId,
		price: roundPrice(areaFromQuantity * skuPrice),
		metadata: {}
	};

	return generatedItem;
}

function generateQuote(inputItem: QuoteInputItem, sku: PaverSkuWithDetails) {
	const outputItem = generateQuoteItem(inputItem, sku);

	const generatedQuote: Prisma.QuoteCreateInput = {
		id: nanoid(8),
		title: 'Draft Quote',
		items: { create: [outputItem] },
		...calculateDetails([outputItem])
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
