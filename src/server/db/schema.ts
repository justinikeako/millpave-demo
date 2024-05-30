import { relations } from 'drizzle-orm';
import {
<<<<<<< HEAD:src/drizzle/schema.ts
	mysqlTableCreator,
=======
	pgTableCreator,
>>>>>>> app-dir:src/server/db/schema.ts
	varchar,
	index,
	primaryKey,
	text,
	json,
	timestamp,
	doublePrecision,
	integer,
	boolean,
	customType,
	bigint,
	serial
} from 'drizzle-orm/pg-core';
import type {
	FormattedProductDetails,
	PaverDetails,
	VariantIdTemplate
} from '~/types/product';

<<<<<<< HEAD:src/drizzle/schema.ts
const mysqlTable = mysqlTableCreator((name) => 'millpave_' + name);

const price = customType<{ data: number; driverData: string | number }>({
	dataType: () => 'decimal(10,2)',
	fromDriver: (value) => (typeof value === 'number' ? value : parseFloat(value))
});
=======
const mysqlTable = pgTableCreator((name) => 'millpave_' + name);
>>>>>>> app-dir:src/server/db/schema.ts

const price = customType<{ data: number; driverData: string | number }>({
	dataType: () => 'numeric(14,2)',
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
		categoryId: varchar('category_id', { length: 32 })
			.notNull()
			.references(() => categories.id),
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

export const productRecommendations = mysqlTable(
	'product_recommendations',
	{
		relevance: integer('relevance').notNull(),
		recommenderId: varchar('recommender_id', { length: 32 }).notNull(),
		recommendingId: varchar('recommending_id', { length: 32 }).notNull()
	},
	(table) => ({
		productRecommendationsRecommenderIdIdx: index(
			'product_recommendations_recommender_id_idx'
		).on(table.recommenderId),
		productRecommendationsRecommenderIdRecommendingId: primaryKey({
			columns: [table.recommenderId, table.recommendingId]
		})
	})
);

export const skus = mysqlTable(
	'skus',
	{
		id: varchar('id', { length: 48 }).primaryKey().notNull(),
		displayName: varchar('display_name', { length: 64 }).notNull(),
		price: price('price').notNull(),
		unit: varchar('unit', { length: 4 }).notNull(),
		productId: varchar('product_id', { length: 32 })
			.notNull()
			.references(() => products.id),
		detailsMatcher: varchar('details_matcher', { length: 48 })
			.notNull()
			.references(() => skuDetails.matcher)
	},
	(table) => ({
		skusProductIdIdx: index('skus_product_id_idx').on(table.productId)
	})
);

export const skuDetails = mysqlTable(
	'sku_details',
	{
		matcher: varchar('matcher', { length: 48 }).primaryKey().notNull(),
		productId: varchar('product_id', { length: 32 })
			.notNull()
			.references(() => products.id),
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
		id: serial('id').primaryKey().notNull(),
		createdAt: timestamp('created_at', { mode: 'date', precision: 3 })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp('updated_at', { mode: 'date', precision: 3 })
			.defaultNow()
			.notNull(),
		title: varchar('title', { length: 64 }).default('Untitled Quote').notNull(),
		totalArea: doublePrecision('area').default(0).notNull(),
		totalWeight: doublePrecision('weight').default(0).notNull(),
		subtotal: price('subtotal').default(0).notNull(),
		tax: price('tax').default(0).notNull(),
		total: price('total').default(0).notNull()
	},
	(table) => ({
		quotesTitleIdx: index('quotes_title_idx').on(table.title)
	})
);

export const quoteItems = mysqlTable(
	'quote_items',
	{
		createdAt: timestamp('created_at', { mode: 'date', precision: 3 })
			.defaultNow()
			.notNull(),
		quantity: integer('quantity').notNull(),
		unit: varchar('unit', { length: 4 }).notNull(),
		cost: price('cost').notNull(),
		area: doublePrecision('area'),
		weight: doublePrecision('weight').notNull(),
		skuId: varchar('sku_id', { length: 48 })
			.notNull()
			.references(() => skus.id),
		pickupLocationId: varchar('pickup_location_id', { length: 24 })
			.notNull()
			.references(() => pickupLocations.id),
		quoteId: bigint('id', { mode: 'number' })
			.notNull()
			.references(() => quotes.id),
		metadata: json('metadata')
	},
	(table) => ({
		quoteItemsQuoteIdIdx: index('quote_items_quote_id_idx').on(table.quoteId),
		quoteItemsSkuIdPickupLocationIdQuoteId: primaryKey({
			columns: [table.skuId, table.pickupLocationId, table.quoteId]
		})
	})
);

export const skuRestocks = mysqlTable(
	'sku_restocks',
	{
		id: serial('id').primaryKey().notNull(),
		quantity: integer('quantity').notNull(),
		date: timestamp('date', { mode: 'date', precision: 3 }).notNull(),
		fulfilled: boolean('fulfilled').default(false).notNull(),
		skuId: varchar('sku_id', { length: 48 })
			.notNull()
			.references(() => skus.id),
		locationId: varchar('location_id', { length: 24 })
			.notNull()
			.references(() => pickupLocations.id),
		productId: varchar('product_id', { length: 32 })
			.notNull()
			.references(() => products.id)
	},
	(table) => ({
		skuRestocksLocationIdIdx: index('sku_restocks_location_id_idx').on(
			table.locationId
		),
		skuRestocksProductIdIdx: index('sku_restocks_product_id_idx').on(
			table.productId
		),
		skuRestocksSkuIdIdx: index('sku_restocks_sku_id_idx').on(table.skuId)
	})
);

export const skuStock = mysqlTable(
	'sku_stock',
	{
		quantity: integer('quantity').notNull(),
		skuId: varchar('sku_id', { length: 191 })
			.notNull()
			.references(() => skus.id),
		locationId: varchar('location_id', { length: 191 })
			.notNull()
			.references(() => pickupLocations.id),
		productId: varchar('product_id', { length: 191 })
			.notNull()
			.references(() => products.id)
	},
	(table) => ({
		skuStockLocationIdIdx: index('sku_stock_location_id_idx').on(
			table.locationId
		),
		skuStockProductIdIdx: index('sku_stock_product_id_idx').on(table.productId),
		skuStockSkuIdIdx: index('sku_stock_sku_id_idx').on(table.skuId),
		skuStockSkuIdLocationId: primaryKey({
			columns: [table.skuId, table.locationId]
		})
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
