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

const Stone1D = z.object({
	skuId: z.string(),
	displayName: z.string(),

	coverage: CoverageInput1D
});
export type Stone1D = z.infer<typeof Stone1D>;

const Stone2D = z.object({
	skuId: z.string(),
	displayName: z.string(),

	coverage: CoverageInput2D
});
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
	runningFoot: DimensionInput1D
});
export type Dimensions = z.infer<typeof Dimensions>;

export const Infill = Stone2D.array();

export const Border = z.object({
	runningFoot: DimensionInput1D,
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
