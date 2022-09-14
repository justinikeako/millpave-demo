export type ProductDetails = {
	product_id: string;
	supports: { index: number; values: string[] | 'all' }[];
	dimensions: [number, number, number];
	lbs_per_unit: number;
	sqft_per_pallet: number;
	units_per_pallet: number;
	pcs_per_sqft: number;
};

type GalleryItem = {
	id: string;
	img_url: string;
};

type RelatedProduct = {
	id: string;
	display_name: string;
	default_sku_id_fragment: string[];
	price: number;
};

type SkuFragment =
	| {
			index: number;
			type: 'color';
			display_name: string;
			fragments: { id: string; hex: string }[];
	  }
	| {
			index: number;
			type: 'variant';
			display_name: string;
			fragments: { id: string; display_name: string }[];
	  };

export type PickupLocation = 'factory' | 'showroom';

export type Product = {
	id: string;
	pickup_location_list: PickupLocation[];
	category: { id: string; display_name: string };
	display_name: string;
	gallery: GalleryItem[];
	similar_products: RelatedProduct[];
	sku_id_fragments: SkuFragment[];
};

export type SKU = {
	id: string;
	display_name: string;
	price: number;
};

export type Stock = {
	sku_id: string;
	location: PickupLocation;
	quantity: number;
};

export type RestockQueueElement = {
	sku_id: string;
	location: PickupLocation;
	quantity: number;
	date: number;
	fulfilled: boolean;
};
