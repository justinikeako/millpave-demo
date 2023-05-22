import { InferModel } from 'drizzle-orm';
import {
	categories,
	productToProduct,
	products,
	skuDetails,
	skuRestocks,
	pickupLocations,
	skuStock,
	skus
} from './schema';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { addBusinessDays, addHours } from 'date-fns';

const connection = await mysql.createConnection({
	database: process.env.DB_NAME,
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS
});

export const db = drizzle(connection);

type NewCategory = InferModel<typeof categories, 'insert'>;
type NewProduct = InferModel<typeof products, 'insert'>;
type NewProductToProduct = InferModel<typeof productToProduct, 'insert'>;
type ProductDetails = InferModel<typeof skuDetails>;
type Sku = InferModel<typeof skus, 'insert'>;
type Stock = InferModel<typeof skuStock, 'insert'>;
type Restock = InferModel<typeof skuRestocks, 'insert'>;
type NewPickupLocation = InferModel<typeof pickupLocations, 'insert'>;

const PICKUP_LOCATIONS: NewPickupLocation[] = [
	{ id: 'KNG_SHOWROOM', displayName: 'Kingston Showroom' },
	{ id: 'STT_FACTORY', displayName: 'St. Thomas Factory' }
];

// Create pickup locations (shoroom and factory)
async function addPickupLocations() {
	await db.insert(pickupLocations).values(PICKUP_LOCATIONS);

	console.log('Successfully added pickup locations');
}

