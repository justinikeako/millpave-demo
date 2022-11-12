import { addBusinessDays, addHours } from 'date-fns';
import { nanoid } from 'nanoid';
import {
	Product,
	ProductDetails,
	RestockQueueElement,
	SKU,
	Stock
} from '../types/product';

const color_fragments = [
	{ id: 'grey', displayName: 'Grey', css: '#D9D9D9' },
	{ id: 'ash', displayName: 'Ash', css: '#B1B1B1' },
	{ id: 'charcoal', displayName: 'Charcoal', css: '#696969' },
	{
		id: 'slate',
		displayName: 'Slate',
		css: 'linear-gradient(45deg, #696969 50%, #D9D9D9 50%)'
	},
	{ id: 'spanish_brown', displayName: 'Spanish Brown', css: '#95816D' },
	{ id: 'sunset_taupe', displayName: 'Sunset Taupe', css: '#C9B098' },
	{ id: 'tan', displayName: 'Tan', css: '#DDCCBB' },
	{ id: 'shale_brown', displayName: 'Shale Brown', css: '#907A7A' },
	{ id: 'sunset_clay', displayName: 'Sunset Clay', css: '#E7A597' },
	{ id: 'red', displayName: 'Red', css: '#EF847A' },
	{
		id: 'charcoal_red',
		displayName: 'Charcoal Red',
		css: 'linear-gradient(45deg, #696969 50%, #EF847A 50%)'
	},
	{
		id: 'red_yellow',
		displayName: 'Red Yellow',
		css: 'linear-gradient(45deg, #EF847A 50%, #E7DD69 50%)'
	},
	{ id: 'terracotta', displayName: 'Terracotta', css: '#EFA17A' },
	{ id: 'orange', displayName: 'Orange', css: '#EBB075' },
	{ id: 'sunset_tangerine', displayName: 'Sunset Tangerine', css: '#E7C769' },
	{ id: 'yellow', displayName: 'Yellow', css: '#E7DD69' },
	{ id: 'green', displayName: 'Green', css: '#A9D786' }
];

const DETAILS: ProductDetails[] = [
	{
		product_id: 'colonial_classic',
		matcher: 'colonial_classic',
		dimensions: [4, 8, 2.375],
		lbs_per_unit: 5,
		sqft_per_pallet: 128.75,
		units_per_pallet: 600,
		pcs_per_sqft: 4.66
	},
	{
		product_id: 'thin_classic',
		matcher: 'thin_classic',
		dimensions: [4, 8, 1.375],
		lbs_per_unit: 4.16,
		sqft_per_pallet: 154.5,
		units_per_pallet: 720,
		pcs_per_sqft: 4.66
	},
	{
		product_id: 'banjo',
		matcher: 'banjo',
		dimensions: [5.5, 9, 2.375],
		lbs_per_unit: 6.67,
		sqft_per_pallet: 128.57,
		units_per_pallet: 450,
		pcs_per_sqft: 3.5
	},
	{
		product_id: 'owc',
		matcher: 'owc',
		dimensions: [5.5, 9, 2.375],
		lbs_per_unit: 3.75,
		sqft_per_pallet: 125.39,
		units_per_pallet: 800,
		pcs_per_sqft: 6.38
	},
	{
		product_id: 'cobble_mix',
		matcher: 'cobble_mix:double',
		dimensions: [7, 9.5, 2.375],
		lbs_per_unit: 11.28,
		sqft_per_pallet: 119.28,
		units_per_pallet: 266,
		pcs_per_sqft: 2.23
	},
	{
		product_id: 'cobble_mix',
		matcher: 'cobble_mix:oblong',
		dimensions: [4.75, 7, 2.375],
		lbs_per_unit: 5.3,
		sqft_per_pallet: 126.91,
		units_per_pallet: 566,
		pcs_per_sqft: 4.46
	},
	{
		product_id: 'cobble_mix',
		matcher: 'cobble_mix:two_part',
		dimensions: [4.75, 7, 2.375],
		lbs_per_unit: 3.53,
		sqft_per_pallet: 130.97,
		units_per_pallet: 850,
		pcs_per_sqft: 6.49 // think about how to add supply ratios
	},
	{
		product_id: 'heritage',
		matcher: 'heritage:regular',
		dimensions: [6, 9, 2.375],
		lbs_per_unit: 9.15,
		sqft_per_pallet: 120.59,
		units_per_pallet: 328,
		pcs_per_sqft: 2.72
	},
	{
		product_id: 'heritage',
		matcher: 'heritage:square',
		dimensions: [6, 6, 2.375],
		lbs_per_unit: 5.86,
		sqft_per_pallet: 128,
		units_per_pallet: 512,
		pcs_per_sqft: 4
	},
	{
		product_id: 'heritage',
		matcher: 'heritage:two_part',
		dimensions: [6, 9, 2.375],
		lbs_per_unit: 5.77,
		sqft_per_pallet: 130,
		units_per_pallet: 520,
		pcs_per_sqft: 4
	},
	{
		product_id: 'tropical_wave',
		matcher: 'tropical_wave',
		dimensions: [4.75, 9.5, 3],
		lbs_per_unit: 9.38,
		sqft_per_pallet: 102.89,
		units_per_pallet: 320,
		pcs_per_sqft: 3.11
	}
];

