import * as Select from '@/components/select';
import { StageForm } from './form';
import { Controller, useFormContext } from 'react-hook-form';
import { StoneEditor } from './stone-editor';
import {
	Border,
	Dimensions,
	Infill,
	Shape,
	Stone1D,
	Stone2D,
	StoneProject,
	Unit
} from '@/types/quote';
import { calculateRunningFoot, unitDisplayNameDictionary } from '@/lib/utils';
import { useStageContext } from './stage-context';
import { roundTo } from '@/utils/number';
import { round } from 'mathjs';
import { PaverDetails } from '@/types/product';

function toFt(value: number, unit: Exclude<Unit, 'fr' | 'pal' | 'unit'>) {
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
				? Math.PI * Math.pow(Math.sqrt(circumference / 2), 2)
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

type CartItem = {
	displayName: string;
	cost: number;
	area: number;
	quantity: number;
	unit: 'pal' | 'pcs';
};

function getInfill(area: number, infill: Infill) {
	let infillArea = area;

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
		const unit = stone.coverage.unit as Exclude<Unit, 'fr' | 'pal'>;

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

	for (const stone of fractionalStones) {
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

	return { items: stones };
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

		const unit = stone.coverage.unit as Exclude<Unit, 'fr' | 'pal'>;

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

	for (const stone of fractionalStones) {
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

function getCartItems(item: Item) {
	const { sqft_per_pallet, pcs_per_sqft } = item.details;
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

	const factoryCost = palletArea * item.sqftPrice;
	const showroomCost = pieceArea * (item.sqftPrice + 20);

	return [
		{
			displayName: item.displayName,
			cost: factoryCost,
			area: palletArea,
			quantity: palletCount,
			unit: 'pal' as const
		},
		{
			displayName: item.displayName,
			cost: showroomCost,
			area: pieceArea,
			quantity: pieceCount,
			unit: 'pcs' as const
		}
	];
}

function getOrderDetails(cartItems: CartItem[]) {
	let subtotal = 0;

	for (const cartItem of cartItems) {
		subtotal += cartItem.cost;
	}

	subtotal = round(subtotal, 2);
	const tax = round(subtotal * 0.15, 2);
	const total = round(subtotal + tax, 2);

	return { subtotal, tax, total };
}

export function BorderStage() {
	const { setItems } = useStageContext();

	return (
		<StageForm
			className="space-y-16 px-32"
			onSubmit={(newValues) => {
				const projectArea = calculateProjectArea(
					newValues.shape,
					newValues.dimensions
				);
				const border = getBorder(newValues.border);
				const infill = getInfill(projectArea - border.area, newValues.infill);

				const mergedItems = mergeItems([...infill.items, ...border.items]);

				const cartItems = mergedItems.flatMap((item) => getCartItems(item));
				const orderDetails = getOrderDetails(cartItems);

				console.table(cartItems);
				console.log(orderDetails);

				setItems([
					{
						displayName: 'Colonial Classic Grey',
						quantity: 6,
						unit: 'pal',
						price: 156817.5,
						priceWithPlan: 78408.75,
						hasPlan: true
					},
					{
						displayName: 'Colonial Classic Red',
						quantity: 3,
						unit: 'pal',
						price: 88065,
						priceWithPlan: 44032.5,
						hasPlan: true
					},
					{
						displayName: 'CasaScapes Polymeric Sand',
						quantity: 3,
						unit: 'unit',
						price: 88065,
						hasPlan: false
					},
					{
						displayName: 'DynaMatrix HB-1 Protective Sealant (1 gallon)',
						quantity: 3,
						unit: 'unit',
						price: 70956.48,
						hasPlan: false
					}
				]);
			}}
		>
			<h2 className="text-center text-2xl">Add a border.</h2>

			<BorderOptions />

			<StoneEditor name="border.stones" dimension="1D" />
		</StageForm>
	);
}

function BorderOptions() {
	const { register, watch, control, setValue } = useFormContext<StoneProject>();

	const runningLengthUnit = watch('border.runningLength.unit');

	return (
		<div className="flex flex-wrap justify-center gap-4">
			<div className="max-w-xs flex-1 space-y-4">
				<label htmlFor="border.runningLength.value" className="font-semibold">
					Running Length
				</label>
				<label
					htmlFor="border.runningLength.value"
					className="flex w-full rounded-md bg-gray-200 p-4"
				>
					<input
						type="number"
						id="border.runningLength.value"
						{...register('border.runningLength.value')}
						readOnly={runningLengthUnit === 'auto'}
						className="no-arrows w-full flex-1 bg-transparent outline-none read-only:text-gray-400"
						placeholder="Amount"
					/>

					<Controller
						control={control}
						name="border.runningLength.unit"
						render={(runningLengthUnit) => (
							<Select.Root
								value={runningLengthUnit.field.value}
								onValueChange={(value) => {
									if (value === 'auto') {
										setValue(
											'border.runningLength.value',
											calculateRunningFoot(watch('shape'), watch('dimensions'))
										);
									}

									runningLengthUnit.field.onChange(value);
								}}
							>
								<Select.Trigger basic />

								<Select.Content>
									<Select.ScrollUpButton />
									<Select.Viewport>
										<Select.Item value="auto">auto (ft)</Select.Item>
										<Select.Item value="ft">
											{unitDisplayNameDictionary['ft'][0]}
										</Select.Item>
										<Select.Item value="in">
											{unitDisplayNameDictionary['in'][0]}
										</Select.Item>
										<Select.Item value="m">
											{unitDisplayNameDictionary['m'][0]}
										</Select.Item>
										<Select.Item value="cm">
											{unitDisplayNameDictionary['cm'][0]}
										</Select.Item>
									</Select.Viewport>
									<Select.ScrollDownButton />
								</Select.Content>
							</Select.Root>
						)}
					/>
				</label>
			</div>

			<div className="max-w-xs flex-1 space-y-4">
				<label className="font-semibold">Stone Orientation</label>

				<Controller
					control={control}
					name="border.orientation"
					render={(borderOrientation) => (
						<Select.Root
							value={borderOrientation.field.value}
							onValueChange={borderOrientation.field.onChange}
						>
							<Select.Trigger className="w-full !rounded-md" />

							<Select.Content>
								<Select.ScrollUpButton />
								<Select.Viewport>
									<Select.Item value="SOLDIER_ROW">Soldier Row</Select.Item>
									<Select.Item value="TIP_TO_TIP">Tip to Tip</Select.Item>
								</Select.Viewport>
								<Select.ScrollDownButton />
							</Select.Content>
						</Select.Root>
					)}
				/>
			</div>
		</div>
	);
}
