import {
	Category,
	Prisma,
	Product,
	ProductDetails,
	Restock,
	Sku,
	Stock
} from '@prisma/client';

type ExtendedProductDetails<TDetails extends Prisma.JsonObject> =
	ProductDetails & { data: TDetails };

type SkuWithDetails<TDetails extends Prisma.JsonObject> = Sku & {
	details: ExtendedProductDetails<TDetails>;
};

type Similar = Pick<
	Product,
	'id' | 'defaultSkuId' | 'displayName' | 'defaultSkuIdTemplate'
> & {
	lowestPrice: number;
};

type FullProduct<
	TDetails extends Prisma.JsonObject,
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

export type PaverDetails = {
	dimensions: [number, number, number];
	lbs_per_unit: number;
	sqft_per_pallet: number;
	units_per_pallet: number;
	pcs_per_sqft: number;
};

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
