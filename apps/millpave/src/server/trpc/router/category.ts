import { publicProcedure, router } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const categoryRouter = router({
	getById: publicProcedure
		.input(z.object({ categoryId: z.string() }))
		.query(async ({ ctx, input }) => {
			const category = await ctx.prisma.category.findUnique({
				where: { id: input.categoryId },
				include: {
					products: {
						select: {
							id: true,
							defaultSkuId: true,
							displayName: true,
							skus: {
								orderBy: { price: 'asc' },
								take: 1,
								select: { price: true }
							}
						}
					}
				}
			});

			if (!category) throw new TRPCError({ code: 'NOT_FOUND' });

			const products = category.products.map((product) => {
				return {
					...product,
					startingPrice: product.skus[0]?.price || 0
				};
			});

			return {
				...category,
				products
			};
		})
});
