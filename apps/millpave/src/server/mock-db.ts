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
	{ id: 'grey', display_name: 'Grey', css: '#D9D9D9' },
	{ id: 'ash', display_name: 'Ash', css: '#B1B1B1' },
	{ id: 'charcoal', display_name: 'Charcoal', css: '#696969' },
	{
		id: 'slate',
		display_name: 'Slate',
		css: 'linear-gradient(45deg, #696969 50%, #D9D9D9 50%)'
	},
	{ id: 'spanish_brown', display_name: 'Spanish Brown', css: '#95816D' },
	{ id: 'sunset_taupe', display_name: 'Sunset Taupe', css: '#C9B098' },
	{ id: 'tan', display_name: 'Tan', css: '#DDCCBB' },
	{ id: 'shale_brown', display_name: 'Shale Brown', css: '#907A7A' },
	{ id: 'sunset_clay', display_name: 'Sunset Clay', css: '#E7A597' },
	{ id: 'red', display_name: 'Red', css: '#EF847A' },
	{
		id: 'charcoal_red',
		display_name: 'Charcoal Red',
		css: 'linear-gradient(45deg, #696969 50%, #EF847A 50%)'
	},
	{
		id: 'red_yellow',
		display_name: 'Red Yellow',
		css: 'linear-gradient(45deg, #EF847A 50%, #E7DD69 50%)'
	},
	{ id: 'terracotta', display_name: 'Terracotta', css: '#EFA17A' },
	{ id: 'orange', display_name: 'Orange', css: '#EBB075' },
	{ id: 'sunset_tangerine', display_name: 'Sunset Tangerine', css: '#E7C769' },
	{ id: 'yellow', display_name: 'Yellow', css: '#E7DD69' },
	{ id: 'green', display_name: 'Green', css: '#A9D786' }
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
		lbs_per_unit: 4.16,
		sqft_per_pallet: 154.5,
		units_per_pallet: 720,
		pcs_per_sqft: 4.66
	},
	{
		product_id: 'banjo',
		supports: [{ index: 0, values: 'all' }],
		dimensions: [5.5, 9, 2.375],
		lbs_per_unit: 6.67,
		sqft_per_pallet: 128.57,
		units_per_pallet: 450,
		pcs_per_sqft: 3.5
	},
	{
		product_id: 'owc',
		supports: [{ index: 0, values: 'all' }],
		dimensions: [5.5, 9, 2.375],
		lbs_per_unit: 3.75,
		sqft_per_pallet: 125.39,
		units_per_pallet: 800,
		pcs_per_sqft: 6.38
	},
	{
		product_id: 'cobble_mix',
		supports: [
			{ index: 0, values: ['double'] },
			{ index: 1, values: 'all' }
		],
		dimensions: [7, 9.5, 2.375],
		lbs_per_unit: 11.28,
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
		lbs_per_unit: 5.3,
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
		lbs_per_unit: 3.53,
		sqft_per_pallet: 130.97,
		units_per_pallet: 850,
		pcs_per_sqft: 6.49 // think about how to add supply ratios
	},
	{
		product_id: 'heritage',
		supports: [
			{ index: 0, values: ['regular'] },
			{ index: 1, values: 'all' }
		],
		dimensions: [6, 9, 2.375],
		lbs_per_unit: 9.15,
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
		lbs_per_unit: 5.86,
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
		lbs_per_unit: 5.77,
		sqft_per_pallet: 130,
		units_per_pallet: 520,
		pcs_per_sqft: 4
	},
	{
		product_id: 'tropical_wave',
		supports: [{ index: 0, values: 'all' }],
		dimensions: [4.75, 9.5, 3],
		lbs_per_unit: 9.38,
		sqft_per_pallet: 102.89,
		units_per_pallet: 320,
		pcs_per_sqft: 3.11
	}
];

