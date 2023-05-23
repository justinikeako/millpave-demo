import { z } from 'zod';

const Shape = z.enum(['rect', 'circle', 'arbitrary']);
export type Shape = z.infer<typeof Shape>;

const Unit1D = z.enum(['ft', 'in', 'm', 'cm']);
type Unit1D = z.infer<typeof Unit1D>;

const Unit2D = z.enum(['sqft', 'sqin', 'sqm', 'sqcm']);
type Unit2D = z.infer<typeof Unit2D>;

const CoverageUnit = z.enum(['fr', 'pal', 'unit']);

export const Unit = z.union([Unit1D, Unit2D, CoverageUnit]);
export type Unit = z.infer<typeof Unit>;

const DimensionInput1D = z.object({
	value: z.number(),
	unit: Unit1D
});
type DimensionInput1D = z.infer<typeof DimensionInput1D>;

const DimensionInput2D = z.object({
	value: z.number(),
	unit: Unit2D
});
type DimensionInput2D = z.infer<typeof DimensionInput2D>;

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
	displayName: z.string(),
	price: z.number(),
	details: z.object({
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

function createStoneSchema<Coverage extends z.ZodTypeAny>(coverage: Coverage) {
	return z.object({
		skuId: z.string(),
		metadata: StoneMetadata,

		coverage
	});
}

const Stone1D = createStoneSchema(CoverageInput1D);
const Stone2D = createStoneSchema(CoverageInput2D);
export type Stone1D = z.infer<typeof Stone1D>;
export type Stone2D = z.infer<typeof Stone2D>;

const Stone = z.union([Stone1D, Stone2D]);

export type Stone = z.infer<typeof Stone>;

export type Coverage = { value: number; unit: Unit };

const Dimensions = z.object({
	width: DimensionInput1D,
	length: DimensionInput1D,
	diameter: DimensionInput1D,
	circumference: DimensionInput1D,
	area: DimensionInput2D,
	runningLength: DimensionInput1D
});
export type Dimensions = z.infer<typeof Dimensions>;

export const Infill = Stone2D.array();
export type Infill = z.infer<typeof Infill>;

export const Border = z.object({
	runningLength: DimensionInput1D,
	orientation: z.enum(['SOLDIER_ROW', 'TIP_TO_TIP']),
	stones: Stone1D.array()
});
export type Border = z.infer<typeof Border>;

export const StoneProject = z.object({
	shape: Shape,

	dimensions: Dimensions,

	infill: Infill,

	border: Border
});

export type StoneProject = z.infer<typeof StoneProject>;
