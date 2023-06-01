import { InferModel } from 'drizzle-orm';
import {
	categories,
	products,
	skuDetails,
	skuRestocks,
	skuStock,
	skus
} from '@/drizzle/schema';

export type Category = InferModel<typeof categories, 'select'>;
type Product = InferModel<typeof products, 'select'>;
type SkuDetails = InferModel<typeof skuDetails, 'select'>;
type Restock = InferModel<typeof skuRestocks, 'select'>;
type Stock = InferModel<typeof skuStock, 'select'>;
export type Sku = InferModel<typeof skus, 'select'>;

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

type Similar = Pick<
	Product,
	'id' | 'defaultSkuId' | 'displayName' | 'defaultSkuId'
> & {
	startingSku: {
		price: number;
		unit: string;
	};
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
