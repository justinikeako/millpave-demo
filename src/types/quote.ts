type Unit2D = 'ft' | 'in' | 'm' | 'cm';
type Unit3D = 'sqft' | 'sqin' | 'sqm' | 'sqcm';
export type CoverageUnit = Unit3D | Unit2D | 'fr' | 'unit';

export type Coverage = { value: number; unit: CoverageUnit };

export type Stone = {
	skuId: string;
	displayName: string;

	coverage: Coverage;
};

export type Shape = 'rect' | 'circle' | 'arbitrary';

export type Dimensions = {
	width: { value: number; unit: Unit2D };
	length: { value: number; unit: Unit2D };
	diameter: { value: number; unit: Unit2D };
	circumference: { value: number; unit: Unit2D };
	area: { value: number; unit: Unit3D };
	runningFoot: { value: number; unit: Unit2D };
};

export type StoneProject = {
	shape: Shape;
	dimensions: Dimensions;
	infill: Stone[];
	border: {
		runningFoot: { value: number; unit: Unit2D };
		orientation: 'SOLDIER_ROW' | 'TIP_TO_TIP';
		stones: Stone[];
	};
};
