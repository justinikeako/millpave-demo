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
					stock: true,
					restock: true,
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
		})
});
