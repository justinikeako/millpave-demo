import { z } from 'zod';

const Shape = z.enum(['rect', 'circle', 'other']);
export type Shape = z.infer<typeof Shape>;

const Unit1D = z.enum(['ft', 'in', 'm', 'cm']);
export type Unit1D = z.infer<typeof Unit1D>;

const Unit2D = z.enum(['sqft', 'sqin', 'sqm', 'sqcm']);
export type Unit2D = z.infer<typeof Unit2D>;

const CoverageUnit = z.enum(['fr', 'pal', 'unit', 'pcs']);

export const Unit = z.union([Unit1D, Unit2D, CoverageUnit]);
export type Unit = z.infer<typeof Unit>;

const CoverageInput1D = z.object({
	value: z.number(),
	unit: z.union([Unit1D, CoverageUnit])
});
type CoverageInput1D = z.infer<typeof CoverageInput1D>;

const CoverageInput2D = z.object({
	value: z.number(),
	unit: z.union([Unit2D, CoverageUnit])
});
type CoverageInput2D = z.infer<typeof CoverageInput1D>;

const StoneMetadata = z.object({
	skuId: z.string(),
	displayName: z.string(),
	price: z.number(),
	details: z.object({
		type: z.enum(['paver']),
		sqft_per_pallet: z.number(),
		pcs_per_sqft: z.number(),
		pcs_per_pallet: z.number(),
		lbs_per_unit: z.number(),
		conversion_factors: z
			.object({
				TIP_TO_TIP: z.number(),
				SOLDIER_ROW: z.number()
			})
			.optional()
	})
});
export type StoneMetadata = z.infer<typeof StoneMetadata>;

const Pattern1D = z.object({
	type: z.literal('pattern'),
	id: z.string(),
	displayName: z.string(),
	coverage: CoverageInput1D,
	contents: z
		.object({
			skuId: z.string(),
			quantity: z.number()
		})
		.array()
});
const Pattern2D = z.object({
	type: z.literal('pattern'),
	id: z.string(),
	displayName: z.string(),
	coverage: CoverageInput2D,
	contents: z
		.object({
			skuId: z.string(),
			quantity: z.number()
		})
		.array()
});
export type Pattern1D = z.infer<typeof Pattern1D>;
export type Pattern2D = z.infer<typeof Pattern2D>;

const Pattern = z.union([Pattern1D, Pattern2D]);
export type Pattern = z.infer<typeof Pattern>;

export type Coverage = { value: number; unit: Unit };

const measurementsSchema = z.object({
	width: z.number(),
	length: z.number(),
	radius: z.number(),
	area: z.number(),
	runningLength: z.number(),
	unit: Unit1D
});

export type Measurements = z.infer<typeof measurementsSchema>;

export const infillConfigSchema = z.object({
	contents: Pattern2D.array()
});
export type InfillConfig = z.infer<typeof infillConfigSchema>;

const BorderLength = z.object({
	value: z.number(),
	unit: z.enum(['auto', 'inherit'])
});

const BorderOrientation = z.enum(['SOLDIER_ROW', 'TIP_TO_TIP']);
export type BorderOrientation = z.infer<typeof BorderOrientation>;

export const BorderConfig = z.object({
	runningLength: BorderLength,
	orientation: BorderOrientation,
	contents: Pattern1D.array()
});
export type BorderConfig = z.infer<typeof BorderConfig>;

export const stoneProjectSchema = z.object({
	email: z.string(),

	shape: Shape,

	measurements: measurementsSchema,

	infill: infillConfigSchema,

	border: BorderConfig,

	addons: z
		.object({
			id: z.string(),
			displayName: z.string(),
			description: z.string(),
			enabled: z.boolean()
		})
		.array()
});

export type StoneProject = z.infer<typeof stoneProjectSchema>;

export const QuoteItem = z.object({
	skuId: z.string(),
	pickupLocationId: z.string(),
	displayName: z.string(),
	cost: z.number(),
	quantity: z.number(),
	area: z.number().nullable().optional(),
	weight: z.number(),
	unit: z.enum(['pal', 'pcs', 'unit']),
	signatures: z.string().array()
});

export type QuoteItem = z.infer<typeof QuoteItem>;

export type Quote = {
	id: string | undefined;
	items: QuoteItem[];
	details: {
		totalArea: number;
		totalWeight: number;
		subtotal: number;
		tax: number;
		total: number;
	};
};
