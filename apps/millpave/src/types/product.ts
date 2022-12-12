import {
	Category,
	Prisma,
	Product,
	ProductDetails,
	Restock,
	Sku,
	Stock
} from '@prisma/client';

type ExtendedProductDetails<TDetails extends Prisma.JsonArray> =
	ProductDetails & { data: TDetails };

type SkuWithDetails<TDetails extends Prisma.JsonArray> = Sku & {
	details: ExtendedProductDetails<TDetails>;
};

type Similar = Pick<
	Product,
	'id' | 'defaultSkuId' | 'displayName' | 'defaultSkuId'
> & {
	startingSku: {
		price: number;
		unit: string;
	};
};

type FullProduct<
	TDetails extends Prisma.JsonArray,
	TSkuIdFragments extends Prisma.JsonArray
> = Product & {
	details: ExtendedProductDetails<TDetails>[];
	skus: Sku[];
	category: Category;
	stock: Stock[];
	restock: Restock[];
	similar: Similar[];
	skuIdFragments: TSkuIdFragments;
};

export type PaverDetails = [
	{ id: 'dimensions'; displayName: string; value: [number, number, number] },
	{ id: 'lbs_per_unit'; displayName: string; value: number },
	{ id: 'sqft_per_pallet'; displayName: string; value: number },
	{ id: 'units_per_pallet'; displayName: string; value: number },
	{ id: 'pcs_per_sqft'; displayName: string; value: number }
];

type PaverSkuIdFragments =
	| {
			type: 'color';
			displayName: string;
			fragments: { id: string; displayName: string; css: string }[];
	  }
	| {
			type: 'variant';
			displayName: string;
			fragments: { id: string; displayName: string }[];
	  };

export type FullPaver = FullProduct<PaverDetails, PaverSkuIdFragments[]>;

export type ExtendedPaverDetails = ExtendedProductDetails<PaverDetails>;
export type PaverSkuWithDetails = SkuWithDetails<PaverDetails>;
