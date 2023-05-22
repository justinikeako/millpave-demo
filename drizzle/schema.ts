import {
	mysqlTable,
	varchar,
	index,
	primaryKey,
	text,
	json,
	datetime,
	double,
	int,
	boolean,
	customType,
	char
} from 'drizzle-orm/mysql-core';
import { relations, sql } from 'drizzle-orm';
import {
	FormattedProductDetails,
	PaverDetails,
	VariantIdTemplate
} from '@/types/product';

const price = customType<{ data: number; driverData: string | number }>({
	dataType: () => 'decimal(10, 2)',
	fromDriver: (value) => (typeof value === 'number' ? value : parseFloat(value))
});
const bigprice = customType<{ data: number; driverData: string | number }>({
	dataType: () => 'decimal(14, 2)',
	fromDriver: (value) => (typeof value === 'number' ? value : parseFloat(value))
});

export const categories = mysqlTable('categories', {
	id: varchar('id', { length: 32 }).primaryKey().notNull(),
	displayName: varchar('display_name', { length: 64 }).notNull()
});

export const pickupLocations = mysqlTable('pickup_locations', {
	id: varchar('id', { length: 24 }).primaryKey().notNull(),
	displayName: varchar('display_name', { length: 32 }).notNull()
});

export const products = mysqlTable(
	'products',
	{
		id: varchar('id', { length: 32 }).primaryKey().notNull(),
		displayName: varchar('display_name', { length: 48 }).notNull(),
		description: text('description').notNull(),
		defaultSkuId: varchar('default_sku_id', { length: 48 }).notNull(),
		categoryId: varchar('category_id', { length: 32 }).notNull(),
		variantIdTemplate: json('variant_id_template')
			.notNull()
			.$type<VariantIdTemplate>(),
		hasModels: boolean('has_models').default(false).notNull(),
		canBorder: boolean('can_border').default(false).notNull(),
		estimator: varchar('estimator', { length: 16 })
	},
	(table) => ({
		productCategoryIdIdx: index('products_category_id_idx').on(table.categoryId)
	})
);

export const skus = mysqlTable(
	'skus',
	{
		id: varchar('id', { length: 48 }).primaryKey().notNull(),
		displayName: varchar('display_name', { length: 64 }).notNull(),
		price: price('price').notNull(),
		unit: varchar('unit', { length: 4 }).notNull(),
		productId: varchar('product_id', { length: 32 }).notNull(),
		detailsMatcher: varchar('details_matcher', { length: 48 }).notNull()
	},
	(table) => ({
		skuDetailsMatcherIdx: index('skus_details_matcher_idx').on(
			table.detailsMatcher
		),
		skuProductIdIdx: index('skus_product_id_idx').on(table.productId)
	})
);

export const skuDetails = mysqlTable(
	'sku_details',
	{
		matcher: varchar('matcher', { length: 48 }).primaryKey().notNull(),
		productId: varchar('product_id', { length: 32 }).notNull(),
		rawData: json('raw_data').$type<PaverDetails | null>(),
		formattedData: json('formatted_data')
			.notNull()
			.$type<FormattedProductDetails>()
	},
	(table) => ({
		skuDetailsProductIdIdx: index('sku_details_product_id_idx').on(
			table.productId
		)
	})
);

export const quotes = mysqlTable(
	'quotes',
	{
		id: char('id', { length: 16 }).primaryKey().notNull(),
		createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
			.default(sql`(CURRENT_TIMESTAMP(3))`)
			.notNull(),
		updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 }).notNull(),
		title: varchar('title', { length: 191 }).notNull(),
		area: double('area').notNull(),
		weight: double('weight').notNull(),
		subtotal: bigprice('subtotal').notNull(),
		tax: bigprice('tax').notNull(),
		total: bigprice('total').notNull()
	},
	(table) => ({
		quoteTitleIdx: index('quotes_title_idx').on(table.title)
	})
);

export const quoteItems = mysqlTable(
	'quote_items',
	{
		createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
			.default(sql`(CURRENT_TIMESTAMP(3))`)
			.notNull(),
		updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 }).notNull(),
		quantity: int('quantity').notNull(),
		price: bigprice('price').notNull(),
		skuId: varchar('sku_id', { length: 48 }).notNull(),
		pickupLocationId: varchar('pickup_location_id', { length: 24 }).notNull(),
		quoteId: char('quote_id', { length: 16 }).notNull(),
		metadata: json('metadata')
	},
	(table) => ({
		quoteItemPickupLocationIdIdx: index(
			'quote_items_pickup_location_id_idx'
		).on(table.pickupLocationId),
		quoteItemsQuoteIdIdx: index('quote_items_quote_id_idx').on(table.quoteId),
		quoteItemsSkuIdIdx: index('quote_items_sku_id_idx').on(table.skuId),
		quoteItemsSkuIdPickupLocationIdQuoteId: primaryKey(
			table.skuId,
			table.pickupLocationId,
			table.quoteId
		)
	})
);

