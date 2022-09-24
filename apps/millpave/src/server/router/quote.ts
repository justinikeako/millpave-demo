import { addDays } from 'date-fns';
import { createRouter } from './context';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { generateQuote, generateQuoteItem } from '../quote/generate';
import { QuoteItem } from '@prisma/client';

type Shape = {
	id: string;
	name: string;
};

type RecommendedItem = {
	id: string;
	display_name: string;
	price: number;
};

type QuoteItemMetadata = {
	weight: number;
	area: number;
	originalArea: number;
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
					items: true
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
				take: 20
			});

			return quotes;
		}
	})
	.mutation('create', {
		input: z.object({
			skuId: z.string(),
			area: z.number(),
			pickupLocation: z.enum(['showroom', 'factory'])
		}),
		async resolve({ ctx, input }) {
			const authorId = 'justin';

			const quote = generateQuote([input], authorId);

			const createdQuote = await ctx.prisma.quote.create({
				data: quote
			});

			return createdQuote;
		}
	})
	.mutation('addItemTo', {
		input: z.object({
			id: z.string(),
			item: z.object({
				skuId: z.string(),
				area: z.number(),
				pickupLocation: z.enum(['showroom', 'factory'])
			})
		}),
		async resolve({ ctx, input }) {
			// Create new quote item
			const newItem = (await ctx.prisma.quoteItem.create({
				data: {
					quoteId: input.id,
					...generateQuoteItem(input.item)
				}
			})) as QuoteItem & { metadata: QuoteItemMetadata };

			// update quote with new details
			const newQuote = await ctx.prisma.quote.update({
				where: { id: input.id },
				data: {
					weight: { increment: newItem.metadata.weight },
					area: { increment: newItem.metadata.area },
					subtotal: { increment: newItem.price },
					tax: { increment: newItem.price * 0.15 },
					total: { increment: newItem.price * 1.15 }
				}
			});

			return newQuote.id;
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
