import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { inArray, gte, eq } from 'drizzle-orm';
import { quotes, skus, skuRestocks, quoteItems } from '~/server/db/schema';
import { QuoteItem } from '~/types/quote';
import { getQuoteDetails } from '~/lib/utils';

export const quoteRouter = createTRPCRouter({
	getById: publicProcedure
		.input(z.object({ quoteId: z.string() }))
		.query(async ({ ctx, input }) => {
			const quote = await ctx.db.query.quotes.findFirst({
				where: (quotes, { eq }) => eq(quotes.id, parseInt(input.quoteId)),
				with: {
					items: {
						with: { sku: true }
					}
				}
			});

			return quote;
		}),
	deleteById: publicProcedure
		.input(z.object({ quoteId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const quote = await ctx.db
				.delete(quotes)
				.where(eq(quotes.id, parseInt(input.quoteId)));

			return { quoteId: quote.insertId, success: true };
		}),
	addItems: publicProcedure
		.input(
			z.object({ quoteId: z.number().optional(), items: QuoteItem.array() })
		)
		.mutation(async ({ ctx, input }) => {
			if (input.quoteId) {
				await ctx.db.insert(quoteItems).values(
					input.items.map((item) => ({
						...item,
						quoteId: 0
					}))
				);

				const allItems = await ctx.db
					.select()
					.from(quoteItems)
					.where(eq(quoteItems.quoteId, input.quoteId));

				const details = getQuoteDetails(allItems);
				const quote = await ctx.db
					.update(quotes)
					.set(details)
					.where(eq(quotes.id, input.quoteId));

				return { quoteId: quote.insertId };
			} else {
				const details = getQuoteDetails(input.items);

				const quote = await ctx.db.insert(quotes).values(details);

				await ctx.db.insert(quoteItems).values(
					input.items.map((item) => ({
						quoteId: parseInt(quote.insertId),
						...item
					}))
				);

				return { quoteId: quote.insertId };
			}
		}),
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
