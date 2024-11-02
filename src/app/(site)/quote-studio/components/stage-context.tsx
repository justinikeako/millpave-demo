'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type {
	BorderConfig,
	Measurements,
	InfillConfig,
	Quote,
	QuoteItem,
	Shape,
	StoneProject,
	Unit,
	Unit1D,
	StoneMetadata,
	Pattern2D,
	Pattern1D,
	BorderOrientation
} from '~/types/quote';
import { roundTo } from '~/utils/number';
import { type PaverDetails } from '~/types/product';
import { isEqual } from 'lodash-es';
import { getQuoteDetails, roundFractionDigits } from '~/lib/utils';
import { stages } from './stages';
import { usePathname } from 'next/navigation';

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

function calculateProjectArea(shape: Shape, measurements: Measurements) {
	switch (shape) {
		case 'rect':
			return toSqft(
				measurements.length * measurements.width,
				measurements.unit
			);
		case 'circle':
			return toSqft(Math.PI * measurements.radius ** 2, measurements.unit);
		case 'other':
			return toSqft(measurements.area, measurements.unit);
	}
}

type Item = {
	skuId: string;
	displayName: string;
	sqftCoverage: number;
	price: number;
	details: PaverDetails;
	signatures: string[];
};

function getStoneMetadata(
	searchId: string,
	stoneMetadataArray: StoneMetadata[]
) {
	const metadata = stoneMetadataArray.find(({ skuId }) => skuId === searchId);

	if (!metadata)
		throw new Error(
			`Stone with the id '${searchId}' not found in metadata array.`
		);
	return metadata;
}

function getInfill(
	area: number,
	infill: InfillConfig,
	stoneMetadataArray: StoneMetadata[]
) {
	let infillArea = Math.max(0, area);

	const items: Item[] = [];
	const fractionalPatterns: Pattern2D[] = [];
	let fractionalTotal = 0;
	const fixedPatterns: Pattern2D[] = [];

	for (const pattern of infill.contents) {
		if (pattern.coverage.unit === 'fr') {
			fractionalTotal += parseFloat(
				pattern.coverage.value as unknown as string
			);
			fractionalPatterns.push(pattern);
		} else {
			fixedPatterns.push(pattern);
		}
	}

	for (const pattern of fixedPatterns) {
		const unit = pattern.coverage.unit;
		let fixedSegmentArea = 0;

		if (unit !== 'fr' && unit !== 'pal' && unit !== 'pcs' && unit !== 'unit') {
			fixedSegmentArea = toSqft(pattern.coverage.value, unit);
		}

		let patternArea = 0;
		const stones: { area: number; metadata: StoneMetadata }[] = [];
		for (const stone of pattern.contents) {
			const stoneMetadata = getStoneMetadata(stone.skuId, stoneMetadataArray);
			const stoneArea = stone.quantity / stoneMetadata.details.pcs_per_sqft;

			patternArea += stoneArea;
			stones.push({ area: stoneArea, metadata: stoneMetadata });
		}

		if (unit === 'unit') {
			fixedSegmentArea = pattern.coverage.value * patternArea;
		}

		const scaleFactor = fixedSegmentArea / patternArea;

		items.push(
			...stones.map(
				({ area, metadata }): Item => ({
					...metadata,
					sqftCoverage: area * scaleFactor,
					signatures: ['infill']
				})
			)
		);

		infillArea -= fixedSegmentArea;
	}

	infillArea = Math.max(infillArea, 0);

	for (const pattern of fractionalPatterns) {
		if (infillArea === 0) break;

		const fractionalSegmentArea =
			infillArea * (pattern.coverage.value / fractionalTotal);

		let patternArea = 0;
		const stones: { area: number; metadata: StoneMetadata }[] = [];
		for (const stone of pattern.contents) {
			const stoneMetadata = getStoneMetadata(stone.skuId, stoneMetadataArray);
			const stoneArea = stone.quantity / stoneMetadata.details.pcs_per_sqft;

			patternArea += stoneArea;
			stones.push({ area: stoneArea, metadata: stoneMetadata });
		}

		const scaleFactor = fractionalSegmentArea / patternArea;

		items.push(
			...stones.map(
				({ area, metadata }): Item => ({
					...metadata,
					sqftCoverage: area * scaleFactor,
					signatures: ['infill']
				})
			)
		);
	}

	return { area: Math.max(0, area), items: items };
}

