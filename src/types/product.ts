import type {
	categories,
	products,
	skuDetails,
	skuRestocks,
	skuStock,
	skus
} from '~/server/db/schema';

export type Category = typeof categories.$inferInsert;
type Product = typeof products.$inferInsert;
type SkuDetails = typeof skuDetails.$inferInsert;
type Restock = typeof skuRestocks.$inferInsert;
type Stock = typeof skuStock.$inferInsert;
export type Sku = typeof skus.$inferInsert;

export type FormattedProductDetails = {
	displayName: string;
	value: string | number;
}[];

type ExtendedProductDetails<TRawDetails> = Omit<
	SkuDetails,
	'rawData' | 'formattedData'
> & {
	rawData: TRawDetails | null;
	formattedData: FormattedProductDetails;
};

type SkuWithDetails<TRawDetails> = Sku & {
	details: ExtendedProductDetails<TRawDetails>;
};

export type StartingSku = Pick<Sku, 'price' | 'unit'>;

type Similar = Pick<Product, 'id' | 'defaultSkuId' | 'displayName'> & {
	startingSku: StartingSku;
};

type FullProduct<TRawDetails, TSkuIdFragments> = Product & {
	details: ExtendedProductDetails<TRawDetails>[];
	skus: Sku[];
	category: Category;
	stock: Stock[];
	restock: Restock[];
	similar: Similar[];
	skuIdFragments: TSkuIdFragments;
};

export type PaverDetails = {
	type: 'paver';
	lbs_per_unit: number;
	sqft_per_pallet: number;
	pcs_per_pallet: number;
	pcs_per_sqft: number;
	conversion_factors?: { TIP_TO_TIP: number; SOLDIER_ROW: number };
};

export type VariantIdTemplate = (
	| {
			type: 'color';
			displayName: string;
			fragments: { id: string; displayName: string; css: string }[];
	  }
	| {
			type: 'variant';
			displayName: string;
			fragments: { id: string; displayName: string }[];
	  }
)[];

export type FullPaver = FullProduct<PaverDetails, VariantIdTemplate>;

export type ExtendedPaverDetails = ExtendedProductDetails<PaverDetails>;
export type PaverSkuWithDetails = SkuWithDetails<PaverDetails>;
