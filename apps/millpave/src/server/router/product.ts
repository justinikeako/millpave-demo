import { createRouter } from './context';
import { z } from 'zod';
import { addBusinessDays, addHours } from 'date-fns';
import { nanoid } from 'nanoid';
import {
	Product,
	ProductDetails,
	RestockQueueElement,
	SKU,
	Stock
} from '../../types/product';
import { TRPCError } from '@trpc/server';

const color_fragments = [
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
];

const DETAILS: ProductDetails[] = [
	{
		product_id: 'colonial_classic',
		supports: [{ index: 0, values: 'all' }],
		dimensions: [4, 8, 2.375],
		lbs_per_unit: 5,
		sqft_per_pallet: 128.75,
		units_per_pallet: 600,
		pcs_per_sqft: 4.66
	},
	{
		product_id: 'thin_classic',
		supports: [{ index: 0, values: 'all' }],
		dimensions: [4, 8, 1.375],
		lbs_per_unit: 5,
		sqft_per_pallet: 154.5,
		units_per_pallet: 720,
		pcs_per_sqft: 4.66
	},
	{
		product_id: 'banjo',
		supports: [{ index: 0, values: 'all' }],
		dimensions: [5.5, 9, 2.375],
		lbs_per_unit: 5,
		sqft_per_pallet: 128.57,
		units_per_pallet: 450,
		pcs_per_sqft: 3.5
	},
	{
		product_id: 'owc',
		supports: [{ index: 0, values: 'all' }],
		dimensions: [5.5, 9, 2.375],
		lbs_per_unit: 5,
		sqft_per_pallet: 125.39,
		units_per_pallet: 800,
		pcs_per_sqft: 6.38
	},
	{
		product_id: 'tropical_wave',
		supports: [{ index: 0, values: 'all' }],
		dimensions: [4.75, 9.5, 3],
		lbs_per_unit: 5,
		sqft_per_pallet: 102.89,
		units_per_pallet: 320,
		pcs_per_sqft: 3.11
	},
	{
		product_id: 'heritage',
		supports: [
			{ index: 0, values: ['regular'] },
			{ index: 1, values: 'all' }
		],
		dimensions: [6, 9, 2.375],
		lbs_per_unit: 5,
		sqft_per_pallet: 120.59,
		units_per_pallet: 328,
		pcs_per_sqft: 2.72
	},
	{
		product_id: 'heritage',
		supports: [
			{ index: 0, values: ['square'] },
			{ index: 1, values: 'all' }
		],
		dimensions: [6, 6, 2.375],
		lbs_per_unit: 5,
		sqft_per_pallet: 128,
		units_per_pallet: 512,
		pcs_per_sqft: 4
	},
	{
		product_id: 'heritage',
		supports: [
			{ index: 0, values: ['two_part'] },
			{ index: 1, values: 'all' }
		],
		dimensions: [6, 9, 2.375],
		lbs_per_unit: 5,
		sqft_per_pallet: 130,
		units_per_pallet: 520,
		pcs_per_sqft: 4 // think about how to add supply ratios
	},
	{
		product_id: 'cobble_mix',
		supports: [
			{ index: 0, values: ['double'] },
			{ index: 1, values: 'all' }
		],
		dimensions: [7, 9.5, 2.375],
		lbs_per_unit: 5,
		sqft_per_pallet: 119.28,
		units_per_pallet: 266,
		pcs_per_sqft: 2.23
	},
	{
		product_id: 'cobble_mix',
		supports: [
			{ index: 0, values: ['oblong'] },
			{ index: 1, values: 'all' }
		],
		dimensions: [4.75, 7, 2.375],
		lbs_per_unit: 5,
		sqft_per_pallet: 126.91,
		units_per_pallet: 566,
		pcs_per_sqft: 4.46
	},
	{
		product_id: 'cobble_mix',
		supports: [
			{ index: 0, values: ['two_part'] },
			{ index: 1, values: 'all' }
		],
		dimensions: [4.75, 7, 2.375],
		lbs_per_unit: 5,
		sqft_per_pallet: 130.97,
		units_per_pallet: 850,
		pcs_per_sqft: 6.49 // think about how to add supply ratios
	}
];

// Mock Products
const COLONIAL_CLASSIC: Product = {
	id: 'colonial_classic',
	pickup_location_list: ['factory', 'showroom'],
	category: { id: 'concret_pavers', display_name: 'Concrete Pavers' },
	display_name: 'Colonial Classic',
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
			id: 'thin_classic',
			display_name: 'Thin Classic',
			default_sku_id_fragment: ['[color]'],
			price: 188
		},
		{
			id: 'banjo',
			display_name: 'Banjo',
			default_sku_id_fragment: ['[color]'],
			price: 219
		}
	],
	sku_id_fragments: [
		{
			index: 0,
			type: 'color',
			display_name: 'Colors',
			fragments: color_fragments
		}
	]
};

