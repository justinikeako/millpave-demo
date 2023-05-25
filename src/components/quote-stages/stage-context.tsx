import React, { createContext, useCallback, useContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
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
	items: Item[];
	currentStageIndex: number;
	queuedStageIndex: number;
	setStageIndex(newStageIndex: number): void;
	queueStageIndex(newStageIndex: number): void;
	commitQueuedIndex(): void;
	setItems(newValues: Item[]): void;
};

export const StageContext = createContext<StageContextValue>(
	{} as StageContextValue
);

type StageProviderProps = React.PropsWithChildren<{
	maximumStageIndex: number;
}>;

export function StageProvider(props: StageProviderProps) {
	const formMethods = useForm<StoneProject>({
		defaultValues: {
			shape: '' as 'rect',

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
				runningLength: { value: 0, unit: 'auto' },
				orientation: 'SOLDIER_ROW',
				stones: []
			}
		}
	});

	const [items, setItems] = useState<Item[]>([]);
	const [currentStageIndex, setCurrentStageIndex] = useState(0);
	const [queuedStageIndex, queueStageIndex] = useState<number>(0);

	const commitQueuedIndex = useCallback(() => {
		if (queuedStageIndex >= 0 && queuedStageIndex <= props.maximumStageIndex)
			setCurrentStageIndex(queuedStageIndex);
	}, [queuedStageIndex, props.maximumStageIndex]);

	return (
		<StageContext.Provider
			value={{
				items,
				currentStageIndex,
				queuedStageIndex,
				setItems,
				setStageIndex: setCurrentStageIndex,
				queueStageIndex,
				commitQueuedIndex
			}}
		>
			<FormProvider {...formMethods}>{props.children}</FormProvider>
		</StageContext.Provider>
	);
}

export function useStageContext() {
	return useContext(StageContext);
}
