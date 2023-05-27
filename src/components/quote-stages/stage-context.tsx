import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { StoneProject } from '@/types/quote';

type StageContextValue = {
	stagesValidity: boolean[];
	currentStageIndex: number;
	queuedStageIndex: number;
	setStageIndex(newStageIndex: number): void;
	queueStageIndex(newStageIndex: number): void;
	setStageValidity(stageIndex: number, stageValidity: boolean): void;
	commitQueuedIndex(): void;
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

	const [currentStageIndex, setCurrentStageIndex] = useState(0);
	const [queuedStageIndex, queueStageIndex] = useState(0);
	const [stagesValidity, setStagesValidity] = useState<boolean[]>([
		false,
		false,
		true,
		true,
		true
	]);

	function setStageValidity(stageIndex: number, stageValidity: boolean) {
		setStagesValidity((currentStagesValidity) => {
			const newStagesValidity = structuredClone(currentStagesValidity);

			newStagesValidity[stageIndex] = stageValidity;

			return newStagesValidity;
		});
	}

	useEffect(() => {
		// Handle form validity change
		setStageValidity(currentStageIndex, formMethods.formState.isValid);
	}, [currentStageIndex, formMethods.formState.isValid]);

	const commitQueuedIndex = useCallback(() => {
		if (queuedStageIndex >= 0 && queuedStageIndex <= props.maximumStageIndex)
			setCurrentStageIndex(queuedStageIndex);
	}, [queuedStageIndex, props.maximumStageIndex]);

	return (
		<StageContext.Provider
			value={{
				stagesValidity,
				currentStageIndex,
				queuedStageIndex,
				setStageIndex: setCurrentStageIndex,
				queueStageIndex,
				commitQueuedIndex,
				setStageValidity
			}}
		>
			<FormProvider {...formMethods}>{props.children}</FormProvider>
		</StageContext.Provider>
	);
}

export function useStageContext() {
	return useContext(StageContext);
}
