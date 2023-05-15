import React, { createContext, useContext, useState } from 'react';

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

export type FormValues = {
	shape: Shape;
	dimensions: Dimensions;
	infill: Stone[];
	border: {
		runningFoot: { value: number; unit: Unit2D };
		orientation: 'SOLDIER_ROW' | 'TIP_TO_TIP';
		stones: Stone[];
	};
};

type StageContextValue = {
	values: FormValues;
	currentStageIndex: number;
	setCurrentStageIndex(newStageIndex: number): void;
	incrementCurrentStageIndex(): void;
	decrementCurrentStageIndex(): void;
	setValues: React.Dispatch<React.SetStateAction<FormValues>>;
};

export const StageContext = createContext<StageContextValue>(
	{} as StageContextValue
);

type StageProviderProps = React.PropsWithChildren<{
	maximumStageIndex: number;
}>;

export function StageProvider(props: StageProviderProps) {
	const [values, setValues] = useState<FormValues>({
		shape: 'rect',

		dimensions: {
			width: { value: 0, unit: 'ft' },
			length: { value: 0, unit: 'ft' },
			diameter: { value: 0, unit: 'ft' },
			circumference: { value: 0, unit: 'ft' },
			area: { value: 0, unit: 'sqft' },
			runningFoot: { value: 0, unit: 'ft' }
		},
		infill: [],
		border: {
			runningFoot: { value: 0, unit: 'ft' },
			orientation: 'SOLDIER_ROW',
			stones: []
		}
	});
	const [currentStageIndex, _setCurrentStageIndex] = useState(0);

	function incrementCurrentStageIndex() {
		if (currentStageIndex < props.maximumStageIndex)
			_setCurrentStageIndex((stage) => stage + 1);
	}
	function decrementCurrentStageIndex() {
		if (currentStageIndex > 0) _setCurrentStageIndex((stage) => stage - 1);
	}

	function setCurrentStageIndex(newStageIndex: number) {
		if (newStageIndex >= 0 && newStageIndex <= props.maximumStageIndex)
			_setCurrentStageIndex(newStageIndex);
	}

	return (
		<StageContext.Provider
			value={{
				values,
				currentStageIndex,
				setValues,
				incrementCurrentStageIndex,
				decrementCurrentStageIndex,
				setCurrentStageIndex
			}}
		>
			{props.children}
		</StageContext.Provider>
	);
}

export function useStageContext() {
	return useContext(StageContext);
}
