type Unit1D = 'ft' | 'in' | 'm' | 'cm';
type Unit2D = 'sqft' | 'sqin' | 'sqm' | 'sqcm';
export type Unit = Unit1D | Unit2D | 'fr' | 'pal' | 'unit';

export type Coverage = { value: number; unit: Unit };

export type Stone = {
	skuId: string;
	displayName: string;

	coverage: Coverage;
};

export type Shape = 'rect' | 'circle' | 'arbitrary';

export type Dimensions = {
	width: { value: number; unit: Unit1D };
	length: { value: number; unit: Unit1D };
	diameter: { value: number; unit: Unit1D };
	circumference: { value: number; unit: Unit1D };
	area: { value: number; unit: Unit2D };
	runningFoot: { value: number; unit: Unit1D };
};

export type StoneProject = {
	shape: Shape;
	dimensions: Dimensions;
	infill: Stone[];
	border: {
		runningFoot: { value: number; unit: Unit1D };
		orientation: 'SOLDIER_ROW' | 'TIP_TO_TIP';
		stones: Stone[];
	};
};
