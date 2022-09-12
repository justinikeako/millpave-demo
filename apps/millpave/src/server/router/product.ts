import { createRouter } from './context';
import { z } from 'zod';
import { addBusinessDays, addHours } from 'date-fns';
import { nanoid } from 'nanoid';
import { PickupLocation, Product, SKU } from '../../types/product';
import { TRPCError } from '@trpc/server';

// Mock Product
const product: Product = {
	id: 'colonial_classic',
	category: { id: 'concret_pavers', display_name: 'Concrete Pavers' },
	display_name: 'Colonial Classic',
	details: {
		dimensions: [4, 8, 2.375],
		lbs_per_unit: 5,
		sqft_per_pallet: 128.75,
		units_per_pallet: 600,
		pcs_per_sqft: 4.66
	},
	gallery: [
		{
			id: nanoid(),
			img_url:
				'http://mobileimages.lowes.com/productimages/e17627ec-4502-40ad-8f2c-21d1f7e53c11/43213000.jpg'
		},
		{
			id: nanoid(),
			img_url:
				'https://i.pinimg.com/originals/e7/f7/4d/e7f74d6f1a90cc47068e96baa67868f1.jpg'
		},
		{
			id: nanoid(),
			img_url:
				'https://i.pinimg.com/originals/b0/65/13/b06513eb47b0917940f8930b98c0021e.jpg'
		}
	],
	similar_products: [
		{
			id: 'banjo',
			display_name: 'Banjo',
			price: 228
		},
		{
			id: 'heritage',
			display_name: 'Heritage Series',
			price: 228
		}
	],
	sku_id_fragments: [
		{
			index: 0,
			type: 'color',
			display_name: 'Color',
			fragments: [
				{ id: 'grey', hex: 'D9D9D9' },
				{ id: 'ash', hex: 'B1B1B1' },
				{ id: 'charcoal', hex: '696969' },
				{ id: 'spanish_brown', hex: '95816D' },
				{ id: 'sunset_taupe', hex: 'C9B098' },
				{ id: 'tan', hex: 'DDCCBB' },
				{ id: 'shale_brown', hex: '907A7A' },
				{ id: 'sunset_clay', hex: 'E7A597' },
				{ id: 'red', hex: 'EF847A' },
				{ id: 'terracotta', hex: 'EFA17A' },
				{ id: 'orange', hex: 'EBB075' },
				{ id: 'sunset_tangerine', hex: 'E7C769' },
				{ id: 'yellow', hex: 'E7DD69' },
				{ id: 'green', hex: 'A9D786' }
			]
		}
	]
};

// Mock SKUs
const skuList: SKU[] = [
	{
		id: 'colonial_classic:grey',
		display_name: 'Colonial Classic Grey',
		price: 203
	},
	{
		id: 'colonial_classic:ash',
		display_name: 'Colonial Classic Ash',
		price: 228
	},
	{
		id: 'colonial_classic:charcoal',
		display_name: 'Colonial Classic Charcoal',
		price: 228
	},
	{
		id: 'colonial_classic:spanish_brown',
		display_name: 'Colonial Classic Spanish Brown',
		price: 228
	},
	{
		id: 'colonial_classic:sunset_taupe',
		display_name: 'Colonial Classic Sunset Taupe',
		price: 228
	},
	{
		id: 'colonial_classic:tan',
		display_name: 'Colonial Classic Tan',
		price: 228
	},
	{
		id: 'colonial_classic:shale_brown',
		display_name: 'Colonial Classic Shale Brown',
		price: 228
	},
	{
		id: 'colonial_classic:sunset_clay',
		display_name: 'Colonial Classic Sunset Clay',
		price: 228
	},
	{
		id: 'colonial_classic:red',
		display_name: 'Colonial Classic Red',
		price: 228
	},
	{
		id: 'colonial_classic:terracotta',
		display_name: 'Colonial Classic Terracotta',
		price: 228
	},
	{
		id: 'colonial_classic:orange',
		display_name: 'Colonial Classic Orange',
		price: 228
	},
	{
		id: 'colonial_classic:sunset_tangerine',
		display_name: 'Colonial Classic Sunset Tangerine',
		price: 228
	},
	{
		id: 'colonial_classic:yellow',
		display_name: 'Colonial Classic Yellow',
		price: 233
	},
	{
		id: 'colonial_classic:green',
		display_name: 'Colonial Classic Green',
		price: 363
	}
];

