import React, { createContext, useCallback, useContext, useState } from 'react';
import { StoneProject } from '@/types/quote';

type StageContextValue = {
	values: StoneProject;
	currentStageIndex: number;
	queuedStageIndex: number;
	queueStageIndex(newStageIndex: number): void;
	commitQueuedIndex(): void;
	setValues: React.Dispatch<React.SetStateAction<StoneProject>>;
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
			runningFoot: { value: 0, unit: 'ft' }
		},
		infill: [],
		border: {
			runningFoot: { value: 0, unit: 'ft' },
			orientation: 'SOLDIER_ROW',
			stones: []
		}
	});
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
				currentStageIndex,
				queuedStageIndex: queueIndex,
				setValues,
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