// Mock Products
const COLONIAL_CLASSIC: Product = {
	id: 'colonial_classic',
	defaultSkuIdTemplate: '[color]',
	lowestPrice: 203,
	pickupLocations: ['FACTORY', 'SHOWROOM'],
	category: { id: 'concret_pavers', displayName: 'Concrete Pavers' },
	displayName: 'Colonial Classic',
	gallery: [
		{
			id: nanoid(),
			imgUrl:
				'http://mobileimages.lowes.com/productimages/e17627ec-4502-40ad-8f2c-21d1f7e53c11/43213000.jpg'
		},
		{
			id: nanoid(),
			imgUrl:
				'https://i.pinimg.com/originals/e7/f7/4d/e7f74d6f1a90cc47068e96baa67868f1.jpg'
		},
		{
			id: nanoid(),
			imgUrl:
				'https://i.pinimg.com/originals/b0/65/13/b06513eb47b0917940f8930b98c0021e.jpg'
		}
	],
	similarProducts: ['thin_classic', 'banjo'],
	skuIdFragments: [
		{
			type: 'color',
			displayName: 'Color',
			fragments: color_fragments
		}
	]
};

const THIN_CLASSIC: Product = {
	id: 'thin_classic',
	defaultSkuIdTemplate: '[color]',
	lowestPrice: 188,
	pickupLocations: ['FACTORY', 'SHOWROOM'],
	category: { id: 'concret_pavers', displayName: 'Concrete Pavers' },
	displayName: 'Thin Classic',
	gallery: [
		{
			id: nanoid(),
			imgUrl:
				'http://mobileimages.lowes.com/productimages/e17627ec-4502-40ad-8f2c-21d1f7e53c11/43213000.jpg'
		},
		{
			id: nanoid(),
			imgUrl:
				'https://i.pinimg.com/originals/e7/f7/4d/e7f74d6f1a90cc47068e96baa67868f1.jpg'
		},
		{
			id: nanoid(),
			imgUrl:
				'https://i.pinimg.com/originals/b0/65/13/b06513eb47b0917940f8930b98c0021e.jpg'
		}
	],
	similarProducts: ['colonial_classic', 'banjo'],
	skuIdFragments: [
		{
			type: 'color',
			displayName: 'Color',
			fragments: color_fragments
		}
	]
};

