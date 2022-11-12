import { PickupLocation } from '@prisma/client';

export type ProductDetails = {
	product_id: string;
	matcher: string;
	dimensions: [number, number, number];
	lbs_per_unit: number;
	sqft_per_pallet: number;
	units_per_pallet: number;
	pcs_per_sqft: number;
};

type GalleryItem = {
	id: string;
	imgUrl: string;
};

export type SkuFragment =
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

export type Product = {
	id: string;
	defaultSkuIdTemplate: string;
	lowestPrice: number;
	pickupLocations: PickupLocation[];
	category: { id: string; displayName: string };
	displayName: string;
	gallery: GalleryItem[];
	similarProducts: string[];
	skuIdFragments: SkuFragment[];
};

export type SKU = {
	id: string;
	displayName: string;
	price: number;
};

export type Stock = {
	skuId: string;
	location: PickupLocation;
	quantity: number;
};

export type RestockQueueElement = {
	skuId: string;
	location: PickupLocation;
	quantity: number;
	date: number;
	fulfilled: boolean;
};