type Stock = {
	sku_id: string;
	location: PickupLocation;
	quantity: number;
};

const color_list = [
	'grey',
	'ash',
	'charcoal',
	'spanish_brown',
	'sunset_taupe',
	'tan',
	'shale_brown',
	'sunset_clay',
	'red',
	'terracotta',
	'orange',
	'sunset_tangerine',
	'yellow',
	'green'
];

function round(value: number, multpile: number, direction?: 'up' | 'down') {
	let roundingFunction: (num: number) => number;

	if (direction === 'up') roundingFunction = Math.ceil;
	else if (direction === 'down') roundingFunction = Math.floor;
	else roundingFunction = Math.round;

	return roundingFunction(value / multpile) * multpile;
}

function coinFlip(chance = 0.5) {
	return Math.random() > chance ? true : false;
}

const stock: Stock[] = color_list.flatMap((color) => {
	const showroomQuantity = round(Math.random() * 2 * 128.75, 1 / 4.66);
	const factoryQuantity = Math.round(Math.random() * 30) * (128.75 / 2);

	return [
		{
			sku_id: `colonial_classic:${color}`,
			location: 'showroom',
			quantity: coinFlip() ? showroomQuantity : 0
		},
		{
			sku_id: `colonial_classic:${color}`,
			location: 'factory',
			quantity: coinFlip() ? factoryQuantity : 0
		}
	];
});

type RestockQueueElement = {
	sku_id: string;
	location: PickupLocation;
	quantity: number;
	date: number;
	fulfilled: boolean;
};

const restockQueue: RestockQueueElement[] = color_list.flatMap((color) => {
	const fromFactory = coinFlip();

	return coinFlip()
		? [
				{
					sku_id: `colonial_classic:${color}`,
					location: fromFactory ? 'factory' : 'showroom',
					quantity: fromFactory
						? (1 + Math.round(Math.random() * 30)) * (128.75 / 2)
						: (1 + Math.round(Math.random() * 2)) * (128.75 / 2),
					date: fromFactory
						? addBusinessDays(
								new Date(),
								Math.round(Math.random() * 20)
						  ).getTime()
						: coinFlip(0.75)
						? addHours(new Date(), Math.round(Math.random() * 3)).getTime()
						: addBusinessDays(
								new Date(),
								Math.round(Math.random() * 7)
						  ).getTime(),
					fulfilled: coinFlip()
				}
		  ]
		: [];
});

export const productRouter = createRouter()
	.query('get', {
		resolve() {
			return { ...product, skuList };
		}
	})
	.query('getSKUFulfillment', {
		input: z.object({
			skuId: z.string(),
			pickupLocation: z.string()
		}),
		resolve({ input }) {
			const current_stock = stock.find((item) => {
				const matchesSkuId = item.sku_id === input.skuId;
				const matchesPickupLocation = item.location === input.pickupLocation;

				return matchesSkuId && matchesPickupLocation;
			});

			const matchedQueueElements = restockQueue.filter(
				(queueElement) =>
					queueElement.sku_id === input.skuId &&
					queueElement.location === input.pickupLocation
			);

			// Default to none
			let closest_restock_date = -1;

			// If any exist in the queue, find the one closest to today.
			if (matchedQueueElements.length) {
				closest_restock_date = matchedQueueElements.reduce((prev, curr) => {
					return prev.date < curr.date ? prev : curr;
				}).date;
			}

			if (!current_stock) {
				throw new TRPCError({
					message: `SKU '${input.skuId}' does not exist`,
					code: 'NOT_FOUND'
				});
			}

			return {
				closest_restock_date,
				current_stock: current_stock.quantity
			};
		}
	});
