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

export const pickupLocationEnum = z.enum(['SHOWROOM', 'FACTORY']);

export const quoteInputItem = z.object({
	skuId: z.string(),
	pickupLocation: pickupLocationEnum,
	quantity: z.number()
});
