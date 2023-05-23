import React, { createContext, useCallback, useContext, useState } from 'react';
import { StoneProject, Unit } from '@/types/quote';

type Item = {
	displayName: string;
	quantity: number;
	unit: Unit;
	price: number;
	hasPlan: boolean;
	priceWithPlan?: number;
};

type StageContextValue = {
	values: StoneProject;
	items: Item[];
	currentStageIndex: number;
	queuedStageIndex: number;
	queueStageIndex(newStageIndex: number): void;
	commitQueuedIndex(): void;
	setValues(newValues: StoneProject): void;
	setItems(newValues: Item[]): void;
};

export const StageContext = createContext<StageContextValue>(
	{} as StageContextValue
);

type StageProviderProps = React.PropsWithChildren<{
	maximumStageIndex: number;
}>;

export function StageProvider(props: StageProviderProps) {
	const [values, setValues] = useState<StoneProject>({
		shape: 'rect',

		dimensions: {
			width: { value: 0, unit: 'ft' },
			length: { value: 0, unit: 'ft' },
			diameter: { value: 0, unit: 'ft' },
			circumference: { value: 0, unit: 'ft' },
			area: { value: 0, unit: 'sqft' },
			runningLength: { value: 0, unit: 'ft' }
		},
		infill: [],
		border: {
			runningLength: { value: 0, unit: 'ft' },
			orientation: 'SOLDIER_ROW',
			stones: []
		}
	});
	const [items, setItems] = useState<Item[]>([]);
	const [currentStageIndex, setCurrentStageIndex] = useState(0);
	const [queueIndex, setQueueIndex] = useState<number>(0);

	const commitQueuedIndex = useCallback(() => {
		if (queueIndex >= 0 && queueIndex <= props.maximumStageIndex)
			setCurrentStageIndex(queueIndex);
	}, [queueIndex, props.maximumStageIndex]);

	return (
		<StageContext.Provider
			value={{
				values,
				items,
				currentStageIndex,
				queuedStageIndex: queueIndex,
				setValues,
				setItems,
				commitQueuedIndex,
				queueStageIndex: setQueueIndex
			}}
		>
			{props.children}
		</StageContext.Provider>
	);
}

export function useStageContext() {
	return useContext(StageContext);
}
