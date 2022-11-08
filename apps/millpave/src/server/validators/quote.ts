import z from 'zod';

export const unitEnum = z.enum([
	'sqft',
	'sqin',
	'sqm',
	'sqcm',
	'pcs',
	'pal',
	'jmd'
]);

export const quoteInputItem = z.object({
	skuId: z.string(),
	pickupLocation: z.enum(['SHOWROOM', 'FACTORY']),
	quantity: z.number(),

	area: z.number(),
	input: z.object({
		value: z.string(),
		unit: unitEnum
	})
});
