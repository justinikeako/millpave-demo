import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
	Border,
	Dimensions,
	Infill,
	Quote,
	QuoteItem,
	Shape,
	Stone1D,
	Stone2D,
	StoneProject,
	Unit
} from '@/types/quote';
import { roundTo } from '@/utils/number';
import { round } from 'mathjs';
import { PaverDetails } from '@/types/product';
import { isEqual } from 'lodash-es';

function toFt(
	value: number,
	unit: Exclude<Unit, 'fr' | 'pal' | 'pcs' | 'unit'>
) {
	switch (unit) {
		case 'ft':
			return value;
		case 'in':
			return value / 12;
		case 'm':
			return value * 3.281;
		case 'cm':
			return value * 30.48;
		case 'sqft':
			return value;
		case 'sqin':
			return value / 12;
		case 'sqm':
			return value * 3.281;
		case 'sqcm':
			return value * 30.48;
	}
}

const toSqft = toFt;

function calculateProjectArea(shape: Shape, dimensions: Dimensions) {
	const length = toFt(dimensions.length.value, dimensions.length.unit);
	const width = toFt(dimensions.width.value, dimensions.width.unit);
	const circumference = toFt(
		dimensions.circumference.value,
		dimensions.circumference.unit
	);
	const diameter = toFt(dimensions.diameter.value, dimensions.diameter.unit);
	const area = toFt(dimensions.area.value, dimensions.area.unit);

	switch (shape) {
		case 'rect':
			return length * width;
		case 'circle':
			return circumference
				? Math.pow(circumference, 2) / (4 * Math.PI)
				: Math.PI * Math.pow(diameter / 2, 2);
		case 'arbitrary':
			return area;
	}
}

type Item = {
	skuId: string;
	displayName: string;
	sqftCoverage: number;
	sqftPrice: number;
	details: PaverDetails;
	signatures: string[];
};

function getInfill(area: number, infill: Infill) {
	let infillArea = Math.max(0, area);

	const stones: Item[] = [];

	// Cut out fixed values first; divy up ratio values afterwards
	const fractionalStones: Stone2D[] = [];
	let fractionalTotal = 0;
	const fixedStones: Stone2D[] = [];

	for (const stone of infill) {
		if (stone.coverage.unit === 'fr') {
			fractionalTotal += stone.coverage.value;
			fractionalStones.push(stone);
		} else fixedStones.push(stone);
	}

	for (const stone of fixedStones) {
		const unit = stone.coverage.unit as Exclude<Unit, 'fr' | 'pal' | 'pcs'>;

		const fixedSegmentArea =
			unit === 'unit'
				? stone.coverage.value / stone.metadata.details.pcs_per_sqft
				: toSqft(stone.coverage.value, unit);

		infillArea -= fixedSegmentArea;

		stones.push({
			skuId: stone.skuId,
			displayName: stone.metadata.displayName,
			sqftCoverage: fixedSegmentArea,
			sqftPrice: stone.metadata.price,
			details: stone.metadata.details,
			signatures: ['infill']
		});
	}

	infillArea = Math.max(infillArea, 0);

	for (const stone of fractionalStones) {
		if (infillArea <= 0) break;

		const fractionalSegmentArea =
			infillArea * (stone.coverage.value / fractionalTotal);

		stones.push({
			skuId: stone.skuId,
			displayName: stone.metadata.displayName,
			sqftCoverage: fractionalSegmentArea,
			sqftPrice: stone.metadata.price,
			details: stone.metadata.details,
			signatures: ['infill']
		});
	}

	return { area: Math.max(0, area), items: stones };
}