async function addCategoryWithProducts(
	newCategory: NewCategory,
	newProducts: NewProduct[],
	similar: Map<string, string[]>
) {
	await db.insert(categories).values(newCategory);
	await db.insert(products).values(newProducts);

	const newProductToProduct: NewProductToProduct[] = [];

	for (const [productId, similarIds] of similar) {
		newProductToProduct.push(
			...similarIds.map(
				(similarId, index): NewProductToProduct => ({
					relevance: similarIds.length - index,
					productId,
					similarId
				})
			)
		);
	}

	await db.insert(productToProduct).values(newProductToProduct);

	console.log(
		`Successfully added category "${newCategory.displayName}" and all related products`
	);
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

async function addPavers() {
	const PAVERS: Omit<NewProduct, 'description' | 'categoryId'>[] = [
		{
			id: 'colonial_classic',
			defaultSkuId: 'colonial_classic:grey',
			estimator: 'paver',
			displayName: 'Colonial Classic',
			canBorder: true,
			variantIdTemplate: [
				{
					type: 'color' as const,
					displayName: 'Colour',
					fragments: PAVER_COLOR_FRAGMENTS
				}
			]
		},
		{
			id: 'thin_classic',
			defaultSkuId: 'thin_classic:grey',
			estimator: 'paver',
			displayName: 'Thin Classic',
			canBorder: true,
			variantIdTemplate: [
				{
					type: 'color' as const,
					displayName: 'Colour',
					fragments: PAVER_COLOR_FRAGMENTS
				}
			]
		},
		{
			id: 'banjo',
			defaultSkuId: 'banjo:grey',
			estimator: 'paver',
			displayName: 'Banjo',
			variantIdTemplate: [
				{
					type: 'color' as const,
					displayName: 'Colour',
					fragments: PAVER_COLOR_FRAGMENTS
				}
			]
		},
		{
			id: 'owc',
			defaultSkuId: 'owc:grey',
			estimator: 'paver',
			displayName: 'Old World Cobble',
			variantIdTemplate: [
				{
					type: 'color' as const,
					displayName: 'Colour',
					fragments: PAVER_COLOR_FRAGMENTS
				}
			]
		},
		{
			id: 'cobble_mix',
			defaultSkuId: 'cobble_mix:oblong:grey',
			estimator: 'paver',
			displayName: 'Cobble Mix',
			canBorder: true,
			variantIdTemplate: [
				{
					type: 'variant' as const,
					displayName: 'Variant',
					fragments: [
						{ id: 'double', displayName: 'Double' },
						{ id: 'oblong', displayName: 'Oblong' },
						{ id: 'two_part', displayName: 'Two Part' }
					]
				},
				{
					type: 'color' as const,
					displayName: 'Colour',
					fragments: PAVER_COLOR_FRAGMENTS
				}
			]
		},
		{
			id: 'heritage',
			defaultSkuId: 'heritage:regular:grey',
			estimator: 'paver',
			displayName: 'Heritage Series',
			canBorder: true,
			variantIdTemplate: [
				{
					type: 'variant' as const,
					displayName: 'Variant',
					fragments: [
						{ id: 'regular', displayName: 'Regular' },
						{ id: 'square', displayName: 'Square' },
						{ id: 'two_part', displayName: 'Two Part' }
					]
				},
				{
					type: 'color' as const,
					displayName: 'Colour',
					fragments: PAVER_COLOR_FRAGMENTS
				}
			]
		},
		{
			id: 'tropical_wave',
			defaultSkuId: 'tropical_wave:grey',
			estimator: 'paver',
			displayName: 'Tropical Wave',
			variantIdTemplate: [
				{
					type: 'color' as const,
					displayName: 'Colour',
					fragments: PAVER_COLOR_FRAGMENTS
				}
			]
		},
		{
			id: 'circle_bundle',
			defaultSkuId: 'circle_bundle:grey',
			displayName: 'Circle Bundle',
			hasModels: false,
			variantIdTemplate: [
				{
					type: 'color' as const,
					displayName: 'Colour',
					fragments: PAVER_COLOR_FRAGMENTS
				}
			]
		},
		{
			id: 'circle_stepping',
			defaultSkuId: 'circle_stepping:grey',
			displayName: 'Circle Stepping Stone',
			hasModels: false,
			variantIdTemplate: [
				{
					type: 'color' as const,
					displayName: 'Colour',
					fragments: PAVER_COLOR_FRAGMENTS
				}
			]
		}
	];

	const SIMILAR_PRODUCTS: Map<string, string[]> = new Map([
		['colonial_classic', ['banjo', 'thin_classic', 'heritage']],
		['thin_classic', ['colonial_classic', 'banjo', 'circle_bundle']],
		['banjo', ['colonial_classic', 'heritage', 'cobble_mix']],
		['owc', ['cobble_mix', 'tropical_wave', 'colonial_classic']],
		['cobble_mix', ['owc', 'heritage', 'colonial_classic']],
		['heritage', ['colonial_classic', 'cobble_mix', 'owc']],
		['tropical_wave', ['owc', 'cobble_mix', 'colonial_classic']],
		['circle_bundle', ['owc', 'cobble_mix', 'colonial_classic']],
		['circle_stepping', ['owc', 'cobble_mix', 'colonial_classic']]
	]);

	await addCategoryWithProducts(
		{ id: 'concrete_pavers', displayName: 'Concrete Pavers' },
		PAVERS.map(
			(product): NewProduct => ({
				...product,
				categoryId: 'concrete_pavers',
				hasModels: product.hasModels === undefined,
				description: `Create a traditional feel to your garden with our ${product.displayName} Paver. As one of the most sought after styles of stone paving, it displays a beautiful range of colors which will brighten up any exterior to create an added sense of space! Using aggregates sourced from the St. Thomas River, ${product.displayName} promises an outdoor area filled with character and is a household favourite providing a wealth of design opportunities.`
			})
		),
		SIMILAR_PRODUCTS
	);
}

async function addSlabsAndBlocks() {
	const SLABS_AND_BLOCKS: Omit<NewProduct, 'description' | 'categoryId'>[] = [
		{
			id: 'savannah',
			defaultSkuId: 'savannah:16x8:regular:grey',
			displayName: 'Savannah',
			variantIdTemplate: [
				{
					type: 'variant' as const,
					displayName: 'Dimensions',
					fragments: [
						{ id: '16x8', displayName: '16 x 8' },
						{ id: '16x16', displayName: '16 x 16' },
						{ id: '16x24', displayName: '16 x 24' },
						{ id: '24x24', displayName: '24 x 24' }
					]
				},
				{
					type: 'variant' as const,
					displayName: 'Variant',
					fragments: [
						{ id: 'regular', displayName: 'Regular' },
						{ id: 'exposed', displayName: 'Exposed' }
					]
				},
				{
					type: 'color' as const,
					displayName: 'Colour',
					fragments: PAVER_COLOR_FRAGMENTS
				}
			]
		},
		{
			id: 'grasscrete',
			defaultSkuId: 'grasscrete:circle:grey',
			displayName: 'Grasscrete',
			variantIdTemplate: [
				{
					type: 'variant' as const,
					displayName: 'Shape',
					fragments: [{ id: 'circle', displayName: 'Circle' }]
				},
				{
					type: 'color' as const,
					displayName: 'Colour',
					fragments: PAVER_COLOR_FRAGMENTS
				}
			]
		},
		{
			id: 'curb_wall',
			defaultSkuId: 'curb_wall:grey',
			displayName: 'Curb Wall',
			variantIdTemplate: [
				{
					type: 'color' as const,
					displayName: 'Colour',
					fragments: [{ id: 'grey', displayName: 'Grey', css: '#D9D9D9' }]
				}
			]
		}
	];

	const SIMILAR_PRODUCTS: Map<string, string[]> = new Map([
		['savannah', ['heritage', 'circle_stepping', 'grasscrete']],
		['grasscrete', ['tropical_wave', 'circle_stepping', 'savannah']],
		['curb_wall', ['tropical_wave', 'circle_stepping', 'savannah']]
	]);

	await addCategoryWithProducts(
		{ id: 'slabs_blocks', displayName: 'Slabs and Blocks' },
		SLABS_AND_BLOCKS.map(
			(product): NewProduct => ({
				...product,
				categoryId: 'slabs_blocks',
				description:
					'Integer a velit in sapien aliquam consectetur et vitae ligula. Integer ornare egestas enim a malesuada. Suspendisse arcu lectus, blandit nec gravida at, maximus ut lorem. Nulla malesuada vehicula neque at laoreet. Nullam efficitur mauris sit amet accumsan pulvinar.'
			})
		),
		SIMILAR_PRODUCTS
	);
}

async function addMaintenanceProducts() {
	const MAINTENANCE_PRODUCTS: Omit<NewProduct, 'description' | 'categoryId'>[] =
		[
			{
				id: 'oil_sealant',
				defaultSkuId: 'oil_sealant:one_gallon',
				displayName: 'DYNA Oil-Based Sealant',
				variantIdTemplate: [
					{
						type: 'variant' as const,
						displayName: 'Size',
						fragments: [
							{ id: 'one_gallon', displayName: 'One Gallon' },
							{ id: 'five_gallon', displayName: 'Five Gallon' }
						]
					}
				]
			},
			{
				id: 'water_sealant',
				defaultSkuId: 'water_sealant:one_gallon',
				displayName: 'DYNA Water-Based Sealant',
				variantIdTemplate: [
					{
						type: 'variant' as const,
						displayName: 'Size',
						fragments: [
							{ id: 'one_gallon', displayName: 'One Gallon' },
							{ id: 'five_gallon', displayName: 'Five Gallon' }
						]
					}
				]
			},
			{
				id: 'polymeric_sand',
				defaultSkuId: 'polymeric_sand:fifty_pound',
				displayName: 'DYNA Polymeric Sand',
				variantIdTemplate: [
					{
						type: 'variant' as const,
						displayName: 'Size',
						fragments: [{ id: 'fifty_pound', displayName: '50 pound bag' }]
					}
				]
			},
			{
				id: 'efflorescence_cleaner',
				defaultSkuId: 'efflorescence_cleaner:one_gallon',
				displayName: 'DYNA Efflorescence Cleaner',
				variantIdTemplate: [
					{
						type: 'variant' as const,
						displayName: 'Size',
						fragments: [{ id: 'one_gallon', displayName: 'One Gallon' }]
					}
				]
			},
			{
				id: 'stone_soap',
				defaultSkuId: 'stone_soap:one_quart',
				displayName: 'DYNA Stone Soap',
				variantIdTemplate: [
					{
						type: 'variant' as const,
						displayName: 'Variant',
						fragments: [{ id: 'one_quart', displayName: 'One Quart' }]
					}
				]
			},
			{
				id: 'gum_paint_tar',
				defaultSkuId: 'gum_paint_tar:one_quart',
				displayName: 'DYNA Gum Paint & Tar Stripper',
				variantIdTemplate: [
					{
						type: 'variant' as const,
						displayName: 'Variant',
						fragments: [{ id: 'one_quart', displayName: 'One Quart' }]
					}
				]
			}
		];

	// prettier-ignore
	const SIMILAR_PRODUCTS: Map<string, string[]> = new Map([
		['oil_sealant', ['water_sealant', 'efflorescence_cleaner', 'polymeric_sand']],
		['water_sealant', ['oil_sealant', 'efflorescence_cleaner', 'polymeric_sand']],
		['polymeric_sand', ['oil_sealant', 'water_sealant', 'efflorescence_cleaner']],
		['efflorescence_cleaner', ['stone_soap', 'gum_paint_tar', 'oil_sealant']],
		['stone_soap', ['efflorescence_cleaner', 'gum_paint_tar', 'oil_sealant']],
		['gum_paint_tar', ['efflorescence_cleaner', 'stone_soap', 'oil_sealant']]
	]);

	await addCategoryWithProducts(
		{ id: 'maintenance', displayName: 'Maintenance' },
		MAINTENANCE_PRODUCTS.map(
			(product): NewProduct => ({
				...product,
				categoryId: 'maintenance',
				description:
					'Integer a velit in sapien aliquam consectetur et vitae ligula. Integer ornare egestas enim a malesuada. Suspendisse arcu lectus, blandit nec gravida at, maximus ut lorem. Nulla malesuada vehicula neque at laoreet. Nullam efficitur mauris sit amet accumsan pulvinar.'
			})
		),
		SIMILAR_PRODUCTS
	);
}

const PRODUCT_DETAILS: ProductDetails[] = [
	{
		matcher: 'colonial_classic',
		productId: 'colonial_classic',
		rawData: {
			type: 'paver',
			lbs_per_unit: 5,
			sqft_per_pallet: 128.75,
			pcs_per_pallet: 600,
			pcs_per_sqft: 4.66,
			conversion_factors: { SOLDIER_ROW: 0.675, TIP_TO_TIP: 0.338 }
		},
		formattedData: [
			{ displayName: 'Dimensions', value: '4in x 8in x 2.375in' },
			{ displayName: 'Weight per Unit', value: '5 lbs' },
			{ displayName: 'Area per Pallet', value: '128.75 sqft' },
			{ displayName: 'Units per Pallet', value: 600 },
			{ displayName: 'Pieces per sqft', value: 4.66 }
		]
	},
	{
		matcher: 'thin_classic',
		productId: 'thin_classic',
		rawData: {
			type: 'paver',
			lbs_per_unit: 4.16,
			sqft_per_pallet: 154.5,
			pcs_per_pallet: 720,
			pcs_per_sqft: 4.66,
			conversion_factors: { SOLDIER_ROW: 0.675, TIP_TO_TIP: 0.338 }
		},
		formattedData: [
			{ displayName: 'Dimensions', value: '4in x 8in x 1.375in' },
			{ displayName: 'Weight per Unit', value: '4.16 lbs' },
			{ displayName: 'Area per Pallet', value: '154.5 sqft' },
			{ displayName: 'Units per Pallet', value: 720 },
			{ displayName: 'Pieces per sqft', value: 4.66 }
		]
	},
	{
		matcher: 'banjo',
		productId: 'banjo',
		rawData: {
			type: 'paver',
			lbs_per_unit: 6.67,
			sqft_per_pallet: 128.57,
			pcs_per_pallet: 450,
			pcs_per_sqft: 3.5
		},
		formattedData: [
			{ displayName: 'Dimensions', value: '5.5in x 9in x 2.375in' },
			{ displayName: 'Weight per Unit', value: '6.67 lbs' },
			{ displayName: 'Area per Pallet', value: '128.57 sqft' },
			{ displayName: 'Units per Pallet', value: 450 },
			{ displayName: 'Pieces per sqft', value: 3.5 }
		]
	},
	{
		matcher: 'owc',
		productId: 'owc',
		rawData: {
			type: 'paver',
			lbs_per_unit: 3.75,
			sqft_per_pallet: 125.39,
			pcs_per_pallet: 800,
			pcs_per_sqft: 6.38
		},
		formattedData: [
			{ displayName: 'Dimensions', value: '5.5in x 9in x 2.375in' },
			{ displayName: 'Weight per Unit', value: '3.75 lbs' },
			{ displayName: 'Area per Pallet', value: '125.39 sqft' },
			{ displayName: 'Units per Pallet', value: 800 },
			{ displayName: 'Pieces per sqft', value: 6.38 }
		]
	},
	{
		matcher: 'cobble_mix:double',
		productId: 'cobble_mix',
		rawData: {
			type: 'paver',
			lbs_per_unit: 11.28,
			sqft_per_pallet: 119.28,
			pcs_per_pallet: 266,
			pcs_per_sqft: 2.23,
			conversion_factors: { SOLDIER_ROW: 0.79, TIP_TO_TIP: 0.61 }
		},
		formattedData: [
			{ displayName: 'Dimensions', value: '7in x 9.5in x 2.375in' },
			{ displayName: 'Weight per Unit', value: '11.28 lbs' },
			{ displayName: 'Area per Pallet', value: '119.28 sqft' },
			{ displayName: 'Units per Pallet', value: 266 },
			{ displayName: 'Pieces per sqft', value: 2.23 }
		]
	},
	{
		matcher: 'cobble_mix:oblong',
		productId: 'cobble_mix',
		rawData: {
			type: 'paver',
			lbs_per_unit: 5.3,
			sqft_per_pallet: 126.91,
			pcs_per_pallet: 566,
			pcs_per_sqft: 4.46,
			conversion_factors: { SOLDIER_ROW: 0.59, TIP_TO_TIP: 0.43 }
		},
		formattedData: [
			{ displayName: 'Dimensions', value: '4.75in x 7in x 2.375in' },
			{ displayName: 'Weight per Unit', value: '5.3 lbs' },
			{ displayName: 'Area per Pallet', value: '126.91 sqft' },
			{ displayName: 'Units per Pallet', value: 566 },
			{ displayName: 'Pieces per sqft', value: 4.46 }
		]
	},
	{
		matcher: 'cobble_mix:two_part',
		productId: 'cobble_mix',
		rawData: {
			type: 'paver',
			lbs_per_unit: 3.53,
			sqft_per_pallet: 130.97,
			pcs_per_pallet: 850,
			pcs_per_sqft: 6.49,
			conversion_factors: { SOLDIER_ROW: 0.59, TIP_TO_TIP: 0.42 }
		},
		formattedData: [
			{ displayName: 'Dimensions', value: '4.75in x 7in x 2.375in' },
			{ displayName: 'Weight per Unit', value: '3.53 lbs' },
			{ displayName: 'Area per Pallet', value: '130.97 sqft' },
			{ displayName: 'Units per Pallet', value: 850 },
			{ displayName: 'Pieces per sqft', value: 6.49 }
		]
	},
	{
		matcher: 'heritage:regular',
		productId: 'heritage',
		rawData: {
			type: 'paver',
			lbs_per_unit: 9.15,
			sqft_per_pallet: 120.59,
			pcs_per_pallet: 328,
			pcs_per_sqft: 2.72,
			conversion_factors: { SOLDIER_ROW: 0.75, TIP_TO_TIP: 0.5 }
		},
		formattedData: [
			{ displayName: 'Dimensions', value: '6in x 9in x 2.375in' },
			{ displayName: 'Weight per Unit', value: '9.15 lbs' },
			{ displayName: 'Area per Pallet', value: '120.59 sqft' },
			{ displayName: 'Units per Pallet', value: 328 },
			{ displayName: 'Pieces per sqft', value: 2.72 }
		]
	},
	{
		matcher: 'heritage:square',
		productId: 'heritage',
		rawData: {
			type: 'paver',
			lbs_per_unit: 5.86,
			sqft_per_pallet: 128,
			pcs_per_pallet: 512,
			pcs_per_sqft: 4,
			conversion_factors: { SOLDIER_ROW: 0.5, TIP_TO_TIP: 0.5 }
		},
		formattedData: [
			{ displayName: 'Dimensions', value: '6in x 6in x 2.375in' },
			{ displayName: 'Weight per Unit', value: '5.86 lbs' },
			{ displayName: 'Area per Pallet', value: '128 sqft' },
			{ displayName: 'Units per Pallet', value: 512 },
			{ displayName: 'Pieces per sqft', value: 4 }
		]
	},
	{
		matcher: 'heritage:two_part',
		productId: 'heritage',
		rawData: {
			type: 'paver',
			lbs_per_unit: 5.77,
			sqft_per_pallet: 130,
			pcs_per_pallet: 520,
			pcs_per_sqft: 4,
			conversion_factors: { SOLDIER_ROW: 0.75, TIP_TO_TIP: 0.5 }
		},
		formattedData: [
			{ displayName: 'Dimensions', value: '6in x 9in x 2.375in' },
			{ displayName: 'Weight per Unit', value: '5.77 lbs' },
			{ displayName: 'Area per Pallet', value: '130 sqft' },
			{ displayName: 'Units per Pallet', value: 520 },
			{ displayName: 'Pieces per sqft', value: 4 }
		]
	},
	{
		matcher: 'tropical_wave',
		productId: 'tropical_wave',
		rawData: {
			type: 'paver',
			lbs_per_unit: 9.38,
			sqft_per_pallet: 102.89,
			pcs_per_pallet: 320,
			pcs_per_sqft: 3.11
		},
		formattedData: [
			{ displayName: 'Dimensions', value: '4.75in x 9.5in x 3in' },
			{ displayName: 'Weight per Unit', value: '9.38 lbs' },
			{ displayName: 'Area per Pallet', value: '102.89 sqft' },
			{ displayName: 'Units per Pallet', value: 320 },
			{ displayName: 'Pieces per sqft', value: 3.11 }
		]
	},
	{
		matcher: 'circle_bundle',
		productId: 'circle_bundle',
		rawData: null,
		formattedData: [
			{ displayName: 'Weight per Unit', value: '2.75 lbs' },
			{ displayName: 'Area per 8ft bundle', value: 63 },
			{ displayName: 'Area per 5ft bundle', value: 31.5 },
			{ displayName: 'Units per 8ft bundle', value: 419 },
			{ displayName: 'Units per 5ft bundle', value: 169 }
		]
	},
	{
		matcher: 'circle_stepping',
		productId: 'circle_stepping',
		rawData: {
			type: 'paver',
			lbs_per_unit: 9.38,
			sqft_per_pallet: 120,
			pcs_per_pallet: 120,
			pcs_per_sqft: 1
		},
		formattedData: [
			{ displayName: 'Dimensions', value: '11in x 11in x 2.375in' },
			{ displayName: 'Weight per Unit', value: '9.38 lbs' },
			{ displayName: 'Area per Pallet', value: '120 sqft' },
			{ displayName: 'Units per Pallet', value: 120 },
			{ displayName: 'Pieces per sqft', value: 1 }
		]
	},
	{
		matcher: 'savannah:16x8',
		productId: 'savannah',
		rawData: {
			type: 'paver',
			lbs_per_unit: 20,
			sqft_per_pallet: 104.4,
			pcs_per_pallet: 116,
			pcs_per_sqft: 0.9
		},
		formattedData: [
			{ displayName: 'Dimensions', value: '8in x 16in x 3in' },
			{ displayName: 'Weight per Unit', value: '20 lbs' },
			{ displayName: 'Area per Pallet', value: '104.4 sqft' },
			{ displayName: 'Units per Pallet', value: 116 },
			{ displayName: 'Pieces per sqft', value: 0.9 }
		]
	},
	{
		matcher: 'savannah:16x16',
		productId: 'savannah',
		rawData: {
			type: 'paver',
			lbs_per_unit: 28,
			sqft_per_pallet: 104.88,
			pcs_per_pallet: 59,
			pcs_per_sqft: 0.5625
		},
		formattedData: [
			{ displayName: 'Dimensions', value: '16in x 16in x 3in' },
			{ displayName: 'Weight per Unit', value: '28 lbs' },
			{ displayName: 'Area per Pallet', value: '104.88 sqft' },
			{ displayName: 'Units per Pallet', value: 59 },
			{ displayName: 'Pieces per sqft', value: 0.5625 }
		]
	},
	{
		matcher: 'savannah:16x24',
		productId: 'savannah',
		rawData: {
			type: 'paver',
			lbs_per_unit: 36,
			sqft_per_pallet: 104,
			pcs_per_pallet: 39,
			pcs_per_sqft: 0.375
		},
		formattedData: [
			{ displayName: 'Dimensions', value: '16in x 24in x 3in' },
			{ displayName: 'Weight per Unit', value: '36 lbs' },
			{ displayName: 'Area per Pallet', value: '104 sqft' },
			{ displayName: 'Units per Pallet', value: 39 },
			{ displayName: 'Pieces per sqft', value: 0.375 }
		]
	},
	{
		matcher: 'savannah:24x24',
		productId: 'savannah',
		rawData: {
			type: 'paver',
			lbs_per_unit: 42,
			sqft_per_pallet: 104,
			pcs_per_pallet: 26,
			pcs_per_sqft: 0.25
		},
		formattedData: [
			{ displayName: 'Dimensions', value: '24in x 24in x 3in' },
			{ displayName: 'Weight per Unit', value: '42 lbs' },
			{ displayName: 'Area per Pallet', value: '104 sqft' },
			{ displayName: 'Units per Pallet', value: 26 },
			{ displayName: 'Pieces per sqft', value: 0.25 }
		]
	},
	{
		matcher: 'grasscrete:circle',
		productId: 'grasscrete',
		rawData: {
			type: 'paver',
			lbs_per_unit: 19,
			sqft_per_pallet: 106,
			pcs_per_pallet: 40,
			pcs_per_sqft: 0.373
		},
		formattedData: [
			{ displayName: 'Dimensions', value: '23.5in x 15.5in x 3.5in' },
			{ displayName: 'Weight per Unit', value: '19 lbs' },
			{ displayName: 'Area per Pallet', value: '106 sqft' },
			{ displayName: 'Units per Pallet', value: 40 },
			{ displayName: 'Pieces per sqft', value: 0.373 }
		]
	},
	{
		matcher: 'curb_wall',
		productId: 'curb_wall',
		rawData: null,
		formattedData: [{ displayName: 'Dimensions', value: '29.5in x 4in x 7in' }]
	},
	{
		matcher: 'oil_sealant:one_gallon',
		productId: 'oil_sealant',
		rawData: null,
		formattedData: [
			{ displayName: 'Coverage', value: '100 sqft' },
			{ displayName: 'Weight per unit', value: '4 lbs' }
		]
	},
	{
		matcher: 'oil_sealant:five_gallon',
		productId: 'oil_sealant',
		rawData: null,
		formattedData: [
			{ displayName: 'Coverage', value: '500 sqft' },
			{ displayName: 'Weight per unit', value: '25 lbs' }
		]
	},
	{
		matcher: 'water_sealant:one_gallon',
		productId: 'water_sealant',
		rawData: null,
		formattedData: [
			{ displayName: 'Coverage', value: '100 sqft' },
			{ displayName: 'Weight per unit', value: '4 lbs' }
		]
	},
	{
		matcher: 'water_sealant:five_gallon',
		productId: 'water_sealant',
		rawData: null,
		formattedData: [
			{ displayName: 'Coverage', value: '500 sqft' },
			{ displayName: 'Weight per unit', value: '25 lbs' }
		]
	},
	{
		productId: 'polymeric_sand',
		matcher: 'polymeric_sand:fifty_pound',
		rawData: null,
		formattedData: [
			{ displayName: 'Coverage', value: '100 sqft' },
			{ displayName: 'Weight per unit', value: '50 lbs' }
		]
	},
	{
		productId: 'efflorescence_cleaner',
		matcher: 'efflorescence_cleaner:one_gallon',
		rawData: null,
		formattedData: [
			{ displayName: 'Coverage', value: '100 sqft' },
			{ displayName: 'Weight per unit', value: '20 lbs' }
		]
	},
	{
		productId: 'stone_soap',
		matcher: 'stone_soap:one_quart',
		rawData: null,
		formattedData: [
			{ displayName: 'Coverage', value: '25 sqft' },
			{ displayName: 'Weight per unit', value: '2 lbs' }
		]
	},
	{
		productId: 'gum_paint_tar',
		matcher: 'gum_paint_tar:one_quart',
		rawData: null,
		formattedData: [{ displayName: 'Weight per unit', value: '2 lbs' }]
	}
];

async function addProductDetails() {
	// Create details for every product
	await db.insert(skuDetails).values(PRODUCT_DETAILS);

	console.log('Successfully added product details');
}

async function addConcreteProductSkus() {
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
		),
		...generatePaverSKUList(
			{ id: 'circle_stepping', displayName: 'Circle Stepping Stone' },
			[228.5, 267.5, 275.5, 305.5, 445.5]
		),
		...generatePaverSKUList(
			{ id: 'circle_bundle', displayName: 'Circle Bundle' },
			[228.5, 267.5, 275.5, 305.5, 445.5]
		),
		...generatePaverSKUList(
			{ id: 'savannah:16x8:regular', displayName: 'Savannah 16 x 8 Regular' },
			[219, 275.5, 275.5, 275.5, 275.5]
		),
		...generatePaverSKUList(
			{ id: 'savannah:16x8:exposed', displayName: 'Savannah 16 x 8 Exposed' },
			[219, 275.5, 275.5, 275.5, 275.5]
		),
		...generatePaverSKUList(
			{ id: 'savannah:16x16:regular', displayName: 'Savannah 16 x 16' },
			[228.5, 305.5, 305.5, 305.5, 305.5]
		),
		...generatePaverSKUList(
			{ id: 'savannah:16x16:exposed', displayName: 'Savannah 16 x 16 Exposed' },
			[228.5, 305.5, 305.5, 305.5, 305.5]
		),
		...generatePaverSKUList(
			{
				id: 'savannah:16x24:regular',
				displayName: 'Savannah 24 x 16 Regular'
			},
			[228.5, 305.5, 305.5, 305.5, 305.5]
		),
		...generatePaverSKUList(
			{ id: 'savannah:16x24:exposed', displayName: 'Savannah 24 x 16 Exposed' },
			[228.5, 305.5, 305.5, 305.5, 305.5]
		),
		...generatePaverSKUList(
			{ id: 'savannah:24x24:regular', displayName: 'Savannah 24 x 24 Regular' },
			[228.5, 305.5, 305.5, 305.5, 305.5]
		),
		...generatePaverSKUList(
			{ id: 'savannah:24x24:exposed', displayName: 'Savannah 24 x 24 Exposed' },
			[228.5, 305.5, 305.5, 305.5, 305.5]
		),
		...generatePaverSKUList(
			{ id: 'grasscrete:circle', displayName: 'Grasscrete' },
			[228.5, 305.5, 305.5, 305.5, 305.5]
		),
		{
			id: 'curb_wall:grey',
			productId: 'curb_wall',
			detailsMatcher: 'curb_wall',
			displayName: 'Curb Wall Grey',
			price: 445.5,
			unit: 'unit'
		} as Sku
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

	await db.insert(skus).values(PAVER_SKUS);
}