const THIN_CLASSIC: Product = {
	id: 'thin_classic',
	pickup_location_list: ['factory', 'showroom'],
	category: { id: 'concret_pavers', display_name: 'Concrete Pavers' },
	display_name: 'Thin Classic',
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
			id: 'colonial_classic',
			display_name: 'Colonial Classic',
			default_sku_id_fragment: ['[color]'],
			price: 203
		},
		{
			id: 'banjo',
			display_name: 'Banjo',
			default_sku_id_fragment: ['[color]'],
			price: 219
		}
	],
	sku_id_fragments: [
		{
			index: 0,
			type: 'color',
			display_name: 'Colors',
			fragments: color_fragments
		}
	]
};

const BANJO: Product = {
	id: 'banjo',
	pickup_location_list: ['factory', 'showroom'],
	category: { id: 'concret_pavers', display_name: 'Concrete Pavers' },
	display_name: 'Banjo',
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
			id: 'colonial_classic',
			display_name: 'Colonial Classic',
			default_sku_id_fragment: ['[color]'],
			price: 203
		},
		{
			id: 'thin_classic',
			display_name: 'Thin Classic',
			default_sku_id_fragment: ['[color]'],
			price: 188
		}
	],
	sku_id_fragments: [
		{
			index: 0,
			type: 'color',
			display_name: 'Colors',
			fragments: color_fragments
		}
	]
};

const OWC: Product = {
	id: 'owc',
	pickup_location_list: ['factory'],
	category: { id: 'concret_pavers', display_name: 'Concrete Pavers' },
	display_name: 'OWC',
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
			id: 'colonial_classic',
			display_name: 'Colonial Classic',
			default_sku_id_fragment: ['[color]'],
			price: 203
		},
		{
			id: 'cobble_mix',
			display_name: 'Cobble Mix',
			default_sku_id_fragment: ['oblong', '[color]'],
			price: 219
		}
	],
	sku_id_fragments: [
		{
			index: 0,
			type: 'color',
			display_name: 'Colors',
			fragments: color_fragments
		}
	]
};

const TROPICAL_WAVE: Product = {
	id: 'tropical_wave',
	pickup_location_list: ['factory'],
	category: { id: 'concret_pavers', display_name: 'Concrete Pavers' },
	display_name: 'TROPICAL_WAVE',
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
			id: 'colonial_classic',
			display_name: 'Colonial Classic',
			default_sku_id_fragment: ['[color]'],
			price: 203
		},
		{
			id: 'cobble_mix',
			display_name: 'Cobble Mix',
			default_sku_id_fragment: ['oblong', '[color]'],
			price: 219
		}
	],
	sku_id_fragments: [
		{
			index: 0,
			type: 'color',
			display_name: 'Colors',
			fragments: color_fragments
		}
	]
};

const HERITAGE: Product = {
	id: 'heritage',
	pickup_location_list: ['factory'],
	category: { id: 'concret_pavers', display_name: 'Concrete Pavers' },
	display_name: 'Heritage Series',
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
			id: 'cobble_mix',
			display_name: 'Cobble Mix',
			default_sku_id_fragment: ['oblong', '[color]'],
			price: 219
		},
		{
			id: 'owc',
			display_name: 'Old World Cobble',
			default_sku_id_fragment: ['[color]'],
			price: 203
		}
	],
	sku_id_fragments: [
		{
			index: 0,
			type: 'variant',
			display_name: 'Variant',
			fragments: [
				{ id: 'regular', display_name: 'Regular' },
				{ id: 'square', display_name: 'Square' },
				{ id: 'two_part', display_name: 'Two Part' }
			]
		},
		{
			index: 1,
			type: 'color',
			display_name: 'Colors',
			fragments: color_fragments
		}
	]
};

const COBBLE_MIX: Product = {
	id: 'cobble_mix',
	pickup_location_list: ['factory'],
	category: { id: 'concret_pavers', display_name: 'Concrete Pavers' },
	display_name: 'Cobble Mix',
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
			id: 'heritage',
			display_name: 'Heritage Series',
			default_sku_id_fragment: ['regular', '[color]'],
			price: 203
		},
		{
			id: 'owc',
			display_name: 'Old World Cobble',
			default_sku_id_fragment: ['[color]'],
			price: 188
		}
	],
	sku_id_fragments: [
		{
			index: 0,
			type: 'variant',
			display_name: 'Variant',
			fragments: [
				{ id: 'double', display_name: 'Double' },
				{ id: 'oblong', display_name: 'Oblong' },
				{ id: 'two_part', display_name: 'Two Part' }
			]
		},
		{
			index: 1,
			type: 'color',
			display_name: 'Colors',
			fragments: color_fragments
		}
	]
};

const PRODUCTS = [
	COLONIAL_CLASSIC,
	THIN_CLASSIC,
	BANJO,
	OWC,
	TROPICAL_WAVE,
	HERITAGE,
	COBBLE_MIX
];