function getBorder(border: Border) {
	let borderArea = 0;
	let runningFoot = toFt(
		border.runningLength.value,
		border.runningLength.unit === 'auto' ? 'ft' : border.runningLength.unit
	);
	const orientation = border.orientation;

	const stones: Item[] = [];
	// Cut out fixed values first; divy up ratio values afterwards
	const fractionalStones: Stone1D[] = [];
	let fractionalTotal = 0;
	const fixedStones: Stone1D[] = [];

	for (const stone of border.stones) {
		if (stone.coverage.unit === 'fr') {
			fractionalTotal += stone.coverage.value;
			fractionalStones.push(stone);
		} else fixedStones.push(stone);
	}

	for (const stone of fixedStones) {
		const conversionFactorDictionary =
			stone.metadata.details.conversion_factors;
		if (!conversionFactorDictionary)
			throw new Error(`Stone ${stone.skuId} can not be used as a border`);

		const inverseConversionFactor =
			conversionFactorDictionary[
				orientation === 'SOLDIER_ROW' ? 'TIP_TO_TIP' : 'SOLDIER_ROW'
			];

		const unit = stone.coverage.unit as Exclude<Unit, 'fr' | 'pal' | 'pcs'>;

		const fixedSegmentLength =
			unit === 'unit'
				? stone.coverage.value * inverseConversionFactor
				: toFt(stone.coverage.value, unit);

		runningFoot -= fixedSegmentLength;

		const fixedSegmentArea =
			fixedSegmentLength * conversionFactorDictionary[orientation];

		borderArea += fixedSegmentArea;

		stones.push({
			skuId: stone.skuId,
			displayName: stone.metadata.displayName,
			sqftCoverage: fixedSegmentArea,
			sqftPrice: stone.metadata.price,
			details: stone.metadata.details,
			signatures: ['border']
		});
	}

	runningFoot = Math.max(runningFoot, 0);

	for (const stone of fractionalStones) {
		if (runningFoot <= 0) break;

		const conversionFactorDictionary =
			stone.metadata.details.conversion_factors;
		if (!conversionFactorDictionary)
			throw new Error(`Stone ${stone.skuId} can not be used as a border`);

		const fractionalSegmentLength =
			runningFoot * (stone.coverage.value / fractionalTotal);
		const fractionalSegmentArea =
			fractionalSegmentLength * conversionFactorDictionary[orientation];

		borderArea += fractionalSegmentArea;
		stones.push({
			skuId: stone.skuId,
			displayName: stone.metadata.displayName,
			sqftCoverage: fractionalSegmentArea,
			sqftPrice: stone.metadata.price,
			details: stone.metadata.details,
			signatures: ['border']
		});
	}

	return {
		area: borderArea,
		items: stones
	};
}

function mergeItems(inputItems: Item[]) {
	const outputItems: Item[] = [];

	for (const item of inputItems) {
		const existingItem = outputItems.find((i) => i.skuId === item.skuId);
		if (existingItem) {
			existingItem.sqftCoverage += item.sqftCoverage;

			const itemSignature = item.signatures[0] as string;
			const containsItemSignature =
				existingItem.signatures.includes(itemSignature);

			if (!containsItemSignature) existingItem.signatures.push(itemSignature);
		} else {
			outputItems.push(item);
		}
	}

	return outputItems;
}

function getQuoteItems(item: Item) {
	const { sqft_per_pallet, pcs_per_sqft, pcs_per_pallet, lbs_per_unit } =
		item.details;
	const sqft_per_half_pallet = sqft_per_pallet / 2;

	const palletArea = round(
		roundTo(item.sqftCoverage, sqft_per_half_pallet, 'down'),
		2
	);
	const palletCount = Math.floor(palletArea / sqft_per_half_pallet) / 2;
	const pieceArea = round(
		roundTo(item.sqftCoverage - palletArea, 1 / pcs_per_sqft, 'up'),
		2
	);
	const pieceCount = Math.round(pieceArea * pcs_per_sqft);

	const factoryCost = round(palletArea * item.sqftPrice, 2);
	const showroomCost = round(pieceArea * (item.sqftPrice + 20), 2);

	const orderItems: QuoteItem[] = [];

	if (factoryCost > 0)
		orderItems.push({
			displayName: item.displayName,
			cost: factoryCost,
			area: palletArea,
			quantity: palletCount,
			unit: 'pal' as const,
			weight: palletCount * pcs_per_pallet * lbs_per_unit,
			signatures: item.signatures
		});

	if (showroomCost > 0)
		orderItems.push({
			displayName: item.displayName,
			cost: showroomCost,
			area: pieceArea,
			quantity: pieceCount,
			weight: pieceCount * lbs_per_unit,
			unit: 'pcs' as const,
			signatures: item.signatures
		});

	return orderItems;
}

function getQuoteDetails(orderItems: QuoteItem[]) {
	let subtotal = 0,
		totalArea = 0,
		totalWeight = 0;

	for (const cartItem of orderItems) {
		subtotal += cartItem.cost;
		totalArea += cartItem.area;
		totalWeight += cartItem.weight;
	}

	totalArea = round(totalArea, 2);
	totalWeight = round(totalWeight, 2);
	subtotal = round(subtotal, 2);
	const tax = round(subtotal * 0.15, 2);
	const total = round(subtotal + tax, 2);

	return { totalArea, totalWeight, subtotal, tax, total };
}

function getQuote(project: StoneProject) {
	const projectArea = calculateProjectArea(project.shape, project.dimensions);
	const border = getBorder(project.border);
	const infill = getInfill(projectArea - border.area, project.infill);

	const mergedItems = mergeItems([...infill.items, ...border.items]);

	const addAreaOverage = project.addons.some(
		({ id, enabled }) => id === 'area_overage' && enabled
	);

	const orderItems = mergedItems.flatMap((item) =>
		getQuoteItems(
			addAreaOverage
				? { ...item, sqftCoverage: round(item.sqftCoverage * 1.05, 2) }
				: item
		)
	);
	const orderDetails = getQuoteDetails(orderItems);

	return {
		items: orderItems,
		details: orderDetails
	};
}