async function addMaintenanceSkus() {
	const CLEANING_INSALLATION_SKUS: Sku[] = [
		{
			id: 'oil_sealant:one_gallon',
			productId: 'oil_sealant',
			displayName: 'DYNA Oil-Based Sealant (1 gallon)',
			price: 5913.04,
			unit: 'unit'
		},
		{
			id: 'oil_sealant:five_gallon',
			productId: 'oil_sealant',
			displayName: 'DYNA Oil-Based Sealant (5 gallon)',
			price: 25826.09,
			unit: 'unit'
		},
		{
			id: 'water_sealant:one_gallon',
			productId: 'water_sealant',
			displayName: 'DYNA Water-Based Sealant (1 Gallon)',
			price: 5913.04,
			unit: 'unit'
		},
		{
			id: 'water_sealant:five_gallon',
			productId: 'water_sealant',
			displayName: 'DYNA Water-Based Sealant (5 Gallon)',
			price: 25826.09,
			unit: 'unit'
		},
		{
			id: 'polymeric_sand:fifty_pound',
			productId: 'polymeric_sand',
			displayName: 'DYNA Polymeric Sand (50 pound)',
			price: 2695.65,
			unit: 'bag'
		},
		{
			id: 'efflorescence_cleaner:one_gallon',
			productId: 'efflorescence_cleaner',
			displayName: 'DYNA Efflorescence Cleaner (1 gallon)',
			price: 4000,
			unit: 'unit'
		},
		{
			id: 'stone_soap:one_quart',
			productId: 'stone_soap',
			displayName: 'DYNA Stone Soap (1 quart)',
			price: 1739.13,
			unit: 'unit'
		},
		{
			id: 'gum_paint_tar:one_quart',
			productId: 'gum_paint_tar',
			displayName: 'DYNA Gum Paint and Tar Stripper (1 quart)',
			price: 2173.91,
			unit: 'unit'
		}
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

	await db.insert(skus).values(CLEANING_INSALLATION_SKUS);
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

	await db.insert(skuStock).values(STOCK);

	console.log('Successfully added paver sku stocks');
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

	await db.insert(skuRestocks).values(RESTOCK_QUEUE);

	console.log('Successfully added paver sku restocks');
}

async function main() {
	await addPickupLocations();
	await addPavers();
	await addSlabsAndBlocks();
	await addMaintenanceProducts();
	await addProductDetails();
	await addMaintenanceSkus();
	await addConcreteProductSkus();
	await addPaverStock();
	await addPaverRestockQueue();
}

try {
	await main();

	console.log('Successfully executed seed script.');

	await connection.end();
} catch (e) {
	console.error(e);

	await connection.end();

	process.exit(1);
}
