import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { FullPaver } from '../../../types/product';

export const productRouter = router({
	getById: publicProcedure
		.input(
			z.object({
				productId: z.string()
			})
		)
		.query(async ({ ctx, input }) => {
			const product = await ctx.prisma.product.findUnique({
				where: { id: input.productId },
				include: {
					category: true,
					details: true,
					skus: true,
					similar: {
						orderBy: { relevance: 'desc' },
						include: {
							similar: {
								select: {
									id: true,
									displayName: true,
									defaultSkuId: true,
									skus: {
										orderBy: { price: 'asc' },
										take: 1,
										select: { price: true, unit: true }
									}
								}
							}
						}
					}
				}
			});

			if (!product) throw new TRPCError({ code: 'NOT_FOUND' });

			const similarProducts = product.similar.map(({ similar }) => {
				const { skus, ...product } = similar;

				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				return { ...product, startingSku: skus[0]! };
			});

			return {
				...product,
				similar: similarProducts
			} as FullPaver;
		}),
	getFulfillmentData: publicProcedure
		.input(z.object({ productId: z.string() }))
		.query(async ({ ctx, input }) => {
			const fulfillment = await ctx.prisma.product.findUnique({
				where: { id: input.productId },
				select: {
					stock: true,
					restock: {
						where: {
							date: { gte: new Date() }
						}
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

			const products = await ctx.prisma.product.findMany({
				where: { categoryId: input.categoryId ? input.categoryId : undefined },
				take: limit + 1, // get an extra item at the end which we'll use as next cursor,
				cursor: input.cursor ? { id: input.cursor } : undefined,
				include: {
					skus: {
						orderBy: { price: 'asc' },
						take: 1,
						select: { price: true, unit: true }
					}
				}
			});

			const productsWithStarterSku = products.map(({ skus, ...product }) => ({
				...product,
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				startingSku: skus[0]!
			}));

			if (!products) throw new TRPCError({ code: 'NOT_FOUND' });

			let nextCursor: typeof input.cursor | undefined = undefined;
			if (products.length > limit) {
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
			const pavers = ctx.prisma.product.findMany({
				where: {
					categoryId: 'concrete_pavers',
					borderable: input.dimension === '1D' || undefined
				},
				select: {
					id: true,
					displayName: true,
					defaultSkuId: true
				}
			});

			return pavers;
		})
});
