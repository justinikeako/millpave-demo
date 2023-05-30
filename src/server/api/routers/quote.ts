import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { inArray, gte } from 'drizzle-orm';
import { skus, skuRestocks } from '@/db/schema';

export const quoteRouter = createTRPCRouter({
	getFulfillment: publicProcedure
		.input(
			z.object({
				skuIds: z.string().array()
			})
		)
		.query(async ({ ctx, input }) => {
			const fulfillment = await ctx.db.query.skus.findMany({
				where: inArray(skus.id, input.skuIds),
				columns: { id: true },
				with: {
					stock: {
						columns: { quantity: true, locationId: true },
						with: { location: true }
					},
					restocks: {
						where: gte(skuRestocks.date, new Date()),
						columns: { quantity: true, locationId: true, date: true },
						with: { location: true },
						limit: 1
					}
				}
			});

			return fulfillment;
		})
});
