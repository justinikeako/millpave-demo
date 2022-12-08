import { addDays } from 'date-fns';
import { router, publicProcedure } from '../trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { generateQuote, generateQuoteItem } from '../../quote/generate';
import { QuoteItem } from '@prisma/client';
import { roundPrice } from '../../../utils/price';
import { QuoteItemMetadata } from '../../../types/quote';
import { quoteInputItem } from '../../../validators/quote';
import { PaverSkuWithDetails } from '../../../types/product';

type QuoteItemWithMetadata = QuoteItem & {
	metadata: QuoteItemMetadata;
};

type RecommendedItem = {
	id: string;
	displayName: string;
	price: number;
};

const recommendations: RecommendedItem[] = [
	{
		id: 'eff_cleaner',
		displayName: 'DynaMatrix Efflorescence Cleaner',
		price: 4000
	}
];

export const quoteRouter = router({
	getById: publicProcedure
		.input(
			z.object({
				quoteId: z.string()
			})
		)
		.query(async ({ ctx, input }) => {
			const quote = await ctx.prisma.quote.findUnique({
				where: { id: input.quoteId },
				include: {
					items: {
						orderBy: { createdAt: 'asc' },
						include: {
							sku: {
								select: {
									displayName: true,
									restockQueue: {
										take: 1,
										where: { fulfilled: false },
										orderBy: { date: 'desc' }
									}
								}
							},
							pickupLocation: true
						}
					}
				}
			});

			// const shapes = quote?.shapes as Shape[] | null;
			const items = quote?.items.map((item) => {
				return {
					...item,
					closest_restock_date:
						item.sku.restockQueue[0]?.date || addDays(new Date(), 21)
				};
			});

			if (!quote || !items) throw new TRPCError({ code: 'NOT_FOUND' });

			return {
				...quote,
				items,
				recommendations
			};
		}),
	getMany: publicProcedure.query(async ({ ctx }) => {
		const quotes = await ctx.prisma.quote.findMany({
			take: 20,

			select: {
				id: true,
				title: true,
				updatedAt: true,
				items: {
					distinct: ['skuId', 'pickupLocationId'],
					orderBy: { updatedAt: 'asc' },
					take: 5,
					select: {
						sku: { select: { displayName: true } }
					}
				}
			},
			orderBy: { updatedAt: 'desc' }
		});

		return quotes;
	}),

	rename: publicProcedure
		.input(
			z.object({
				quoteId: z.string(),
				newTitle: z.string({})
			})
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.prisma.quote.update({
				where: { id: input.quoteId },
				data: { title: input.newTitle }
			});

			return true;
		}),

	create: publicProcedure
		.input(quoteInputItem)
		.mutation(async ({ ctx, input }) => {
			const sku = await ctx.prisma.sku.findUnique({
				where: { id: input.skuId },
				include: { details: true }
			});

			const quote = generateQuote(input, sku as PaverSkuWithDetails);

			const createdQuote = await ctx.prisma.quote.create({
				data: quote
			});

			return createdQuote.id;
		}),

	addItem: publicProcedure
		.input(
			z.object({
				quoteId: z.string(),
				item: quoteInputItem
			})
		)
		.mutation(async ({ ctx, input }) => {
			const sku = await ctx.prisma.sku.findUnique({
				where: { id: input.item.skuId },
				include: { details: true }
			});

			const generatedItem = generateQuoteItem(
				input.item,
				sku as PaverSkuWithDetails
			);

			await ctx.prisma.quoteItem.upsert({
				where: {
					id: {
						quoteId: input.quoteId,
						skuId: input.item.skuId,
						pickupLocationId: input.item.pickupLocationId
					}
				},
				create: {
					quoteId: input.quoteId,
					...generatedItem
				},
				update: {
					price: { increment: generatedItem.price },
					quantity: { increment: generatedItem.quantity }
				}
			});

			const priceAggregate = await ctx.prisma.quoteItem.aggregate({
				_sum: { price: true },

				where: { quoteId: input.quoteId }
			});

			const subtotal = roundPrice(priceAggregate._sum.price || 0);
			const tax = roundPrice(subtotal * 0.15);
			const total = roundPrice(subtotal + tax);

			const updatedQuote = await ctx.prisma.quote.update({
				where: {
					id: input.quoteId
				},
				data: {
					subtotal,
					tax,
					total
				}
			});

			return updatedQuote.id;
		}),

	removeItem: publicProcedure
		.input(
			z.object({
				quoteId: z.string(),
				skuId: z.string(),
				pickupLocationId: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const deletedItem = (await ctx.prisma.quoteItem.delete({
				where: { id: input }
			})) as QuoteItemWithMetadata;

			const priceAggregate = await ctx.prisma.quoteItem.aggregate({
				_sum: { price: true },
				where: { quoteId: input.quoteId }
			});

			const subtotal = roundPrice(priceAggregate._sum.price || 0);
			const tax = roundPrice(subtotal * 0.15);
			const total = roundPrice(subtotal + tax);

			await ctx.prisma.quote.update({
				where: { id: deletedItem.quoteId },
				data: {
					subtotal,
					tax,
					total
				}
			});

			return true;
		}),

	delete: publicProcedure
		.input(
			z.object({
				quoteId: z.string()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const deletedQuote = await ctx.prisma.quote.delete({
				where: { id: input.quoteId },
				include: { items: true }
			});

			return deletedQuote.id;
		})
});