export const skuRestocks = mysqlTable(
	'sku_restocks',
	{
		skuId: varchar('sku_id', { length: 48 }).notNull(),
		quantity: int('quantity').notNull(),
		date: datetime('date', { mode: 'date', fsp: 3 }).notNull(),
		fulfilled: boolean('fulfilled').default(false).notNull(),
		locationId: varchar('location_id', { length: 24 }).notNull(),
		productId: varchar('product_id', { length: 32 }).notNull()
	},
	(table) => ({
		skuRestocksLocationIdIdx: index('sku_restocks_location_id_idx').on(
			table.locationId
		),
		skuRestocksProductIdIdx: index('sku_restocks_product_id_idx').on(
			table.productId
		),
		skuRestocksSkuIdIdx: index('sku_restocks_sku_id_idx').on(table.skuId),
		skuRestocksSkuIdLocationId: primaryKey(table.skuId, table.locationId)
	})
);

export const productToProduct = mysqlTable(
	'product_to_product',
	{
		relevance: int('relevance').notNull(),
		productId: varchar('product_id', { length: 32 }).notNull(),
		similarId: varchar('similar_id', { length: 32 }).notNull()
	},
	(table) => ({
		productToProductProductIdIdx: index('product_to_product_product_id_idx').on(
			table.productId
		),
		productToProductSimilarIdIdx: index('product_to_product_similar_id_idx').on(
			table.similarId
		),
		productToProductProductIdSimilarId: primaryKey(
			table.productId,
			table.similarId
		)
	})
);

export const skuStock = mysqlTable(
	'sku_stock',
	{
		quantity: int('quantity').notNull(),
		skuId: varchar('sku_id', { length: 191 }).notNull(),
		locationId: varchar('location_id', { length: 191 }).notNull(),
		productId: varchar('product_id', { length: 191 }).notNull()
	},
	(table) => ({
		skuStockLocationIdIdx: index('sku_stock_location_id_idx').on(
			table.locationId
		),
		skuStockProductIdIdx: index('sku_stock_product_id_idx').on(table.productId),
		skuStockSkuIdIdx: index('sku_stock_sku_id_idx').on(table.skuId),
		skuStockSkuIdLocationId: primaryKey(table.skuId, table.locationId)
	})
);

export const categoriesRelations = relations(categories, ({ many }) => ({
	products: many(products)
}));

export const productsRelations = relations(products, ({ one, many }) => ({
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id]
	}),
	details: many(skuDetails),
	skus: many(skus),
	stockList: many(skuStock),
	restockList: many(skuRestocks),
	similar: many(productToProduct, { relationName: 'similar' }),
	similarTo: many(productToProduct, { relationName: 'similarTo' })
}));

export const productToProductRelations = relations(
	productToProduct,
	({ one }) => ({
		product: one(products, {
			fields: [productToProduct.productId],
			references: [products.id],
			relationName: 'similarTo'
		}),
		similarProduct: one(products, {
			fields: [productToProduct.similarId],
			references: [products.id],
			relationName: 'similar'
		})
	})
);

export const skuDetailsRelations = relations(skuDetails, ({ one, many }) => ({
	product: one(products, {
		fields: [skuDetails.productId],
		references: [products.id]
	}),
	skus: many(skus)
}));

export const skusRelations = relations(skus, ({ one, many }) => ({
	product: one(products, {
		fields: [skus.productId],
		references: [products.id]
	}),
	details: one(skuDetails, {
		fields: [skus.detailsMatcher],
		references: [skuDetails.matcher]
	}),
	quoteItems: many(quoteItems)
}));

export const skuStockRelations = relations(skuStock, ({ one }) => ({
	product: one(products, {
		fields: [skuStock.productId],
		references: [products.id]
	}),
	sku: one(skus, {
		fields: [skuStock.skuId],
		references: [skus.id]
	}),
	location: one(pickupLocations, {
		fields: [skuStock.locationId],
		references: [pickupLocations.id]
	})
}));

export const skuRestocksRelations = relations(skuRestocks, ({ one }) => ({
	product: one(products, {
		fields: [skuRestocks.productId],
		references: [products.id]
	}),
	sku: one(skus, {
		fields: [skuRestocks.skuId],
		references: [skus.id]
	}),
	location: one(pickupLocations, {
		fields: [skuRestocks.locationId],
		references: [pickupLocations.id]
	})
}));

export const pickupLocationsRelations = relations(
	pickupLocations,
	({ many }) => ({
		stockList: many(skuStock),
		restockList: many(skuRestocks),
		quoteItems: many(quoteItems)
	})
);

export const quotesRelations = relations(quotes, ({ many }) => ({
	items: many(quoteItems)
}));

export const quoteItemsRelations = relations(quoteItems, ({ one }) => ({
	sku: one(skus, {
		fields: [quoteItems.skuId],
		references: [skus.id]
	}),
	quote: one(quotes, {
		fields: [quoteItems.quoteId],
		references: [quotes.id]
	}),
	pickupLocation: one(pickupLocations, {
		fields: [quoteItems.pickupLocationId],
		references: [pickupLocations.id]
	})
}));
