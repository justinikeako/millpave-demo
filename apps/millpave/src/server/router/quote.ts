import { addDays } from 'date-fns';
import { createRouter } from './context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { generateQuote, generateQuoteItem } from '../quote/generate';
import { QuoteItem } from '@prisma/client';
import { roundPrice } from '../../utils/price';
import { QuoteItemMetadata } from '../../types/quote';
import {
	pickupLocationEnum,
	quoteInputItem,
	unitEnum
} from '../../validators/quote';

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

export const quoteRouter = createRouter()
	.query('get', {
		input: z.object({
			id: z.string()
		}),
		async resolve({ ctx, input }) {
			const quote = await ctx.prisma.quote.findUnique({
				where: { id: input.id },
				include: {
					items: {
						orderBy: { createdAt: 'asc' }
					}
				}
			});

			// const shapes = quote?.shapes as Shape[] | null;
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
					items: {
						orderBy: { updatedAt: 'asc' },
						take: 5
					}
				},
				orderBy: { updatedAt: 'desc' }
			});

			return quotes;
		}
	})
	.mutation('create', {
		input: z.object({
			skuId: z.string(),
			pickupLocation: z.enum(['SHOWROOM', 'FACTORY']),
			quantity: z.number(),

			area: z.number(),
			input: z.object({
				value: z.string(),
				unit: unitEnum
			})
		}),
		async resolve({ ctx, input }) {
			const quote = generateQuote([input]);

			const createdQuote = await ctx.prisma.quote.create({
				data: quote
			});

			return createdQuote.id;
		}
	})
	.mutation('addItemToQuote', {
		input: z.object({
			id: z.string(),
			item: quoteInputItem
		}),
		async resolve({ ctx, input }) {
			// Create new quote item

			const generatedItem = generateQuoteItem(input.item);
			const oldItem = (await ctx.prisma.quoteItem.findUnique({
				where: {
					id: {
						quoteId: input.id,
						skuId: input.item.skuId,
						pickupLocation: input.item.pickupLocation
					}
				}
			})) as QuoteItemWithMetadata;

			if (oldItem) {
				await ctx.prisma.quoteItem.update({
					where: {
						id: {
							quoteId: input.id,
							skuId: input.item.skuId,
							pickupLocation: input.item.pickupLocation
						}
					},
					data: {
						metadata: {
							area: oldItem.metadata.area + generatedItem.metadata.area,
							weight: oldItem.metadata.weight + generatedItem.metadata.weight,
							unit: generatedItem.metadata.unit,
							value: generatedItem.metadata.value
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
			quoteId: z.string(),
			skuId: z.string(),
			pickupLocation: pickupLocationEnum
		}),
		async resolve({ ctx, input }) {
			const deletedItem = (await ctx.prisma.quoteItem.delete({
				where: { id: input }
			})) as QuoteItemWithMetadata;

			console.log(deletedItem);
			await ctx.prisma.quote.update({
				where: { id: deletedItem.quoteId },
				data: {
					weight: { decrement: deletedItem.metadata.weight },
					area: { decrement: deletedItem.metadata.area },
					subtotal: { decrement: roundPrice(deletedItem.price) },
					tax: { decrement: roundPrice(deletedItem.price * 0.15) },
					total: { decrement: roundPrice(deletedItem.price * 1.15) }
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
