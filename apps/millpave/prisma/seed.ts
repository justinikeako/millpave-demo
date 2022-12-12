import { Prisma, PrismaClient, PrismaPromise } from '@prisma/client';
import { addBusinessDays, addHours } from 'date-fns';

const prisma = new PrismaClient();

type Product = Prisma.ProductCreateInput;
type Category = Prisma.CategoryCreateInput;
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

async function addCategories(categories: Category[], products: Product[]) {
	const categoryQueries: PrismaPromise<unknown>[] = [];

	for (const category of categories) {
		categoryQueries.push(
			prisma.category.create({
				data: category
			})
		);
	}

	await prisma.$transaction(categoryQueries);

	const productQueries: PrismaPromise<unknown>[] = [];

	for (const product of products) {
		productQueries.push(prisma.product.create({ data: product }));
	}

	await prisma.$transaction(productQueries);
}

async function addPavers() {
	const PAVERS: Product[] = [
		{
			id: 'colonial_classic',
			defaultSkuId: 'colonial_classic:grey',
			estimator: 'paver',
			displayName: 'Colonial Classic',
			similar: ['banjo', 'thin_classic', 'heritage'],
			skuIdFragments: [
				{
					type: 'color',
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
			similar: ['colonial_classic', 'banjo', 'circle_bundle'],
			skuIdFragments: [
				{
					type: 'color',
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
			similar: ['colonial_classic', 'heritage', 'cobble_mix'],
			skuIdFragments: [
				{
					type: 'color',
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
			similar: ['cobble_mix', 'tropical_wave', 'colonial_classic'],
			skuIdFragments: [
				{
					type: 'color',
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
			similar: ['owc', 'cobble_mix', 'colonial_classic'],
			skuIdFragments: [
				{
					type: 'color',
					displayName: 'Colour',
					fragments: PAVER_COLOR_FRAGMENTS
				}
			]
		},
		{
			id: 'circle_bundle',
			defaultSkuId: 'circle_bundle:grey',
			displayName: 'Circle Bundle',
			similar: ['owc', 'cobble_mix', 'colonial_classic'],
			hasModels: false,
			skuIdFragments: [
				{
					type: 'color',
					displayName: 'Colour',
					fragments: PAVER_COLOR_FRAGMENTS
				}
			]
		},
		{
			id: 'circle_stepping',
			defaultSkuId: 'circle_stepping:grey',
			displayName: 'Circle Stepping Stone',
			similar: ['owc', 'cobble_mix', 'colonial_classic'],
			hasModels: false,
			skuIdFragments: [
				{
					type: 'color',
					displayName: 'Colour',
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
			hasModels: product.hasModels === undefined,
			similar: {
				create: similar.map((id, index) => ({
					similarId: id,
					relevance: similar.length - index
				}))
			},

			description: `Create a traditional feel to your garden with our ${product.displayName} Paver. As one of the most sought after styles of stone paving, it displays a beautiful range of colors which will brighten up any exterior to create an added sense of space! Using aggregates sourced from the St. Thomas River, ${product.displayName} promises an outdoor area filled with character and is a household favourite providing a wealth of design opportunities.`
		})
	);

	await addCategories(
		[{ id: 'concrete_pavers', displayName: 'Concrete Pavers' }],
		PAVERS
	);
}

async function addSlabsAndBlocks() {
	const SLABS_AND_BLOCKS: Product[] = [
		{
			category: { connect: { id: 'slabs_blocks' } },
			id: 'savannah',
			defaultSkuId: 'savannah:16x8:regular:grey',
			displayName: 'Savannah',
			similar: ['heritage', 'circle_stepping', 'grasscrete'],
			skuIdFragments: [
				{
					type: 'variant',
					displayName: 'Dimensions',
					fragments: [
						{ id: '16x8', displayName: '16 x 8' },
						{ id: '16x16', displayName: '16 x 16' },
						{ id: '16x24', displayName: '16 x 24' },
						{ id: '24x24', displayName: '24 x 24' }
					]
				},
				{
					type: 'variant',
					displayName: 'Variant',
					fragments: [
						{ id: 'regular', displayName: 'Regular' },
						{ id: 'exposed', displayName: 'Exposed' }
					]
				},
				{
					type: 'color',
					displayName: 'Colour',
					fragments: PAVER_COLOR_FRAGMENTS
				}
			]
		},
		{
			category: { connect: { id: 'slabs_blocks' } },
			id: 'grasscrete',
			defaultSkuId: 'grasscrete:circle:grey',
			displayName: 'Grasscrete',
			similar: ['tropical_wave', 'circle_stepping', 'savannah'],
			skuIdFragments: [
				{
					type: 'variant',
					displayName: 'Shape',
					fragments: [{ id: 'circle', displayName: 'Circle' }]
				},
				{
					type: 'color',
					displayName: 'Colour',
					fragments: PAVER_COLOR_FRAGMENTS
				}
			]
		},
		{
			category: { connect: { id: 'slabs_blocks' } },
			id: 'curbwall',
			defaultSkuId: 'curbwall:grey',
			displayName: 'Curb Wall',
			similar: ['tropical_wave', 'circle_stepping', 'savannah'],
			skuIdFragments: [
				{
					type: 'color',
					displayName: 'Colour',
					fragments: [{ id: 'grey', displayName: 'Grey', css: '#D9D9D9' }]
				}
			]
		}
	].map(
		({ similar, ...product }): Product => ({
			...product,
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

			description:
				'Integer a velit in sapien aliquam consectetur et vitae ligula. Integer ornare egestas enim a malesuada. Suspendisse arcu lectus, blandit nec gravida at, maximus ut lorem. Nulla malesuada vehicula neque at laoreet. Nullam efficitur mauris sit amet accumsan pulvinar.'
		})
	);

	addCategories(
		[
			{
				id: 'slabs_blocks',
				displayName: 'Slabs and BLocks'
			}
		],
		SLABS_AND_BLOCKS
	);
}

async function addCleaningAndInstallationProducts() {
	const CLEANING_INSTALLATION_PRODUCTS: Product[] = [
		{
			category: { connect: { id: 'installation' } },
			id: 'oil_sealant',
			defaultSkuId: 'oil_sealant:one_gallon',
			displayName: 'DYNA Oil-Based Sealant',
			similar: ['water_sealant', 'efflorescence_cleaner', 'polymeric_sand'],
			skuIdFragments: [
				{
					type: 'variant',
					displayName: 'Size',
					fragments: [
						{ id: 'one_gallon', displayName: 'One Gallon' },
						{ id: 'five_gallon', displayName: 'Five Gallon' }
					]
				}
			]
		},
		{
			category: { connect: { id: 'installation' } },
			id: 'water_sealant',
			defaultSkuId: 'water_sealant:one_gallon',
			displayName: 'DYNA Water-Based Sealant',
			similar: ['oil_sealant', 'efflorescence_cleaner', 'polymeric_sand'],
			skuIdFragments: [
				{
					type: 'variant',
					displayName: 'Size',
					fragments: [
						{ id: 'one_gallon', displayName: 'One Gallon' },
						{ id: 'five_gallon', displayName: 'Five Gallon' }
					]
				}
			]
		},
		{
			category: { connect: { id: 'installation' } },
			id: 'polymeric_sand',
			defaultSkuId: 'polymeric_sand:fifty_pound',
			displayName: 'DYNA Polymeric Sand',
			similar: ['oil_sealant', 'water_sealant', 'efflorescence_cleaner'],
			skuIdFragments: [
				{
					type: 'variant',
					displayName: 'Size',
					fragments: [{ id: 'fifty_pound', displayName: '50 pound bag' }]
				}
			]
		},
		{
			category: { connect: { id: 'cleaning' } },
			id: 'efflorescence_cleaner',
			defaultSkuId: 'efflorescence_cleaner:one_gallon',
			displayName: 'DYNA Efflorescence Cleaner',
			similar: ['stone_soap', 'gum_paint_tar', 'oil_sealant'],
			skuIdFragments: [
				{
					type: 'variant',
					displayName: 'Size',
					fragments: [{ id: 'one_gallon', displayName: 'One Gallon' }]
				}
			]
		},
		{
			category: { connect: { id: 'cleaning' } },
			id: 'stone_soap',
			defaultSkuId: 'stone_soap:one_quart',
			displayName: 'DYNA Stone Soap',
			similar: ['efflorescence_cleaner', 'gum_paint_tar', 'oil_sealant'],
			skuIdFragments: [
				{
					type: 'variant',
					displayName: 'Variant',
					fragments: [{ id: 'one_quart', displayName: 'One Quart' }]
				}
			]
		},
		{
			category: { connect: { id: 'cleaning' } },
			id: 'gum_paint_tar',
			defaultSkuId: 'gum_paint_tar:one_quart',
			displayName: 'DYNA Gum Paint & Tar Stripper',
			similar: ['efflorescence_cleaner', 'stone_soap', 'oil_sealant'],
			skuIdFragments: [
				{
					type: 'variant',
					displayName: 'Variant',
					fragments: [{ id: 'one_quart', displayName: 'One Quart' }]
				}
			]
		}
	].map(
		({ similar, ...product }): Product => ({
			...product,
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

			description:
				'Integer a velit in sapien aliquam consectetur et vitae ligula. Integer ornare egestas enim a malesuada. Suspendisse arcu lectus, blandit nec gravida at, maximus ut lorem. Nulla malesuada vehicula neque at laoreet. Nullam efficitur mauris sit amet accumsan pulvinar.'
		})
	);

	const CATEGORIES: Category[] = [
		{ id: 'installation', displayName: 'Paver Installation' },
		{ id: 'cleaning', displayName: 'Concrete Cleaning' }
	];

	addCategories(CATEGORIES, CLEANING_INSTALLATION_PRODUCTS);
}

const PRODUCT_DETAILS: ProductDetails[] = [
	{
		matcher: 'colonial_classic',
		productId: 'colonial_classic',
		data: [
			{
				id: 'dimensions',
				displayName: 'Dimensions',
				value: '4in x 8in x 2.375in'
			},
			{ id: 'lbs_per_unit', displayName: 'Weight per Unit', value: 5 },
			{ id: 'sqft_per_pallet', displayName: 'Area per Pallet', value: 128.75 },
			{ id: 'units_per_pallet', displayName: 'Units per Pallet', value: 600 },
			{ id: 'pcs_per_sqft', displayName: 'Pieces per sqft', value: 4.66 }
		]
	},
	{
		matcher: 'thin_classic',
		productId: 'thin_classic',
		data: [
			{
				id: 'dimensions',
				displayName: 'Dimensions',
				value: '4in x 8in x 1.375in'
			},
			{ id: 'lbs_per_unit', displayName: 'Weight per Unit', value: 4.16 },
			{ id: 'sqft_per_pallet', displayName: 'Area per Pallet', value: 154.5 },
			{ id: 'units_per_pallet', displayName: 'Units per Pallet', value: 720 },
			{ id: 'pcs_per_sqft', displayName: 'Pieces per sqft', value: 4.66 }
		]
	},
	{
		matcher: 'banjo',
		productId: 'banjo',
		data: [
			{
				id: 'dimensions',
				displayName: 'Dimensions',
				value: '5.5in x 9in x 2.375in'
			},
			{ id: 'lbs_per_unit', displayName: 'Weight per Unit', value: 6.67 },
			{ id: 'sqft_per_pallet', displayName: 'Area per Pallet', value: 128.57 },
			{ id: 'units_per_pallet', displayName: 'Units per Pallet', value: 450 },
			{ id: 'pcs_per_sqft', displayName: 'Pieces per sqft', value: 3.5 }
		]
	},
	{
		matcher: 'owc',
		productId: 'owc',
		data: [
			{
				id: 'dimensions',
				displayName: 'Dimensions',
				value: '5.5in x 9in x 2.375in'
			},
			{ id: 'lbs_per_unit', displayName: 'Weight per Unit', value: 3.75 },
			{ id: 'sqft_per_pallet', displayName: 'Area per Pallet', value: 125.39 },
			{ id: 'units_per_pallet', displayName: 'Units per Pallet', value: 800 },
			{ id: 'pcs_per_sqft', displayName: 'Pieces per sqft', value: 6.38 }
		]
	},
	{
		matcher: 'cobble_mix:double',
		productId: 'cobble_mix',
		data: [
			{
				id: 'dimensions',
				displayName: 'Dimensions',
				value: '7in x 9.5in x 2.375in'
			},
			{ id: 'lbs_per_unit', displayName: 'Weight per Unit', value: 11.28 },
			{ id: 'sqft_per_pallet', displayName: 'Area per Pallet', value: 119.28 },
			{ id: 'units_per_pallet', displayName: 'Units per Pallet', value: 266 },
			{ id: 'pcs_per_sqft', displayName: 'Pieces per sqft', value: 2.23 }
		]
	},
	{
		matcher: 'cobble_mix:oblong',
		productId: 'cobble_mix',
		data: [
			{
				id: 'dimensions',
				displayName: 'Dimensions',
				value: '4.75in x 7in x 2.375in'
			},
			{ id: 'lbs_per_unit', displayName: 'Weight per Unit', value: 5.3 },
			{ id: 'sqft_per_pallet', displayName: 'Area per Pallet', value: 126.91 },
			{ id: 'units_per_pallet', displayName: 'Units per Pallet', value: 566 },
			{ id: 'pcs_per_sqft', displayName: 'Pieces per sqft', value: 4.46 }
		]
	},
	{
		matcher: 'cobble_mix:two_part',
		productId: 'cobble_mix',
		data: [
			{
				id: 'dimensions',
				displayName: 'Dimensions',
				value: '4.75in x 7in x 2.375in'
			},
			{ id: 'lbs_per_unit', displayName: 'Weight per Unit', value: 3.53 },
			{ id: 'sqft_per_pallet', displayName: 'Area per Pallet', value: 130.97 },
			{ id: 'units_per_pallet', displayName: 'Units per Pallet', value: 850 },
			{ id: 'pcs_per_sqft', displayName: 'Pieces per sqft', value: 6.49 }
		]
	},
	{
		matcher: 'heritage:regular',
		productId: 'heritage',
		data: [
			{
				id: 'dimensions',
				displayName: 'Dimensions',
				value: '6in x 9in x 2.375in'
			},
			{ id: 'lbs_per_unit', displayName: 'Weight per Unit', value: 9.15 },
			{ id: 'sqft_per_pallet', displayName: 'Area per Pallet', value: 120.59 },
			{ id: 'units_per_pallet', displayName: 'Units per Pallet', value: 328 },
			{ id: 'pcs_per_sqft', displayName: 'Pieces per sqft', value: 2.72 }
		]
	},
	{
		matcher: 'heritage:square',
		productId: 'heritage',
		data: [
			{
				id: 'dimensions',
				displayName: 'Dimensions',
				value: '6in x 6in x 2.375in'
			},
			{ id: 'lbs_per_unit', displayName: 'Weight per Unit', value: 5.86 },
			{ id: 'sqft_per_pallet', displayName: 'Area per Pallet', value: 128 },
			{ id: 'units_per_pallet', displayName: 'Units per Pallet', value: 512 },
			{ id: 'pcs_per_sqft', displayName: 'Pieces per sqft', value: 4 }
		]
	},
	{
		matcher: 'heritage:two_part',
		productId: 'heritage',
		data: [
			{
				id: 'dimensions',
				displayName: 'Dimensions',
				value: '6in x 9in x 2.375in'
			},
			{ id: 'lbs_per_unit', displayName: 'Weight per Unit', value: 5.77 },
			{ id: 'sqft_per_pallet', displayName: 'Area per Pallet', value: 130 },
			{ id: 'units_per_pallet', displayName: 'Units per Pallet', value: 520 },
			{ id: 'pcs_per_sqft', displayName: 'Pieces per sqft', value: 4 }
		]
	},
	{
		matcher: 'tropical_wave',
		productId: 'tropical_wave',
		data: [
			{
				id: 'dimensions',
				displayName: 'Dimensions',
				value: '4.75in x 9.5in x 3in'
			},
			{ id: 'lbs_per_unit', displayName: 'Weight per Unit', value: 9.38 },
			{ id: 'sqft_per_pallet', displayName: 'Area per Pallet', value: 102.89 },
			{ id: 'units_per_pallet', displayName: 'Units per Pallet', value: 320 },
			{ id: 'pcs_per_sqft', displayName: 'Pieces per sqft', value: 3.11 }
		]
	},
	{
		matcher: 'circle_bundle',
		productId: 'circle_bundle',
		data: [
			{ id: 'lbs_per_unit', displayName: 'Weight per Unit', value: 2.75 },
			{
				id: 'sqft_per_full_bundle',
				displayName: 'Area per 8ft bundle',
				value: 63
			},
			{
				id: 'sqft_per_half_bundle',
				displayName: 'Area per 5ft bundle',
				value: 31.5
			},
			{
				id: 'units_per_full_bundle',
				displayName: 'Units per 8ft bundle',
				value: 419
			},
			{
				id: 'units_per_half_bundle',
				displayName: 'Units per 5ft bundle',
				value: 169
			}
		]
	},
	{
		matcher: 'circle_stepping',
		productId: 'circle_stepping',
		data: [
			{
				id: 'dimensions',
				displayName: 'Dimensions',
				value: '11in x 11in x 2.375in'
			},
			{ id: 'lbs_per_unit', displayName: 'Weight per Unit', value: 9.38 },
			{ id: 'sqft_per_pallet', displayName: 'Area per Pallet', value: 120 },
			{ id: 'units_per_pallet', displayName: 'Units per Pallet', value: 120 },
			{ id: 'pcs_per_sqft', displayName: 'Pieces per sqft', value: 1 }
		]
	},
	{
		matcher: 'savannah:16x8',
		productId: 'savannah',
		data: [
			{
				id: 'dimensions',
				displayName: 'Dimensions',
				value: '8in x 16in x 3in'
			},
			{ id: 'lbs_per_unit', displayName: 'Weight per Unit', value: 20 },
			{ id: 'sqft_per_pallet', displayName: 'Area per Pallet', value: 104.4 },
			{ id: 'units_per_pallet', displayName: 'Units per Pallet', value: 116 },
			{ id: 'pcs_per_sqft', displayName: 'Pieces per sqft', value: 0.9 }
		]
	},
	{
		matcher: 'savannah:16x16',
		productId: 'savannah',
		data: [
			{
				id: 'dimensions',
				displayName: 'Dimensions',
				value: '16in x 16in x 3in'
			},
			{ id: 'lbs_per_unit', displayName: 'Weight per Unit', value: 28 },
			{ id: 'sqft_per_pallet', displayName: 'Area per Pallet', value: 104.88 },
			{ id: 'units_per_pallet', displayName: 'Units per Pallet', value: 59 },
			{ id: 'pcs_per_sqft', displayName: 'Pieces per sqft', value: 0.5625 }
		]
	},
	{
		matcher: 'savannah:16x24',
		productId: 'savannah',
		data: [
			{
				id: 'dimensions',
				displayName: 'Dimensions',
				value: '16in x 24in x 3in'
			},
			{ id: 'lbs_per_unit', displayName: 'Weight per Unit', value: 36 },
			{ id: 'sqft_per_pallet', displayName: 'Area per Pallet', value: 104 },
			{ id: 'units_per_pallet', displayName: 'Units per Pallet', value: 39 },
			{ id: 'pcs_per_sqft', displayName: 'Pieces per sqft', value: 0.375 }
		]
	},
	{
		matcher: 'savannah:24x24',
		productId: 'savannah',
		data: [
			{
				id: 'dimensions',
				displayName: 'Dimensions',
				value: '24in x 24in x 3in'
			},
			{ id: 'lbs_per_unit', displayName: 'Weight per Unit', value: 42 },
			{ id: 'sqft_per_pallet', displayName: 'Area per Pallet', value: 104 },
			{ id: 'units_per_pallet', displayName: 'Units per Pallet', value: 26 },
			{ id: 'pcs_per_sqft', displayName: 'Pieces per sqft', value: 0.25 }
		]
	},
	{
		matcher: 'grasscrete:circle',
		productId: 'grasscrete',
		data: [
			{
				id: 'dimensions',
				displayName: 'Dimensions',
				value: '23.5in x 15.5in x 3.5in'
			},
			{ id: 'lbs_per_unit', displayName: 'Weight per Unit', value: 19 },
			{ id: 'sqft_per_pallet', displayName: 'Area per Pallet', value: 106 },
			{ id: 'units_per_pallet', displayName: 'Units per Pallet', value: 40 },
			{ id: 'pcs_per_sqft', displayName: 'Pieces per sqft', value: 0.373 }
		]
	},
	{
		matcher: 'curbwall',
		productId: 'curbwall',
		data: [
			{
				id: 'dimensions',
				displayName: 'Dimensions',
				value: '29.5in x 4in x 7in'
			}
		]
	},
	{
		matcher: 'oil_sealant:one_gallon',
		productId: 'oil_sealant',
		data: [
			{ id: 'coverage', displayName: 'Coverage', value: '100sqft' },
			{ id: 'lbs_per_unit', displayName: 'Weight per unit', value: 4 }
		]
	},
	{
		matcher: 'oil_sealant:five_gallon',
		productId: 'oil_sealant',
		data: [
			{ id: 'coverage', displayName: 'Coverage', value: '500sqft' },
			{ id: 'lbs_per_unit', displayName: 'Weight per unit', value: 25 }
		]
	},
	{
		matcher: 'water_sealant:one_gallon',
		productId: 'water_sealant',
		data: [
			{ id: 'coverage', displayName: 'Coverage', value: '100sqft' },
			{ id: 'lbs_per_unit', displayName: 'Weight per unit', value: 4 }
		]
	},
	{
		matcher: 'water_sealant:five_gallon',
		productId: 'water_sealant',
		data: [
			{ id: 'coverage', displayName: 'Coverage', value: '500sqft' },
			{ id: 'lbs_per_unit', displayName: 'Weight per unit', value: 25 }
		]
	},
	{
		productId: 'polymeric_sand',
		matcher: 'polymeric_sand:fifty_pound',
		data: [
			{ id: 'coverage', displayName: 'Coverage', value: '100sqft' },
			{ id: 'lbs_per_unit', displayName: 'Weight per unit', value: 50 }
		]
	},
	{
		productId: 'efflorescence_cleaner',
		matcher: 'efflorescence_cleaner:one_gallon',
		data: [
			{ id: 'coverage', displayName: 'Coverage', value: '100sqft' },
			{ id: 'lbs_per_unit', displayName: 'Weight per unit', value: 20 }
		]
	},
	{
		productId: 'stone_soap',
		matcher: 'stone_soap:one_quart',
		data: [
			{ id: 'coverage', displayName: 'Coverage', value: '25sqft' },
			{ id: 'lbs_per_unit', displayName: 'Weight per unit', value: 6 }
		]
	},
	{
		productId: 'gum_paint_tar',
		matcher: 'gum_paint_tar:one_quart',
		data: [{ id: 'lbs_per_unit', displayName: 'Weight per unit', value: 3 }]
	}
];

async function addProductDetails() {
	// Create details for every product
	await prisma.productDetails.createMany({
		data: PRODUCT_DETAILS
	});
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
				id: 'savannah:16x24: regular',
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
			id: 'curbwall:grey',
			productId: 'curbwall',
			detailsMatcher: 'curbwall',
			displayName: 'Curbwall Grey',
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

	await prisma.sku.createMany({
		data: PAVER_SKUS
	});
}

async function addCleaningAndInstallationSkus() {
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

	await prisma.sku.createMany({
		data: CLEANING_INSALLATION_SKUS
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
	await addSlabsAndBlocks();
	await addCleaningAndInstallationProducts();
	await addProductDetails();
	await addCleaningAndInstallationSkus();
	await addConcreteProductSkus();
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
