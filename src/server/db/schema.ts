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
	customType,
	bigint
} from 'drizzle-orm/mysql-core';
import { relations, sql } from 'drizzle-orm';
import type {
	FormattedProductDetails,
	PaverDetails,
	VariantIdTemplate
} from '~/types/product';

const price = customType<{ data: number; driverData: string | number }>({
	dataType: () => 'decimal(10,2)',
	fromDriver: (value) => (typeof value === 'number' ? value : parseFloat(value))
});

const bigprice = customType<{ data: number; driverData: string | number }>({
	dataType: () => 'decimal(14,2)',
	fromDriver: (value) => (typeof value === 'number' ? value : parseFloat(value))
});

const boolean = customType<{ data: boolean; driverData: number }>({
	dataType: () => 'tinyint',
	toDriver: (value) => Number(value),
	fromDriver: (value) => value > 0
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
		skusProductIdIdx: index('skus_product_id_idx').on(table.productId)
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
		id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
		createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
			.default(sql`CURRENT_TIMESTAMP(3)`)
			.notNull(),
		updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
			.default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
			.notNull(),
		title: varchar('title', { length: 64 }).default('Untitled Quote').notNull(),
		totalArea: double('area').default(0).notNull(),
		totalWeight: double('weight').default(0).notNull(),
		subtotal: bigprice('subtotal').default(0).notNull(),
		tax: bigprice('tax').default(0).notNull(),
		total: bigprice('total').default(0).notNull()
	},
	(table) => ({
		quotesTitleIdx: index('quotes_title_idx').on(table.title)
	})
);

export const quoteItems = mysqlTable(
	'quote_items',
	{
		createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
			.default(sql`CURRENT_TIMESTAMP(3)`)
			.notNull(),
		skuId: varchar('sku_id', { length: 48 }).notNull(),
		quantity: int('quantity').notNull(),
		unit: varchar('unit', { length: 4 }).notNull(),
		cost: bigprice('cost').notNull(),
		area: double('area'),
		weight: double('weight').notNull(),
		pickupLocationId: varchar('pickup_location_id', { length: 24 }).notNull(),
		quoteId: bigint('id', { mode: 'number' }).notNull(),
		metadata: json('metadata')
	},
	(table) => ({
		quoteItemsQuoteIdIdx: index('quote_items_quote_id_idx').on(table.quoteId),
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

export const productRecommendations = mysqlTable(
	'product_recommendations',
	{
		relevance: int('relevance').notNull(),
		recommenderId: varchar('recommender_id', { length: 32 }).notNull(),
		recommendingId: varchar('recommending_id', { length: 32 }).notNull()
	},
	(table) => ({
		productRecommendationsRecommenderIdIdx: index(
			'product_recommendations_recommender_id_idx'
		).on(table.recommenderId),
		productRecommendationsRecommenderIdRecommendingId: primaryKey(
			table.recommenderId,
			table.recommendingId
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
	skuStock: many(skuStock),
	skuRestocks: many(skuRestocks),
	recommendations: many(productRecommendations, {
		relationName: 'recommenders'
	}),
	recommenders: many(productRecommendations, { relationName: 'recommending' })
}));

export const productRecommendationsRelations = relations(
	productRecommendations,
	({ one }) => ({
		recommender: one(products, {
			fields: [productRecommendations.recommenderId],
			references: [products.id],
			relationName: 'recommenders'
		}),
		recommending: one(products, {
			fields: [productRecommendations.recommendingId],
			references: [products.id],
			relationName: 'recommending'
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
	quoteItems: many(quoteItems),
	stock: many(skuStock),
	restocks: many(skuRestocks)
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
		skuStock: many(skuStock),
		skuRestocks: many(skuRestocks),
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
