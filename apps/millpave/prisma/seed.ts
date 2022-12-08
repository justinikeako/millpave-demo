import { Prisma, PrismaClient, PrismaPromise } from '@prisma/client';
import { addBusinessDays, addHours } from 'date-fns';

const prisma = new PrismaClient();

type Product = Prisma.ProductCreateInput;
type ProductDetails = Prisma.ProductDetailsCreateManyInput;
type Sku = Prisma.SkuCreateManyInput;
type Stock = Prisma.StockCreateManyInput;
type Restock = Prisma.RestockCreateManyInput;
type PickupLocation = Prisma.PickupLocationCreateManyInput;

const PICKUP_LOCATIONS: Prisma.Enumerable<PickupLocation> = [
	{ id: 'KNG_SHOWROOM', displayName: 'Kingston Showroom' },
	{ id: 'STT_FACTORY', displayName: 'St. Thomas Factory' }
];

// Create pickup locations (shoroom and factory)
async function addPickupLocations() {
	await prisma.pickupLocation.createMany({
		data: PICKUP_LOCATIONS
	});
}

const PAVER_COLOR_FRAGMENTS = [
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

async function addCategory(
	id: string,
	displayName: string,
	products: Product[]
) {
	await prisma.category.create({
		data: {
			id,
			displayName
		}
	});

	const queries: PrismaPromise<any>[] = [];

	for (const product of products) {
		queries.push(prisma.product.create({ data: product }));
	}

	await prisma.$transaction(queries);
}

async function addPavers() {
	// Mock Products
	const PAVERS: Product[] = [
		{
			id: 'colonial_classic',
			defaultSkuIdTemplate: 'colonial_classic:[color]',
			defaultSkuId: 'colonial_classic:grey',
			displayName: 'Colonial Classic',
			similar: ['banjo', 'thin_classic', 'heritage'],
			skuIdFragments: [
				{
					type: 'color',
					displayName: 'Color',
					fragments: PAVER_COLOR_FRAGMENTS
				}
			]
		},
		{
			id: 'thin_classic',
			defaultSkuIdTemplate: 'thin_classic:[color]',
			defaultSkuId: 'thin_classic:grey',
			displayName: 'Thin Classic',
			similar: ['colonial_classic', 'banjo', 'heritage'],
			skuIdFragments: [
				{
					type: 'color',
					displayName: 'Color',
					fragments: PAVER_COLOR_FRAGMENTS
				}
			]
		},
		{
			id: 'banjo',
			defaultSkuIdTemplate: 'banjo:[color]',
			defaultSkuId: 'banjo:grey',
			displayName: 'Banjo',
			similar: ['colonial_classic', 'heritage', 'cobble_mix'],
			skuIdFragments: [
				{
					type: 'color',
					displayName: 'Color',
					fragments: PAVER_COLOR_FRAGMENTS
				}
			]
		},
		{
			id: 'owc',
			defaultSkuIdTemplate: 'owc:[color]',
			defaultSkuId: 'owc:grey',
			displayName: 'Old World Cobble',
			similar: ['cobble_mix', 'tropical_wave', 'colonial_classic'],
			skuIdFragments: [
				{
					type: 'color',
					displayName: 'Color',
					fragments: PAVER_COLOR_FRAGMENTS
				}
			]
		},
		{
			id: 'cobble_mix',
			defaultSkuIdTemplate: 'cobble_mix:oblong:[color]',
			defaultSkuId: 'cobble_mix:oblong:grey',
			displayName: 'Cobble Mix',
			similar: ['owc', 'heritage', 'colonial_classic'],
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
					fragments: PAVER_COLOR_FRAGMENTS
				}
			]
		},
		{
			id: 'heritage',
			defaultSkuIdTemplate: 'heritage:regular:[color]',
			defaultSkuId: 'heritage:regular:grey',
			displayName: 'Heritage Series',
			similar: ['colonial_classic', 'cobble_mix', 'owc'],
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
					fragments: PAVER_COLOR_FRAGMENTS
				}
			]
		},
		{
			id: 'tropical_wave',
			defaultSkuIdTemplate: 'tropical_wave:[color]',
			defaultSkuId: 'tropical_wave:grey',
			displayName: 'Tropical Wave',
			similar: ['owc', 'cobble_mix', 'colonial_classic'],
			skuIdFragments: [
				{
					type: 'color',
					displayName: 'Color',
					fragments: PAVER_COLOR_FRAGMENTS
				}
			]
		}
	].map(
		({ similar, ...product }): Product => ({
			...product,
			category: { connect: { id: 'concrete_pavers' } },
			pickupLocations: {
				create: [
					{ pickupLocation: { connect: { id: 'KNG_SHOWROOM' } } },
					{ pickupLocation: { connect: { id: 'STT_FACTORY' } } }
				]
			},
			similar: {
				create: similar.map((id, index) => ({
					similarId: id,
					relevance: similar.length - index
				}))
			},

			description: `Create a traditional feel to your garden with our ${product.displayName} Paver. As one of the most sought after styles of stone paving, it displays a beautiful range of colors which will brighten up any exterior to create an added sense of space! Using aggregates sourced from the St. Thomas River, ${product.displayName} promises an outdoor area filled with character and is a household favourite providing a wealth of design opportunities.`
		})
	);

	await addCategory('concrete_pavers', 'Concrete Pavers', PAVERS);
}

