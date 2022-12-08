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
	pickupLocationId: z.string(),
	quantity: z.number()
});