const BANJO: Product = {
	id: 'banjo',
	defaultSkuIdTemplate: '[color]',
	lowestPrice: 219,
	pickupLocations: ['FACTORY', 'SHOWROOM'],
	category: { id: 'concret_pavers', displayName: 'Concrete Pavers' },
	displayName: 'Banjo',
	gallery: [
		{
			id: nanoid(),
			imgUrl:
				'http://mobileimages.lowes.com/productimages/e17627ec-4502-40ad-8f2c-21d1f7e53c11/43213000.jpg'
		},
		{
			id: nanoid(),
			imgUrl:
				'https://i.pinimg.com/originals/e7/f7/4d/e7f74d6f1a90cc47068e96baa67868f1.jpg'
		},
		{
			id: nanoid(),
			imgUrl:
				'https://i.pinimg.com/originals/b0/65/13/b06513eb47b0917940f8930b98c0021e.jpg'
		}
	],
	similarProducts: ['colonial_classic', 'owc'],
	skuIdFragments: [
		{
			type: 'color',
			displayName: 'Color',
			fragments: color_fragments
		}
	]
};

const OWC: Product = {
	id: 'owc',
	defaultSkuIdTemplate: '[color]',
	lowestPrice: 203,
	pickupLocations: ['FACTORY'],
	category: { id: 'concret_pavers', displayName: 'Concrete Pavers' },
	displayName: 'Old World Cobble',
	gallery: [
		{
			id: nanoid(),
			imgUrl:
				'http://mobileimages.lowes.com/productimages/e17627ec-4502-40ad-8f2c-21d1f7e53c11/43213000.jpg'
		},
		{
			id: nanoid(),
			imgUrl:
				'https://i.pinimg.com/originals/e7/f7/4d/e7f74d6f1a90cc47068e96baa67868f1.jpg'
		},
		{
			id: nanoid(),
			imgUrl:
				'https://i.pinimg.com/originals/b0/65/13/b06513eb47b0917940f8930b98c0021e.jpg'
		}
	],
	similarProducts: ['colonial_classic', 'cobble_mix'],
	skuIdFragments: [
		{
			type: 'color',
			displayName: 'Color',
			fragments: color_fragments
		}
	]
};

const COBBLE_MIX: Product = {
	id: 'cobble_mix',
	defaultSkuIdTemplate: 'oblong:[color]',
	lowestPrice: 219,
	pickupLocations: ['FACTORY'],
	category: { id: 'concret_pavers', displayName: 'Concrete Pavers' },
	displayName: 'Cobble Mix',
	gallery: [
		{
			id: nanoid(),
			imgUrl:
				'http://mobileimages.lowes.com/productimages/e17627ec-4502-40ad-8f2c-21d1f7e53c11/43213000.jpg'
		},
		{
			id: nanoid(),
			imgUrl:
				'https://i.pinimg.com/originals/e7/f7/4d/e7f74d6f1a90cc47068e96baa67868f1.jpg'
		},
		{
			id: nanoid(),
			imgUrl:
				'https://i.pinimg.com/originals/b0/65/13/b06513eb47b0917940f8930b98c0021e.jpg'
		}
	],
	similarProducts: ['heritage', 'owc'],
	skuIdFragments: [
		{
			type: 'variant',
			displayName: 'Variant',
			fragments: [
				{ id: 'double', displayName: 'Double' },
				{ id: 'oblong', displayName: 'Oblong' },
				{ id: 'two_part', displayName: 'Two Part' }
			]
		},
		{
			type: 'color',
			displayName: 'Color',
			fragments: color_fragments
		}
	]
};

