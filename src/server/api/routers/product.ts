import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { products, skuRestocks, skus } from '~/drizzle/schema';
import { and, asc, eq, gte, gt } from 'drizzle-orm';
import { Sku } from '~/types/product';

type StartingSku = Pick<Sku, 'price' | 'unit'>;

export const productRouter = createTRPCRouter({
	getById: publicProcedure
		.input(
			z.object({
				productId: z.string()
			})
		)
		.query(async ({ ctx, input }) => {
			const product = await ctx.db.query.products.findFirst({
				where: (products, { eq }) => eq(products.id, input.productId),
				with: {
					category: true,
					details: true,
					skus: true,
					recommendations: {
						orderBy: (productRecommendations, { desc }) =>
							desc(productRecommendations.relevance),
						with: {
							recommending: {
								columns: {
									id: true,
									displayName: true,
									defaultSkuId: true
								},
								with: {
									skus: {
										orderBy: (skus, { asc }) => asc(skus.price),
										limit: 1,
										columns: { price: true, unit: true }
									}
								}
							}
						}
					}
				}
			});

			if (!product) throw new TRPCError({ code: 'NOT_FOUND' });

			const similarProducts = product.recommendations.map(
				({ recommending: similarProduct }) => {
					const { skus, ...product } = similarProduct;
					return { ...product, startingSku: skus[0] as StartingSku };
				}
			);

			return {
				...product,
				similar: similarProducts
			};
		}),
	getFulfillmentData: publicProcedure
		.input(z.object({ productId: z.string() }))
		.query(async ({ ctx, input }) => {
			const fulfillment = await ctx.db.query.products.findFirst({
				where: eq(products.id, input.productId),
				columns: {},
				with: {
					skuStock: true,
					skuRestocks: {
						where: gte(skuRestocks.date, new Date()),
						limit: 1
					}
				}
			});
			if (!fulfillment) throw new TRPCError({ code: 'NOT_FOUND' });

			return fulfillment;
		}),
	getByCategory: publicProcedure
		.input(
			z.object({
				categoryId: z
					.string()
					.nullish()
					.transform((categoryId) =>
						categoryId === 'all' ? undefined : categoryId
					),
				limit: z.number().min(1).max(100).nullish(),
				cursor: z.string().nullish() // <-- "cursor" needs to exist, but can be any type
			})
		)
		.query(async ({ ctx, input }) => {
			const limit = input.limit ?? 9;

			const _products = await ctx.db.query.products.findMany({
				where: and(
					input.categoryId
						? eq(products.categoryId, input.categoryId)
						: undefined,
					input.cursor ? gt(products.id, input.cursor) : undefined
				),
				limit: limit + 1, // get an extra item at the end which we'll use as next cursor,
				with: {
					skus: {
						orderBy: [asc(skus.price)],
						limit: 1,
						columns: { price: true, unit: true }
					}
				}
			});

			const productsWithStarterSku = _products.map(({ skus, ...product }) => ({
				...product,
				startingSku: skus[0] as StartingSku
			}));

			if (!_products) throw new TRPCError({ code: 'NOT_FOUND' });

			let nextCursor: typeof input.cursor | undefined = undefined;
			if (_products.length > limit) {
				const nextItem = productsWithStarterSku.pop();

				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				nextCursor = nextItem!.id;
			}

			return {
				products: productsWithStarterSku,
				nextCursor
			};
		}),
	getPavers: publicProcedure
		.input(
			z.object({
				dimension: z.enum(['1D', '2D'])
			})
		)
		.query(async ({ ctx, input }) => {
			const pavers = await ctx.db.query.products.findMany({
				where: and(
					eq(products.categoryId, 'concrete_pavers'),
					input.dimension === '1D' ? eq(products.canBorder, true) : undefined
				),
				columns: {
					id: true,
					displayName: true,
					defaultSkuId: true
				}
			});

			return pavers;
		}),
	getSkuById: publicProcedure
		.input(z.object({ skuId: z.string() }))
		.query(async ({ ctx, input }) => {
			const sku = await ctx.db.query.skus.findFirst({
				where: eq(skus.id, input.skuId),
				with: { details: true }
			});

			return sku;
		})
});
