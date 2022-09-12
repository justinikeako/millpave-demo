export type ProductDetails = {
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
	price: number;
};

type SkuFragment = {
	index: number;
	type: 'color';
	display_name: string;
	fragments: { id: string; hex: string }[];
};

export type PickupLocation = 'factory' | 'showroom';

export type Product = {
	id: string;
	category: { id: string; display_name: string };
	display_name: string;
	details: ProductDetails;
	gallery: GalleryItem[];
	similar_products: RelatedProduct[];
	sku_id_fragments: SkuFragment[];
};

export type SKU = {
	id: string;
	display_name: string;
	price: number;
};