const HERITAGE: Product = {
	id: 'heritage',
	defaultSkuIdTemplate: 'regular:[color]',
	lowestPrice: 203,
	pickupLocations: ['FACTORY'],
	category: { id: 'concret_pavers', displayName: 'Concrete Pavers' },
	displayName: 'Heritage Series',
	gallery: [
		{
			id: nanoid(),
			imgUrl:
				'http://mobileimages.lowes.com/productimages/e17627ec-4502-40ad-8f2c-21d1f7e53c11/43213000.jpg'
		},
		{
			id: nanoid(),
			imgUrl:
				'https://i.pinimg.com/originals/e7/f7/4d/e7f74d6f1a90cc47068e96baa67868f1.jpg'
		},
		{
			id: nanoid(),
			imgUrl:
				'https://i.pinimg.com/originals/b0/65/13/b06513eb47b0917940f8930b98c0021e.jpg'
		}
	],
	similarProducts: ['cobble_mix', 'owc'],
	skuIdFragments: [
		{
			type: 'variant',
			displayName: 'Variant',
			fragments: [
				{ id: 'regular', displayName: 'Regular' },
				{ id: 'square', displayName: 'Square' },
				{ id: 'two_part', displayName: 'Two Part' }
			]
		},
		{
			type: 'color',
			displayName: 'Color',
			fragments: color_fragments
		}
	]
};

