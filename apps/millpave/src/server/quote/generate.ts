import { Prisma } from '@prisma/client';
import { PickupLocation } from '@prisma/client';
import { nanoid } from 'nanoid';
import { roundPrice } from '../../utils/price';
import { getSku, getSkuDetails } from '../mock-db';

type InputItem = {
	skuId: string;
	pickupLocation: PickupLocation;
	area: number;
};

type QuoteItemMetadata = {
	weight: number;
	area: number;
	originalArea: number;
};

type QuoteItemCreateManyQuoteInput = Prisma.QuoteItemCreateManyQuoteInput & {
	metadata: QuoteItemMetadata;
};

function generateQuoteItem(
	inputItem: InputItem
): QuoteItemCreateManyQuoteInput {
	const sku = getSku(inputItem.skuId);
	const skuDetails = getSkuDetails(inputItem.skuId);

	const areaBeforeOverage = inputItem.area;

	const areaWithOverage = inputItem.area * 1;

	const quantity = Math.round(areaWithOverage * skuDetails.pcs_per_sqft);

	const skuPrice =
		inputItem.pickupLocation === 'FACTORY' ? sku.price : sku.price + 20;

	const outputItem: QuoteItemCreateManyQuoteInput = {
		skuId: sku.id,
		displayName: sku.display_name,
		metadata: {
			weight: quantity * 5,
			originalArea: areaBeforeOverage,
			area: areaWithOverage
		},
		quantity: quantity,
		pickupLocation: inputItem.pickupLocation,
		price: roundPrice(areaWithOverage * skuPrice)
	};

	return outputItem;
}

function generateQuote(inputItems: InputItem[], authorId: string) {
	const outputItems = inputItems.map(generateQuoteItem);

	const generatedQuote: Prisma.QuoteCreateInput = {
		id: nanoid(8),
		title: 'Draft Quote',
		author: { connect: { id: authorId } },
		shapes: [],
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

function calculateDetails(
	inputItems: QuoteItemCreateManyQuoteInput[]
): QuoteDetails {
	function getSum(
		items: QuoteItemCreateManyQuoteInput[],
		key: keyof QuoteItemCreateManyQuoteInput
	) {
		return items.reduce((total: number, currentItem) => {
			const addend = currentItem[key] as number;

			if (typeof addend !== 'number')
				throw new Error(`object.${key} is not a number`);

			return total + addend;
		}, 0);
	}

	function getNestedSum(
		items: QuoteItemCreateManyQuoteInput[],
		key: keyof QuoteItemMetadata
	) {
		return items.reduce((total: number, currentItem) => {
			const addend = currentItem.metadata[key];

			if (typeof addend !== 'number')
				throw new Error(`object.${key} is not a number`);

			return total + addend;
		}, 0);
	}

	const subtotal = roundPrice(getSum(inputItems, 'price')),
		tax = roundPrice(subtotal * 0.15),
		total = roundPrice(subtotal + tax);

	return {
		area: getNestedSum(inputItems, 'area'),
		weight: getNestedSum(inputItems, 'weight'),
		subtotal: subtotal,
		tax: tax,
		total: total
	};
}

export { generateQuote, generateQuoteItem };