function getConversionFactors(
	metadata: StoneMetadata,
	orientation: BorderOrientation
) {
	const conversionFactorDictionary = metadata.details.conversion_factors;

	if (!conversionFactorDictionary)
		throw new Error(`Stone ${metadata.skuId} can not be used as a border`);

	const inverseOrientation =
		orientation === 'SOLDIER_ROW' ? 'TIP_TO_TIP' : 'SOLDIER_ROW';

	return {
		conversionFactor: conversionFactorDictionary[orientation],
		inverseConversionFactor: conversionFactorDictionary[inverseOrientation]
	};
}

function getBorder(
	border: BorderConfig,
	inheritedUnit: Unit1D,
	stoneMetadataArray: StoneMetadata[]
) {
	let borderArea = 0;
	let runningFoot = toFt(border.runningLength.value, inheritedUnit);

	const items: Item[] = [];
	// Separate fixed and fractional patterns
	const fractionalPatterns: Pattern1D[] = [];
	let fractionalTotal = 0;
	const fixedPatterns: Pattern1D[] = [];

	for (const pattern of border.contents) {
		if (pattern.coverage.unit === 'fr') {
			fractionalTotal += parseFloat(
				pattern.coverage.value as unknown as string
			);
			fractionalPatterns.push(pattern);
		} else {
			fixedPatterns.push(pattern);
		}
	}

	for (const pattern of fixedPatterns) {
		const unit = pattern.coverage.unit;
		let fixedSegmentLength = 0;

		if (unit !== 'fr' && unit !== 'pal' && unit !== 'pcs' && unit !== 'unit') {
			toSqft(pattern.coverage.value, unit);
		}

		let patternLength = 0;
		const stones: { length: number; metadata: StoneMetadata }[] = [];
		for (const stone of pattern.contents) {
			const stoneMetadata = getStoneMetadata(stone.skuId, stoneMetadataArray);
			const { inverseConversionFactor } = getConversionFactors(
				stoneMetadata,
				border.orientation
			);
			const stoneLength = stone.quantity * inverseConversionFactor;

			patternLength += stoneLength;
			stones.push({ length: stoneLength, metadata: stoneMetadata });
		}

		if (unit === 'unit') {
			fixedSegmentLength = pattern.coverage.value * patternLength;
		}

		const scaleFactor = fixedSegmentLength / patternLength;

		items.push(
			...stones.map(({ length, metadata }): Item => {
				const { conversionFactor } = getConversionFactors(
					metadata,
					border.orientation
				);
				const stoneArea = length * conversionFactor;

				borderArea += stoneArea * scaleFactor;

				return {
					...metadata,
					sqftCoverage: stoneArea * scaleFactor,
					signatures: ['border']
				};
			})
		);
	}

	runningFoot = Math.max(runningFoot, 0);

	for (const pattern of fractionalPatterns) {
		if (runningFoot <= 0) break;

		let patternLength = 0;
		const stones: { length: number; metadata: StoneMetadata }[] = [];
		for (const stone of pattern.contents) {
			const stoneMetadata = getStoneMetadata(stone.skuId, stoneMetadataArray);
			const { inverseConversionFactor } = getConversionFactors(
				stoneMetadata,
				border.orientation
			);
			const stoneLength = stone.quantity * inverseConversionFactor;

			patternLength += stoneLength;
			stones.push({ length: stoneLength, metadata: stoneMetadata });
		}

		const fractionalSegmentLength =
			runningFoot * (pattern.coverage.value / fractionalTotal);
		const scaleFactor = fractionalSegmentLength / patternLength;

		items.push(
			...stones.map(({ length, metadata }): Item => {
				const { conversionFactor } = getConversionFactors(
					metadata,
					border.orientation
				);
				const stoneArea = length * conversionFactor;

				borderArea += stoneArea * scaleFactor;

				return {
					...metadata,
					sqftCoverage: stoneArea * scaleFactor,
					signatures: ['border']
				};
			})
		);
	}

	return {
		area: borderArea,
		items: items
	};
}