const color_id_list = [
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

const color_display_name_list = [
	'Grey',
	'Ash',
	'Charcoal',
	'Spanish Brown',
	'Sunset Taupe',
	'Tan',
	'Shale Brown',
	'Sunset Clay',
	'Red',
	'Terracotta',
	'Orange',
	'Sunset Tangerine',
	'Yellow',
	'Green'
];

function generateSKUList(
	{ productId, displayName }: { productId: string; displayName: string },
	prices: [number, number, number, number, number]
): SKU[] {
	return color_id_list.map((colorId, index) => {
		const price: Record<string, number> = {
			grey: prices[0],
			yellow: prices[2],
			white: prices[3],
			green: prices[4]
		};

		return {
			id: `${productId}:${colorId}`,
			display_name: `${displayName} ${color_display_name_list[index]}`,
			price: price[colorId] || prices[1]
		} as SKU;
	});
}

// Mock SKUs
const skuList: SKU[] = [
	...generateSKUList(
		{ productId: 'colonial_classic', displayName: 'Colonial Classic' },
		[203, 228, 233, 260.27, 363]
	),
	...generateSKUList(
		{ productId: 'thin_classic', displayName: 'Thin Classic' },
		[188, 210, 215, 247, 333]
	),
	...generateSKUList(
		{ productId: 'banjo', displayName: 'Banjo' },
		[219, 247, 253, 253, 396]
	),
	...generateSKUList(
		{ productId: 'owc', displayName: 'Old World Cobble' },
		[203, 228, 233, 260.27, 363]
	),
	...generateSKUList(
		{ productId: 'tropical_wave', displayName: 'Tropical Wave' },
		[228.5, 267.5, 275.5, 305.5, 445.5]
	),
	...generateSKUList(
		{ productId: 'heritage:regular', displayName: 'Heritage Regular' },
		[219, 247, 253, 253, 396]
	),
	...generateSKUList(
		{ productId: 'heritage:square', displayName: 'Heritage Square' },
		[219, 247, 253, 253, 396]
	),
	...generateSKUList(
		{ productId: 'heritage:two_part', displayName: 'Heritage Two-Part' },
		[219, 247, 253, 253, 396]
	),
	...generateSKUList(
		{ productId: 'cobble_mix:double', displayName: 'Cobble Mix Double' },
		[219, 247, 253, 253, 396]
	),
	...generateSKUList(
		{ productId: 'cobble_mix:oblong', displayName: 'Cobble Mix Oblong' },
		[219, 247, 253, 253, 396]
	),
	...generateSKUList(
		{ productId: 'cobble_mix:two_part', displayName: 'Cobble Mix Two-Part' },
		[219, 247, 253, 253, 396]
	)
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

function generateStock(
	productId: string,
	popularity: number,
	doneToOrder = false
): Stock[] {
	return color_id_list.flatMap((color) => {
		const showroomQuantity = round(
			Math.random() * (2 * popularity) * 128.75,
			1 / 4.66
		);

		const factoryQuantity =
			Math.round(Math.random() * (30 * popularity)) * (128.75 / 2);

		return [
			{
				sku_id: `${productId}:${color}`,
				location: 'showroom',
				quantity: doneToOrder ? 0 : coinFlip() ? showroomQuantity : 0
			},
			{
				sku_id: `${productId}:${color}`,
				location: 'factory',
				quantity: doneToOrder ? 0 : coinFlip() ? factoryQuantity : 0
			}
		];
	});
}

const stock: Stock[] = [
	...generateStock('colonial_classic', 1),
	...generateStock('banjo', 0.5),
	...generateStock('thin_classic', 0.1)
];

function generateRestockElements(
	productId: string,
	popularity: number
): RestockQueueElement[] {
	return color_id_list.flatMap((color) => {
		const fromFactory = coinFlip();

		const factoryQuantity =
			(1 + Math.round(Math.random() * (30 * popularity))) * (128.75 / 2);
		const showroomQuantity =
			(1 + Math.round(Math.random() * popularity)) * (128.75 / 2);

		return coinFlip(popularity / 2)
			? [
					{
						sku_id: `${productId}:${color}`,
						location: fromFactory ? 'factory' : 'showroom',
						quantity: fromFactory ? factoryQuantity : showroomQuantity,
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
}

const restockQueue: RestockQueueElement[] = [
	...generateRestockElements('colonial_classic', 1),
	...generateRestockElements('banjo', 0.5),
	...generateRestockElements('thin_classic', 0.25)
];

export const productRouter = createRouter().query('get', {
	input: z.object({
		productId: z.string()
	}),
	resolve({ input }) {
		const product = PRODUCTS.find((product) => {
			return product.id === input.productId;
		});

		const filterPredicate = (item: Stock | RestockQueueElement) => {
			const productId = item.sku_id.split(':').at(0);

			const matchesProductId = productId === input.productId;

			return matchesProductId;
		};

		const productDetails = DETAILS.filter(
			(item) => item.product_id === input.productId
		);

		const productSkuList = skuList.filter((sku) => {
			const productId = sku.id.split(':').at(0);

			const matchesProductId = productId === input.productId;

			return matchesProductId;
		});

		const productStock = stock.filter(filterPredicate);

		const productQueue = restockQueue.filter(filterPredicate);

		if (!product) {
			throw new TRPCError({
				message: `SKU '${input.productId}' does not exist`,
				code: 'NOT_FOUND'
			});
		}

		return {
			...product,
			skuList: productSkuList,
			stock: productStock,
			queue: productQueue,
			details: productDetails
		};
	}
});