type StageContextValue = {
	quote: Quote;
	navDirection: number;
	skippedStages: (boolean | undefined)[];
	stagesValidity: boolean[];
	currentStageIndex: number;
	queuedStageIndex: number;
	setStageIndex(newStageIndex: number): void;
	queueStageIndex(newStageIndex: number): void;
	setStageValidity(stageIndex: number, stageValidity: boolean): void;
	setStageSkipped(stageIndex: number, stageIsSkipped: boolean): void;
	commitQueuedIndex(): void;
};

export const StageContext = createContext<StageContextValue>(
	{} as StageContextValue
);

type StageProviderProps = React.PropsWithChildren<{
	maximumStageIndex: number;
}>;

const defaultValues: StoneProject = {
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
	},

	addons: [
		{
			id: 'sealant',
			displayName: 'Sealant',
			description:
				'Enhance the color of your stones. Protect them from the elements.',
			enabled: false
		},
		{
			id: 'polymeric',
			displayName: 'Polymeric Sand',
			description:
				'Prevent your pavers from shifting. Reduce weed growth between them.',
			enabled: false
		},
		{
			id: 'area_overage',
			displayName: '5% Area Overage',
			description:
				'For repairs and adjustments; Future batches may not match exactly.',
			enabled: false
		}
	]
};

export function StageProvider(props: StageProviderProps) {
	const formMethods = useForm<StoneProject>({
		defaultValues: defaultValues
	});

	const [[currentStageIndex, navDirection], _setCurrentStageIndex] = useState([
		0, 0
	]);

	function setCurrentStageIndex(newStageIndex: number) {
		_setCurrentStageIndex(([oldStageIndex]) => {
			const newDirection = newStageIndex - oldStageIndex;

			return [newStageIndex, newDirection];
		});
	}

	const [queuedStageIndex, queueStageIndex] = useState(0);
	const [stagesValidity, setStagesValidity] = useState<boolean[]>([
		false,
		false,
		false,
		false,
		true
	]);
	const [skippedStages, setSkippedStages] = useState<(boolean | undefined)[]>([
		undefined,
		undefined,
		undefined,
		undefined,
		undefined
	]);

	function setStageSkipped(stageIndex: number, stageIsSkipped: boolean) {
		setSkippedStages((currentSkippedStages) => {
			const newSkippedStages = structuredClone(currentSkippedStages);

			newSkippedStages[stageIndex] = stageIsSkipped;

			return newSkippedStages;
		});
	}

	function setStageValidity(stageIndex: number, stageValidity: boolean) {
		setStagesValidity((currentStagesValidity) => {
			const newStagesValidity = structuredClone(currentStagesValidity);

			newStagesValidity[stageIndex] = stageValidity;

			return newStagesValidity;
		});
	}

	// Handle form validity change
	useEffect(() => {
		setStageValidity(currentStageIndex, formMethods.formState.isValid);
	}, [currentStageIndex, formMethods.formState.isValid]);

	const commitQueuedIndex = useCallback(() => {
		if (queuedStageIndex >= 0 && queuedStageIndex <= props.maximumStageIndex)
			setCurrentStageIndex(queuedStageIndex);
	}, [queuedStageIndex, props.maximumStageIndex]);

	const [previousProject, setPreviousProject] = useState(defaultValues);
	const [quote, setQuote] = useState<Quote>({
		items: [],
		details: {
			totalArea: 0,
			totalWeight: 0,
			subtotal: 0,
			tax: 0,
			total: 0
		}
	});

	// Generate the quote when on the review stage. Regenerating if anything has changed.
	if (currentStageIndex === 4) {
		const currentProject = formMethods.watch();

		if (!isEqual(previousProject, currentProject)) {
			const quote = getQuote(currentProject);

			setQuote(quote);

			// Cloning the current project ensures that this block runs whenever it changes. If it isn't cloned, the previous object will be subscribed to all form updates which means this the the current and previous project objects will only ever be unequal once.
			setPreviousProject(structuredClone(currentProject));
		}
	}

	return (
		<StageContext.Provider
			value={{
				quote,
				navDirection,
				skippedStages,
				stagesValidity,
				currentStageIndex,
				queuedStageIndex,
				setStageIndex: setCurrentStageIndex,
				queueStageIndex,
				commitQueuedIndex,
				setStageValidity,
				setStageSkipped
			}}
		>
			<FormProvider {...formMethods}>{props.children}</FormProvider>
		</StageContext.Provider>
	);
}

export function useStageContext() {
	return useContext(StageContext);
}