const recommend = {
	colonial_classic: {
		id: 'colonial_classic',
		display_name: 'Colonial Classic',
		default_sku_id_fragment: ['[color]'],
		price: 203
	},
	thin_classic: {
		id: 'thin_classic',
		display_name: 'Thin Classic',
		default_sku_id_fragment: ['[color]'],
		price: 188
	},
	banjo: {
		id: 'banjo',
		display_name: 'Banjo',
		default_sku_id_fragment: ['[color]'],
		price: 219
	},
	owc: {
		id: 'owc',
		display_name: 'Old World Cobble',
		default_sku_id_fragment: ['[color]'],
		price: 203
	},
	cobble_mix: {
		id: 'cobble_mix',
		display_name: 'Cobble Mix',
		default_sku_id_fragment: ['oblong', '[color]'],
		price: 219
	},
	heritage: {
		id: 'heritage',
		display_name: 'Heritage Series',
		default_sku_id_fragment: ['regular', '[color]'],
		price: 203
	},
	tropical_wave: {
		id: 'tropical_wave',
		display_name: 'Tropical Wave',
		default_sku_id_fragment: ['[color]'],
		price: 203
	}
};

// Mock Products
const COLONIAL_CLASSIC: Product = {
	id: 'colonial_classic',
	pickup_location_list: ['FACTORY', 'SHOWROOM'],
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
	similar_products: [recommend.thin_classic, recommend.banjo],
	sku_id_fragments: [
		{
			index: 0,
			type: 'color',
			display_name: 'Color',
			fragments: color_fragments
		}
	]
};

const THIN_CLASSIC: Product = {
	id: 'thin_classic',
	pickup_location_list: ['FACTORY', 'SHOWROOM'],
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
	similar_products: [recommend.colonial_classic, recommend.banjo],
	sku_id_fragments: [
		{
			index: 0,
			type: 'color',
			display_name: 'Color',
			fragments: color_fragments
		}
	]
};

const BANJO: Product = {
	id: 'banjo',
	pickup_location_list: ['FACTORY', 'SHOWROOM'],
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
	similar_products: [recommend.colonial_classic, recommend.owc],
	sku_id_fragments: [
		{
			index: 0,
			type: 'color',
			display_name: 'Color',
			fragments: color_fragments
		}
	]
};

const OWC: Product = {
	id: 'owc',
	pickup_location_list: ['FACTORY'],
	category: { id: 'concret_pavers', display_name: 'Concrete Pavers' },
	display_name: 'Old World Cobble',
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
	similar_products: [recommend.colonial_classic, recommend.cobble_mix],
	sku_id_fragments: [
		{
			index: 0,
			type: 'color',
			display_name: 'Color',
			fragments: color_fragments
		}
	]
};

const COBBLE_MIX: Product = {
	id: 'cobble_mix',
	pickup_location_list: ['FACTORY'],
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
	similar_products: [recommend.heritage, recommend.owc],
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
			display_name: 'Color',
			fragments: color_fragments
		}
	]
};

const HERITAGE: Product = {
	id: 'heritage',
	pickup_location_list: ['FACTORY'],
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
	similar_products: [recommend.cobble_mix, recommend.owc],
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
			display_name: 'Color',
			fragments: color_fragments
		}
	]
};

const TROPICAL_WAVE: Product = {
	id: 'tropical_wave',
	pickup_location_list: ['FACTORY'],
	category: { id: 'concret_pavers', display_name: 'Concrete Pavers' },
	display_name: 'Tropical Wave',
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
	similar_products: [recommend.colonial_classic, recommend.cobble_mix],
	sku_id_fragments: [
		{
			index: 0,
			type: 'color',
			display_name: 'Color',
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
			display_name: `${product.displayName} ${color.display_name}`,
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
				sku_id: `${skuIdPrefix}:${colorId}`,
				location: 'SHOWROOM',
				quantity: doneToOrder ? 0 : coinFlip() ? showroomQuantity : 0
			},
			{
				sku_id: `${skuIdPrefix}:${colorId}`,
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
						sku_id: `${skuIdPrefix}:${colorId}`,
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

export function getProductDetails(productId: string) {
	return DETAILS.filter((item) => item.product_id === productId);
}

export function getSkuDetails(skuId: string) {
	const [productId, ...skuIdFragment] = skuId.split(':');

	const details = DETAILS.find((details) => {
		return (
			details.product_id === productId &&
			details.supports.reduce((matches, { values, index }) => {
				return matches && values === 'all'
					? true
					: values.includes(skuIdFragment[index] || '');
			}, true)
		);
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
		const extractedProductId = item.sku_id.split(':').at(0);

		const matchesProductId = extractedProductId === productId;

		return matchesProductId;
	});
}

export function getProductRestockQueue(productId: string) {
	return RESTOCK_QUEUE.filter((item) => {
		const extractedProductId = item.sku_id.split(':').at(0);

		const matchesProductId = extractedProductId === productId;

		return matchesProductId;
	});
}