function mergeItems(inputItems: Item[]) {
	const outputItems: Item[] = [];

	for (const item of inputItems) {
		const existingItem = outputItems.find((i) => i.skuId === item.skuId);
		if (existingItem) {
			existingItem.sqftCoverage += item.sqftCoverage;

			const itemSignature = item.signatures[0]!;
			const containsItemSignature =
				existingItem.signatures.includes(itemSignature);

			if (!containsItemSignature) existingItem.signatures.push(itemSignature);
		} else {
			outputItems.push(item);
		}
	}

	return outputItems;
}

function getQuoteItems(item: Item, reducePickups: boolean) {
	const { sqft_per_pallet, pcs_per_sqft, pcs_per_pallet, lbs_per_unit } =
		item.details;
	const sqft_per_half_pallet = sqft_per_pallet / 2;

	const palletArea = roundFractionDigits(
		roundTo(
			item.sqftCoverage,
			sqft_per_half_pallet,
			reducePickups ? 'up' : 'down'
		),
		2
	);
	const palletCount = Math.floor(palletArea / sqft_per_half_pallet) / 2;
	const pieceArea = roundFractionDigits(
		roundTo(item.sqftCoverage - palletArea, 1 / pcs_per_sqft, 'up'),
		2
	);
	const pieceCount = Math.round(pieceArea * pcs_per_sqft);

	const factoryCost = roundFractionDigits(palletArea * item.price, 2);
	const showroomCost = roundFractionDigits(pieceArea * (item.price + 20), 2);

	const quoteItems: QuoteItem[] = [];

	if (factoryCost > 0)
		quoteItems.push({
			skuId: item.skuId,
			pickupLocationId: 'STT_FACTORY',
			displayName: item.displayName,
			cost: factoryCost,
			area: palletArea,
			quantity: palletCount,
			unit: 'pal' as const,
			weight: palletCount * pcs_per_pallet * lbs_per_unit,
			signatures: item.signatures
		});

	if (reducePickups === false && showroomCost > 0)
		quoteItems.push({
			pickupLocationId: 'KNG_SHOWROOM',
			skuId: item.skuId,
			displayName: item.displayName,
			cost: showroomCost,
			area: pieceArea,
			quantity: pieceCount,
			weight: pieceCount * lbs_per_unit,
			unit: 'pcs' as const,
			signatures: item.signatures
		});

	return quoteItems;
}

function getSealant(area: number) {
	const fiveGalCoverage = roundTo(area, 500, 'down');
	const fiveGalQuantity = fiveGalCoverage / 500;
	const oneGalCoverage = roundTo(area - fiveGalCoverage, 100, 'up');
	const oneGalQuantity = oneGalCoverage / 100;

	const fiveGalPrice = roundFractionDigits(25826.09 * fiveGalQuantity, 2);
	const oneGalPrice = roundFractionDigits(5913.04 * oneGalQuantity, 2);

	const quoteItems: QuoteItem[] = [];

	if (fiveGalPrice)
		quoteItems.push({
			skuId: 'oil_sealant:five_gallon',
			pickupLocationId: 'STT_FACTORY',
			displayName: 'DYNA Oil-Based Sealant (5 gallon)',
			cost: fiveGalPrice,
			quantity: fiveGalQuantity,
			signatures: [],
			weight: fiveGalQuantity * 25,
			unit: 'unit'
		});

	if (oneGalPrice)
		quoteItems.push({
			skuId: 'oil_sealant:one_gallon',
			pickupLocationId: 'KNG_SHOWROOM',
			displayName: 'DYNA Oil-Based Sealant (1 gallon)',
			cost: oneGalPrice,
			quantity: oneGalQuantity,
			signatures: [],
			weight: oneGalQuantity * 5,
			unit: 'unit'
		});

	return quoteItems;
}

function getPolymericSand(area: number) {
	const coverage = roundTo(area, 100, 'up');
	const quantity = coverage / 100;

	const price = roundFractionDigits(2695.65 * quantity, 2);

	return {
		skuId: 'polymeric_sand:fifty_pound',
		pickupLocationId: 'STT_FACTORY',
		displayName: 'DYNA Polymeric Sand (50 pound)',
		cost: price,
		quantity: quantity,
		signatures: [],
		weight: quantity * 50,
		unit: 'unit' as const
	};
}