const TROPICAL_WAVE: Product = {
	id: 'tropical_wave',
	defaultSkuIdTemplate: '[color]',
	lowestPrice: 203,
	pickupLocations: ['FACTORY'],
	category: { id: 'concret_pavers', displayName: 'Concrete Pavers' },
	displayName: 'Tropical Wave',
	gallery: [
		{
			id: nanoid(),
			imgUrl:
				'http://mobileimages.lowes.com/productimages/e17627ec-4502-40ad-8f2c-21d1f7e53c11/43213000.jpg'
		},
		{
			id: nanoid(),
			imgUrl:
				'https://i.pinimg.com/originals/e7/f7/4d/e7f74d6f1a90cc47068e96baa67868f1.jpg'
		},
		{
			id: nanoid(),
			imgUrl:
				'https://i.pinimg.com/originals/b0/65/13/b06513eb47b0917940f8930b98c0021e.jpg'
		}
	],
	similarProducts: ['colonial_classic', 'cobble_mix'],
	skuIdFragments: [
		{
			type: 'color',
			displayName: 'Color',
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

function generateSKUList(
	product: { id: string; displayName: string },
	prices: [number, number, number, number, number]
): SKU[] {
	return color_fragments.map((color) => {
		const price: Record<string, number> = {
			grey: prices[0],
			yellow: prices[2],
			white: prices[3],
			green: prices[4]
		};

		return {
			id: `${product.id}:${color.id}`,
			displayName: `${product.displayName} ${color.displayName}`,
			price: price[color.id] || prices[1]
		} as SKU;
	});
}

// Mock SKUs
const SKUS: SKU[] = [
	...generateSKUList(
		{ id: 'colonial_classic', displayName: 'Colonial Classic' },
		[203, 228, 233, 260.27, 363]
	),
	...generateSKUList(
		{ id: 'thin_classic', displayName: 'Thin Classic' },
		[188, 210, 215, 247, 333]
	),
	...generateSKUList(
		{ id: 'banjo', displayName: 'Banjo' },
		[219, 247, 253, 253, 396]
	),
	...generateSKUList(
		{ id: 'owc', displayName: 'Old World Cobble' },
		[203, 228, 233, 260.27, 363]
	),
	...generateSKUList(
		{ id: 'heritage:regular', displayName: 'Heritage Regular' },
		[219, 247, 253, 253, 396]
	),
	...generateSKUList(
		{ id: 'heritage:square', displayName: 'Heritage Square' },
		[219, 247, 253, 253, 396]
	),
	...generateSKUList(
		{ id: 'heritage:two_part', displayName: 'Heritage Two-Part' },
		[219, 247, 253, 253, 396]
	),
	...generateSKUList(
		{ id: 'cobble_mix:double', displayName: 'Cobble Mix Double' },
		[219, 247, 253, 253, 396]
	),
	...generateSKUList(
		{ id: 'cobble_mix:oblong', displayName: 'Cobble Mix Oblong' },
		[219, 247, 253, 253, 396]
	),
	...generateSKUList(
		{ id: 'cobble_mix:two_part', displayName: 'Cobble Mix Two-Part' },
		[219, 247, 253, 253, 396]
	),
	...generateSKUList(
		{ id: 'tropical_wave', displayName: 'Tropical Wave' },
		[228.5, 267.5, 275.5, 305.5, 445.5]
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
	skuIdPrefix: string,
	popularity: number,
	doneToOrder = false
): Stock[] {
	return color_fragments.flatMap(({ id: colorId }) => {
		const showroomQuantity = round(
			Math.random() * (2 * popularity) * 128.75,
			1 / 4.66
		);

		const factoryQuantity =
			Math.round(Math.random() * (30 * popularity)) * (128.75 / 2);

		return [
			{
				skuId: `${skuIdPrefix}:${colorId}`,
				location: 'SHOWROOM',
				quantity: doneToOrder ? 0 : coinFlip() ? showroomQuantity : 0
			},
			{
				skuId: `${skuIdPrefix}:${colorId}`,
				location: 'FACTORY',
				quantity: doneToOrder ? 0 : coinFlip() ? factoryQuantity : 0
			}
		];
	});
}

const STOCK: Stock[] = [
	...generateStock('colonial_classic', 1),
	...generateStock('banjo', 0.5),
	...generateStock('thin_classic', 0.1)
];

function generateRestockElements(
	skuIdPrefix: string,
	popularity: number
): RestockQueueElement[] {
	return color_fragments.flatMap(({ id: colorId }) => {
		const fromFactory = coinFlip();

		const factoryQuantity =
			(1 + Math.round(Math.random() * (30 * popularity))) * (128.75 / 2);
		const showroomQuantity =
			(1 + Math.round(Math.random() * popularity)) * (128.75 / 2);

		return coinFlip(popularity / 2)
			? [
					{
						skuId: `${skuIdPrefix}:${colorId}`,
						location: fromFactory ? 'FACTORY' : 'SHOWROOM',
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

const RESTOCK_QUEUE: RestockQueueElement[] = [
	...generateRestockElements('colonial_classic', 1),
	...generateRestockElements('banjo', 0.5),
	...generateRestockElements('thin_classic', 0.25)
];

export function getProduct(productId: string) {
	const foundProduct = PRODUCTS.find((product) => {
		return product.id === productId;
	});

	if (!foundProduct) throw new Error(`Product ${productId} does not exist`);

	return foundProduct;
}

export function getProducts() {
	return PRODUCTS;
}

export function getProductDetails(productId: string) {
	return DETAILS.filter((item) => item.product_id === productId);
}

export function getSkuDetails(skuId: string) {
	const [productId, ...skuIdFragment] = skuId.split(':');

	const details = DETAILS.find((details) => {
		return details.product_id === productId && skuId.includes(details.matcher);
	});

	if (!details) throw new Error(`No details found for '${skuIdFragment}'`);

	return details;
}

export function getProductSkus(productId: string) {
	return SKUS.filter((sku) => {
		const extractedProductId = sku.id.split(':').at(0);

		const matchesProductId = extractedProductId === productId;

		return matchesProductId;
	});
}

export function getSku(skuId: string) {
	const foundSku = SKUS.find((sku) => {
		return sku.id === skuId;
	});

	if (!foundSku) throw new Error(`Product ${skuId} does not exist`);

	return foundSku;
}

export function getProductStock(productId: string) {
	return STOCK.filter((item) => {
		const extractedProductId = item.skuId.split(':').at(0);

		const matchesProductId = extractedProductId === productId;

		return matchesProductId;
	});
}

export function getProductRestockQueue(productId: string) {
	return RESTOCK_QUEUE.filter((item) => {
		const extractedProductId = item.skuId.split(':').at(0);

		const matchesProductId = extractedProductId === productId;

		return matchesProductId;
	});
}
