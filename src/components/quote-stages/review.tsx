import { formatNumber, formatPrice } from '@/utils/format';
import { Plus, PlusSquare } from 'lucide-react';
import { Button } from '../button';
import { StageForm } from './form';
import { unitDisplayNameDictionary } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';

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
import { roundTo } from '@/utils/number';
import { round } from 'mathjs';
import { PaverDetails } from '@/types/product';

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

type OrderItem = {
	displayName: string;
	cost: number;
	quantity: number;
	area: number;
	weight: number;
	unit: 'pal' | 'pcs';
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

function getOrderItems(item: Item) {
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

	const orderItems: OrderItem[] = [];

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

function getOrderDetails(orderItems: OrderItem[]) {
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

export function ReviewStage() {
	const { watch } = useFormContext<StoneProject>();

	const values = watch();
	const projectArea = calculateProjectArea(values.shape, values.dimensions);
	const border = getBorder(values.border);
	const infill = getInfill(projectArea - border.area, values.infill);

	console.table([
		{
			'Project Area': projectArea,
			'Border Area': border.area,
			'Infill Area': infill.area
		}
	]);

	const mergedItems = mergeItems([...infill.items, ...border.items]);

	const orderItems = mergedItems.flatMap((item) => getOrderItems(item));
	const orderDetails = getOrderDetails(orderItems);

	return (
		<StageForm className="space-y-16 px-32">
			<h2 className="text-center text-2xl">Review your items.</h2>

			<div className="flex justify-center">
				<ul className="grid grid-flow-col grid-cols-[repeat(3,256px)] gap-4">
					<Addons
						title="Sealant"
						description="Enhance the color of your stones. Protect them from the elements."
					/>
					<Addons
						title="Polymeric Sand"
						description="Prevent your pavers from shifting. Reduce weed growth between them."
					/>
					<Addons
						title="5% Area Overage"
						description="For repairs and adjustments; Future batches may not match exactly."
					/>
				</ul>
			</div>

			<ul>
				{orderItems.map((item, index) => (
					<Item key={index} {...item} />
				))}
			</ul>

			<div className="space-y-4 pl-40">
				<div className="flex justify-between">
					<span>Area</span>
					<span>{formatNumber(orderDetails.totalArea)} sqft</span>
				</div>
				<div className="flex justify-between">
					<span>Approximate Weight</span>
					<span>{formatNumber(orderDetails.totalWeight)} lbs</span>
				</div>
				<div className="flex justify-between">
					<span>Subtotal</span>
					<span>{formatPrice(orderDetails.subtotal)}</span>
				</div>
				<div className="flex justify-between">
					<span>Tax</span>
					<span>{formatPrice(orderDetails.tax)}</span>
				</div>
				<hr />
				<div className="flex justify-between text-lg">
					<span>Total</span>
					<span>{formatPrice(orderDetails.total)}</span>
				</div>

				<div className="!mt-16 flex justify-end">
					<Button variant="primary">
						<span>Add 4 Items to Quote</span>
						<PlusSquare />
					</Button>
				</div>
			</div>
		</StageForm>
	);
}

type AddonsProps = React.PropsWithChildren<{
	title: string;
	description: string;
}>;

function Addons({ title, description }: AddonsProps) {
	return (
		<li>
			<button className="flex h-full w-full items-center gap-2 rounded-lg border p-6 text-left hover:bg-gray-100">
				<span className="flex-1">
					<p className="font-semibold">{title}</p>
					<p className="text-sm">{description}</p>
				</span>

				<Plus />
			</button>
		</li>
	);
}

type ItemProps = OrderItem;

function Item(props: ItemProps) {
	const unit =
		unitDisplayNameDictionary[props.unit][props.quantity === 1 ? 0 : 1];

	return (
		<li className="-mx-8 flex gap-8 rounded-lg border border-transparent p-8 focus-within:bg-gray-100">
			<div className="h-32 w-32 bg-gray-300" />

			<div className="flex-1 space-y-4">
				<div className="flex gap-16">
					<h3 className="flex-1 text-lg">{props.displayName}</h3>
					<p
						className="flex-1 text-lg"
						title={`${formatNumber(props.area)} sqft`}
					>
						{props.quantity} {unit}
					</p>
					<p className="text-lg">{formatPrice(props.cost)}</p>
				</div>
				{props.area > 2000 && (
					<div className="flex justify-between">
						<p>Using our 50/50 payment plan:</p>
						<p>{formatPrice(props.cost / 2)} upfront</p>
					</div>
				)}

				<div className="flex items-center justify-between">
					<div>
						<p className="mb-2 font-semibold">Availability</p>
						<p>Order Today. Pick up on-site:</p>
						<p>Available Fri, May 7 at Our St. Thomas Factory</p>
					</div>

					<div className="flex flex-col items-end gap-2">
						<button className="block">Remove</button>
						<button className="block">Edit</button>
					</div>
				</div>
			</div>
		</li>
	);
}