function getQuote(project: StoneProject, stoneMetadataArray: StoneMetadata[]) {
	const projectArea = calculateProjectArea(project.shape, project.measurements);

	const border = getBorder(
		project.border,
		project.measurements.unit,
		stoneMetadataArray
	);
	const infill = getInfill(
		projectArea - border.area,
		project.infill,
		stoneMetadataArray
	);

	const mergedItems = mergeItems([...infill.items, ...border.items]);

	const addAreaOverage = project.addons.some(
		({ id, enabled }) => id === 'area_overage' && enabled
	);
	const addSealant = project.addons.some(
		({ id, enabled }) => id === 'sealant' && enabled
	);
	const addPolymeric = project.addons.some(
		({ id, enabled }) => id === 'polymeric' && enabled
	);
	const reducePickups = project.addons.some(
		({ id, enabled }) => id === 'reduce_pickups' && enabled
	);

	const quoteItems = mergedItems.flatMap((item) =>
		getQuoteItems(
			addAreaOverage
				? {
						...item,
						sqftCoverage: roundFractionDigits(item.sqftCoverage * 1.05, 2)
					}
				: item,
			reducePickups
		)
	);

	if (addSealant) quoteItems.push(...getSealant(projectArea));
	if (addPolymeric) quoteItems.push(getPolymericSand(projectArea));

	const quoteDetails = getQuoteDetails(quoteItems);

	return {
		items: quoteItems,
		details: quoteDetails
	};
}

type StoneMetadataWithUserCount = StoneMetadata & { userCount: number };

type StageContextValue = {
	stoneMetadataArray: StoneMetadataWithUserCount[];
	addStoneMetadata(newStoneMetadata: StoneMetadata): void;
	removeStoneMetadata(skuId: string): void;
	getStoneMetadata(skuId: string): StoneMetadata | undefined;
	quote: Quote;
	stageStatus: {
		pathname: string;
		valid: boolean | undefined;
		skipped: boolean | null | undefined;
	}[];
	currentStageIndex: number;
	getStageStatus(stageId: string | number): {
		valid: boolean;
		skipped: boolean | null | undefined;
	};
	setQuoteId(quoteId: string): void;
	setValidity(stage: string | number, valid: boolean): void;
	setSkipped(stage: string | number, skipped: boolean): void;
};

export const StageContext = createContext<StageContextValue>(
	{} as StageContextValue
);

const defaultValues: StoneProject = {
	email: '',

	shape: '' as 'rect',

	measurements: {
		width: 0,
		length: 0,
		unit: 'ft',
		area: 0,
		runningLength: 0,
		radius: 0
	},
	infill: {
		contents: []
	},
	border: {
		runningLength: { value: 0, unit: 'auto' },
		orientation: 'SOLDIER_ROW',
		contents: []
	},

	addons: [
		{
			id: 'sealant',
			displayName: 'Add Sealant',
			description:
				'Enhance the color of your stones. Protect them from the elements.',
			enabled: false
		},
		{
			id: 'polymeric',
			displayName: 'Add Polymeric Sand',
			description:
				'Prevent your pavers from shifting. Reduce weed growth between them.',
			enabled: false
		},
		{
			id: 'area_overage',
			displayName: '5% Overage',
			description:
				'For repairs and adjustments; Future batches may not match exactly.',
			enabled: false
		},
		{
			id: 'reduce_pickups',
			displayName: 'Reduce Pickups',
			description:
				'Order items from a single location and reduce the amount of pickups required.',
			enabled: false
		}
	]
};