const PRODUCT_DETAILS: ProductDetails[] = [
	{
		matcher: 'colonial_classic',
		productId: 'colonial_classic',
		data: {
			dimensions: [4, 8, 2.375],
			lbs_per_unit: 5,
			sqft_per_pallet: 128.75,
			units_per_pallet: 600,
			pcs_per_sqft: 4.66
		}
	},
	{
		matcher: 'thin_classic',
		productId: 'thin_classic',
		data: {
			dimensions: [4, 8, 1.375],
			lbs_per_unit: 4.16,
			sqft_per_pallet: 154.5,
			units_per_pallet: 720,
			pcs_per_sqft: 4.66
		}
	},
	{
		matcher: 'banjo',
		productId: 'banjo',
		data: {
			dimensions: [5.5, 9, 2.375],
			lbs_per_unit: 6.67,
			sqft_per_pallet: 128.57,
			units_per_pallet: 450,
			pcs_per_sqft: 3.5
		}
	},
	{
		matcher: 'owc',
		productId: 'owc',
		data: {
			dimensions: [5.5, 9, 2.375],
			lbs_per_unit: 3.75,
			sqft_per_pallet: 125.39,
			units_per_pallet: 800,
			pcs_per_sqft: 6.38
		}
	},
	{
		matcher: 'cobble_mix:double',
		productId: 'cobble_mix',
		data: {
			dimensions: [7, 9.5, 2.375],
			lbs_per_unit: 11.28,
			sqft_per_pallet: 119.28,
			units_per_pallet: 266,
			pcs_per_sqft: 2.23
		}
	},
	{
		matcher: 'cobble_mix:oblong',
		productId: 'cobble_mix',
		data: {
			dimensions: [4.75, 7, 2.375],
			lbs_per_unit: 5.3,
			sqft_per_pallet: 126.91,
			units_per_pallet: 566,
			pcs_per_sqft: 4.46
		}
	},
	{
		matcher: 'cobble_mix:two_part',
		productId: 'cobble_mix',
		data: {
			dimensions: [4.75, 7, 2.375],
			lbs_per_unit: 3.53,
			sqft_per_pallet: 130.97,
			units_per_pallet: 850,
			pcs_per_sqft: 6.49
		}
	},
	{
		matcher: 'heritage:regular',
		productId: 'heritage',
		data: {
			dimensions: [6, 9, 2.375],
			lbs_per_unit: 9.15,
			sqft_per_pallet: 120.59,
			units_per_pallet: 328,
			pcs_per_sqft: 2.72
		}
	},
	{
		matcher: 'heritage:square',
		productId: 'heritage',
		data: {
			dimensions: [6, 6, 2.375],
			lbs_per_unit: 5.86,
			sqft_per_pallet: 128,
			units_per_pallet: 512,
			pcs_per_sqft: 4
		}
	},
	{
		matcher: 'heritage:two_part',
		productId: 'heritage',
		data: {
			dimensions: [6, 9, 2.375],
			lbs_per_unit: 5.77,
			sqft_per_pallet: 130,
			units_per_pallet: 520,
			pcs_per_sqft: 4
		}
	},
	{
		matcher: 'tropical_wave',
		productId: 'tropical_wave',
		data: {
			dimensions: [4.75, 9.5, 3],
			lbs_per_unit: 9.38,
			sqft_per_pallet: 102.89,
			units_per_pallet: 320,
			pcs_per_sqft: 3.11
		}
	}
];

async function addProductDetails() {
	// Create details for every product
	await prisma.productDetails.createMany({
		data: PRODUCT_DETAILS
	});
}

