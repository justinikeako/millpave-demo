import { addDays } from 'date-fns';
import { createRouter } from './context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { generateQuote, generateQuoteItem } from '../quote/generate';
import { QuoteItem } from '@prisma/client';
import { roundPrice } from '../../utils/price';

type QuoteItemMetadata = {
	weight: number;
	area: number;
	originalArea: number;
};

type QuoteItemWithMetadata = QuoteItem & {
	metadata: QuoteItemMetadata;
};

type Shape = {
	id: string;
	name: string;
};

type RecommendedItem = {
	id: string;
	display_name: string;
	price: number;
};

const recommendations: RecommendedItem[] = [
	{
		id: 'eff_cleaner',
		display_name: 'DynaMatrix Efflorescence Cleaner',
		price: 4000
	}
];

export const quoteRouter = createRouter()
	.query('get', {
		input: z.object({
			id: z.string()
		}),
		async resolve({ ctx, input }) {
			const quote = await ctx.prisma.quote.findUnique({
				where: { id: input.id },
				include: {
					customer: true,
					items: {
						orderBy: {
							createdAt: 'asc'
						}
					}
				}
			});

			const shapes = quote?.shapes as Shape[] | null;
			const items = quote?.items.map((item) => {
				return {
					...item,
					closest_restock_date: addDays(new Date(), 2).getTime()
				};
			});

			if (!quote || !items) throw new TRPCError({ code: 'NOT_FOUND' });

			return {
				...quote,
				items,
				shapes,
				recommendations
			};
		}
	})
	.query('getAll', {
		async resolve({ ctx }) {
			const quotes = await ctx.prisma.quote.findMany({
				take: 20,

				select: {
					id: true,
					title: true,
					updatedAt: true,
					items: { orderBy: { updatedAt: 'desc' }, take: 5 }
				}
			});

			return quotes;
		}
	})
	.mutation('create', {
		input: z.object({
			skuId: z.string(),
			area: z.number(),
			pickupLocation: z.enum(['SHOWROOM', 'FACTORY'])
		}),
		async resolve({ ctx, input }) {
			const authorId = 'justin';

			const quote = generateQuote([input], authorId);

			const createdQuote = await ctx.prisma.quote.create({
				data: quote
			});

			return createdQuote.id;
		}
	})
	.mutation('addItemTo', {
		input: z.object({
			id: z.string(),
			item: z.object({
				skuId: z.string(),
				area: z.number(),
				pickupLocation: z.enum(['SHOWROOM', 'FACTORY'])
			})
		}),
		async resolve({ ctx, input }) {
			// Create new quote item

			const generatedItem = generateQuoteItem(input.item);
			const oldItem = (await ctx.prisma.quoteItem.findUnique({
				where: {
					itemIdentifier: {
						skuId: input.item.skuId,
						quoteId: input.id,
						pickupLocation: input.item.pickupLocation
					}
				}
			})) as QuoteItemWithMetadata;

			if (oldItem) {
				await ctx.prisma.quoteItem.update({
					where: {
						itemIdentifier: {
							quoteId: input.id,
							skuId: generatedItem.skuId,
							pickupLocation: input.item.pickupLocation
						}
					},
					data: {
						metadata: {
							area: oldItem.metadata.area + generatedItem.metadata.area,
							weight: oldItem.metadata.weight + generatedItem.metadata.weight,
							originalArea:
								oldItem.metadata.originalArea +
								generatedItem.metadata.originalArea
						} as QuoteItemMetadata,
						price: oldItem.price + generatedItem.price,
						quantity: oldItem.quantity + generatedItem.quantity
					}
				});
			} else {
				await ctx.prisma.quoteItem.create({
					data: {
						quoteId: input.id,
						...generatedItem
					}
				});
			}

			// update quote with new details
			const updatedQuote = await ctx.prisma.quote.update({
				where: { id: input.id },
				data: {
					weight: { increment: generatedItem.metadata.weight },
					area: { increment: generatedItem.metadata.area },
					subtotal: { increment: roundPrice(generatedItem.price) },
					tax: { increment: roundPrice(generatedItem.price * 0.15) },
					total: { increment: roundPrice(generatedItem.price * 1.15) }
				}
			});

			return updatedQuote.id;
		}
	})
	.mutation('rename', {
		input: z.object({
			quoteId: z.string(),
			newTitle: z.string({})
		}),
		async resolve({ ctx, input }) {
			await ctx.prisma.quote.update({
				where: { id: input.quoteId },
				data: { title: input.newTitle }
			});

			return true;
		}
	})
	.mutation('removeItem', {
		input: z.object({
			itemId: z.string()
		}),
		async resolve({ ctx, input }) {
			const deletedItem = (await ctx.prisma.quoteItem.delete({
				where: { id: input.itemId }
			})) as QuoteItemWithMetadata;

			console.log(deletedItem);
			await ctx.prisma.quote.update({
				where: { id: deletedItem.quoteId },
				data: {
					weight: { increment: deletedItem.metadata.weight },
					area: { increment: deletedItem.metadata.area },
					subtotal: { increment: roundPrice(deletedItem.price) },
					tax: { increment: roundPrice(deletedItem.price * 0.15) },
					total: { increment: roundPrice(deletedItem.price * 1.15) }
				}
			});

			return true;
		}
	})
	.mutation('delete', {
		input: z.object({
			id: z.string()
		}),
		async resolve({ ctx, input }) {
			const deletedQuote = await ctx.prisma.quote.delete({
				where: { id: input.id },
				include: { items: true }
			});

			return deletedQuote.id;
		}
	});