export function StageProvider(props: React.PropsWithChildren) {
	const formMethods = useForm<StoneProject>({
		defaultValues: defaultValues
	});

	const pathname = usePathname();
	const currentStageIndex = stages.findIndex(
		(stage) => pathname === stage.pathname
	);

	const currentStage = stages[currentStageIndex]?.pathname;

	const [stageStatus, setStageStatus] = useState<
		{
			pathname: string;
			valid: boolean;
			skipped: boolean | null | undefined;
		}[]
	>(
		stages.map(({ pathname, optional }, index) => ({
			pathname,
			skipped: optional ?? false,
			valid: index === 0
		}))
	);

	function setSkipped(selected: string | number, skipped: boolean) {
		setStageStatus(
			stageStatus.map((stageStatus, stageIndex) => {
				const match =
					typeof selected === 'string'
						? selected === stageStatus.pathname
						: selected === stageIndex;

				if (match) return { ...stageStatus, skipped };

				return stageStatus;
			})
		);
	}

	function setValidity(selected: string | number, valid: boolean) {
		setStageStatus(
			stageStatus.map((stageStatus, stageIndex) => {
				const match =
					typeof selected === 'string'
						? selected === stageStatus.pathname
						: selected === stageIndex;
				if (match) return { ...stageStatus, valid };

				return stageStatus;
			})
		);
	}

	function getStageStatus(selected: string | number) {
		const index =
			typeof selected === 'string'
				? stages.findIndex((stage) => stage.pathname === selected)
				: selected;

		const status = stageStatus[index];

		if (!status) throw new Error(`Stage '${selected}' not found.`);

		return status;
	}

	// Handle form validity change
	useEffect(() => {
		setValidity(currentStageIndex, formMethods.formState.isValid);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentStageIndex, formMethods.formState.isValid]);

	const [previousProject, setPreviousProject] = useState(defaultValues);
	const [stoneMetadataArray, setStoneMetadataArray] = useState<
		StoneMetadataWithUserCount[]
	>([]);

	function getStoneMetadata(skuId: string) {
		const foundMetadata = stoneMetadataArray.find(
			(metadata) => metadata.skuId === skuId
		);

		return foundMetadata;
	}

	function addStoneMetadata(newMetadata: StoneMetadata) {
		const existingMetadata = getStoneMetadata(newMetadata.skuId);

		setStoneMetadataArray((prevMetadataArr) => {
			// Increment existing metadata object's userCount
			if (existingMetadata) {
				const updatedMetadataArray = prevMetadataArr.map((metadata) =>
					metadata.skuId === existingMetadata.skuId
						? { ...metadata, userCount: metadata.userCount + 1 }
						: metadata
				);
				return updatedMetadataArray;
			}

			// For truly new metadata, add them to the array with one user
			return [...prevMetadataArr, { ...newMetadata, userCount: 1 }];
		});
	}

	function removeStoneMetadata(skuId: string) {
		setStoneMetadataArray((prevMetadata) => {
			// Decrement user count from the affected metadata object
			const updatedMetadataArray = prevMetadata.map((metadata) =>
				metadata.skuId === skuId
					? { ...metadata, userCount: metadata.userCount - 1 }
					: metadata
			);

			// Remove metadata objects with zero users
			return updatedMetadataArray.filter((metadata) => metadata.userCount > 0);
		});
	}

	const [quote, setQuote] = useState<Quote>({
		id: undefined,
		items: [],
		details: {
			totalArea: 0,
			totalWeight: 0,
			subtotal: 0,
			tax: 0,
			total: 0
		}
	});

	function setQuoteId(quoteId: string) {
		setQuote({ ...quote, id: quoteId });
	}

	// Generate the quote when on the review stage. Regenerating if anything has changed.
	if (currentStage === '/quote-studio/configure') {
		const currentProject = formMethods.watch();

		if (!isEqual(previousProject, currentProject)) {
			const newQuote = getQuote(currentProject, stoneMetadataArray);

			setQuote({ ...quote, ...newQuote });

			// Cloning the current project ensures that this block runs whenever it changes. If it isn't cloned, the previous object will be subscribed to all form updates which means this the the current and previous project objects will only ever be unequal once.
			setPreviousProject(structuredClone(currentProject));
		}
	}

	return (
		<StageContext.Provider
			value={{
				quote,
				stageStatus,
				currentStageIndex,
				stoneMetadataArray,
				getStageStatus: getStageStatus,
				setQuoteId,
				getStoneMetadata,
				addStoneMetadata,
				removeStoneMetadata,
				setValidity,
				setSkipped
			}}
		>
			<FormProvider {...formMethods}>{props.children}</FormProvider>
		</StageContext.Provider>
	);
}

export function useStageContext() {
	const contextValue = useContext(StageContext);
	const { currentStageIndex } = contextValue;

	const [tuple, setTuple] = useState<[number, number]>([0, currentStageIndex]);

	if (tuple[1] !== currentStageIndex) {
		setTuple([tuple[1], currentStageIndex]);
	}

	const previousStageIndex = tuple[0];

	const direction = currentStageIndex > previousStageIndex ? 1 : -1;

	return { ...contextValue, direction };
}