async function addPaverSkus() {
	function generatePaverSKUList(
		product: { id: string; displayName: string },
		prices: [number, number, number, number, number]
	): Sku[] {
		return PAVER_COLOR_FRAGMENTS.map((color) => {
			const price: Record<string, number> = {
				grey: prices[0],
				yellow: prices[2],
				white: prices[3],
				green: prices[4]
			};

			return {
				productId: product.id.split(':').at(0),
				id: `${product.id}:${color.id}`,
				displayName: `${product.displayName} ${color.displayName}`,
				price: price[color.id] || prices[1],
				unit: 'sqft'
			} as Sku;
		});
	}

	const PAVER_SKUS: Sku[] = [
		...generatePaverSKUList(
			{ id: 'colonial_classic', displayName: 'Colonial Classic' },
			[203, 228, 233, 260.27, 363]
		),
		...generatePaverSKUList(
			{ id: 'thin_classic', displayName: 'Thin Classic' },
			[188, 210, 215, 247, 333]
		),
		...generatePaverSKUList(
			{ id: 'banjo', displayName: 'Banjo' },
			[219, 247, 253, 253, 396]
		),
		...generatePaverSKUList(
			{ id: 'owc', displayName: 'Old World Cobble' },
			[203, 228, 233, 260.27, 363]
		),
		...generatePaverSKUList(
			{ id: 'heritage:regular', displayName: 'Heritage Regular' },
			[219, 247, 253, 253, 396]
		),
		...generatePaverSKUList(
			{ id: 'heritage:square', displayName: 'Heritage Square' },
			[219, 247, 253, 253, 396]
		),
		...generatePaverSKUList(
			{ id: 'heritage:two_part', displayName: 'Heritage Two-Part' },
			[219, 247, 253, 253, 396]
		),
		...generatePaverSKUList(
			{ id: 'cobble_mix:double', displayName: 'Cobble Mix Double' },
			[219, 247, 253, 253, 396]
		),
		...generatePaverSKUList(
			{ id: 'cobble_mix:oblong', displayName: 'Cobble Mix Oblong' },
			[219, 247, 253, 253, 396]
		),
		...generatePaverSKUList(
			{ id: 'cobble_mix:two_part', displayName: 'Cobble Mix Two-Part' },
			[219, 247, 253, 253, 396]
		),
		...generatePaverSKUList(
			{ id: 'tropical_wave', displayName: 'Tropical Wave' },
			[228.5, 267.5, 275.5, 305.5, 445.5]
		)
	].map((sku) => {
		const details = PRODUCT_DETAILS.find((details) => {
			return sku.id.includes(details.matcher);
		});

		if (!details) throw new Error(`No details found for ${sku.id}`);

		return {
			...sku,
			detailsMatcher: details.matcher
		};
	});

	await prisma.sku.createMany({
		data: PAVER_SKUS
	});
}

function coinFlip(chance = 0.5) {
	return Math.random() > chance;
}

async function addPaverStock() {
	function generatePaverStock(
		skuIdPrefix: string,
		popularity: number,
		doneToOrder = false
	): Stock[] {
		return PAVER_COLOR_FRAGMENTS.flatMap(({ id: colorId }) => {
			const showroomQuantity = Math.round(Math.random() * 1200 * popularity);

			const factoryQuantity = Math.round(Math.random() * 12000 * popularity);

			return [
				{
					productId: skuIdPrefix.split(':').at(0) as string,
					skuId: `${skuIdPrefix}:${colorId}`,
					locationId: 'KNG_SHOWROOM',
					quantity: doneToOrder ? 0 : coinFlip() ? showroomQuantity : 0
				},
				{
					productId: skuIdPrefix.split(':').at(0) as string,
					skuId: `${skuIdPrefix}:${colorId}`,
					locationId: 'STT_FACTORY',
					quantity: doneToOrder ? 0 : coinFlip() ? factoryQuantity : 0
				}
			];
		});
	}

	const STOCK: Stock[] = [
		...generatePaverStock('colonial_classic', 1),
		...generatePaverStock('banjo', 0.5),
		...generatePaverStock('thin_classic', 0.1)
	];

	await prisma.stock.createMany({
		data: STOCK
	});
}

async function addPaverRestockQueue() {
	function generatePaverRestockElements(
		skuIdPrefix: string,
		popularity: number
	): Restock[] {
		return PAVER_COLOR_FRAGMENTS.flatMap(({ id: colorId }) => {
			const fromFactory = coinFlip();

			const showroomQuantity = Math.round(Math.random() * 1200 * popularity);

			const factoryQuantity = Math.round(Math.random() * 12000 * popularity);

			return coinFlip(popularity / 2)
				? [
						{
							productId: skuIdPrefix.split(':').at(0) as string,
							skuId: `${skuIdPrefix}:${colorId}`,
							locationId: fromFactory ? 'STT_FACTORY' : 'STT_FACTORY',
							quantity: fromFactory ? factoryQuantity : showroomQuantity,
							date: fromFactory
								? addBusinessDays(new Date(), Math.round(Math.random() * 20))
								: coinFlip(0.75)
								? addHours(new Date(), Math.round(Math.random() * 3))
								: addBusinessDays(new Date(), Math.round(Math.random() * 7)),
							fulfilled: false
						}
				  ]
				: [];
		});
	}

	const RESTOCK_QUEUE: Restock[] = [
		...generatePaverRestockElements('colonial_classic', 1),
		...generatePaverRestockElements('banjo', 0.5),
		...generatePaverRestockElements('thin_classic', 0.25)
	];

	await prisma.restock.createMany({
		data: RESTOCK_QUEUE
	});
}

async function main() {
	await addPickupLocations();
	await addPavers();
	await addProductDetails();
	await addPaverSkus();
	await addPaverStock();
	await addPaverRestockQueue();
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
