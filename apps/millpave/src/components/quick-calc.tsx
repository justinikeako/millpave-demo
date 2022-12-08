import { Control, useFormContext } from 'react-hook-form';
import { PaverDetails } from '../types/product';
import { useEffect, useState } from 'react';
import { Button } from './button';
import { formatNumber, formatPrice } from '../utils/format';
import * as Select from './select';
import { QuoteInputItem, Unit } from '../types/quote';
import { MathInput } from './math-input';
import { roundPrice } from '../utils/price';
import { roundTo } from '../utils/number';

const getGCT = (subtotal: number) => subtotal * 0.15;
const removeGCT = (total: number) => total / 1.15;

function calculateDetails(config: {
	area: number;
	productDetails: PaverDetails;
	skuPrice: number;
}) {
	const subtotal = roundPrice(config.area * config.skuPrice);
	const tax = roundPrice(getGCT(subtotal));
	const total = roundPrice(subtotal + tax);

	return { area: config.area, total, tax, subtotal };
}
// {
// 	Select,
// 	Select.Content,
// 	Select.Item,
// 	Select.ScrollDownButton,
// 	Select.ScrollUpButton,
// 	Select.Trigger,
// 	Select.Viewport
// }
type TransformerRecord<TKey extends string> = Record<
	TKey,
	(num: number) => number
>;

function roundArea(
	area: number,
	unit: Unit,
	{ productDetails, pickupLocationId }: ConvertConfig
) {
	const { sqft_per_pallet, pcs_per_sqft } = productDetails;

	const roundingFunction: TransformerRecord<string> = {
		STT_FACTORY: (sqft) => {
			return roundTo(sqft, sqft_per_pallet / 2, 'up'); // Round up to the nearest half pallet
		},
		KNG_SHOWROOM: (sqft) => {
			return roundTo(sqft, 1 / pcs_per_sqft, 'up'); // Round up to the nearest piece
		}
	};

	if (unit === 'jmd') return area; // Already rounded, pass value onward

	const round = roundingFunction[pickupLocationId];

	if (!round)
		throw new Error(
			`No rounding function was found for location '${pickupLocationId}'`
		);

	return round(area);
}

type ConvertConfig = {
	pickupLocationId: string;
	productDetails: PaverDetails;
	skuPrice: number;
};

// Define the conversion functions
const convertToSqft = (value: number, unit: Unit, config: ConvertConfig) => {
	// Define constants for the conversion factors and rounding rules
	const { sqft_per_pallet, pcs_per_sqft } = config.productDetails;
	const round_to_half_pallet = 0.5;

	const convertToSqft: TransformerRecord<Unit> = {
		sqft: (squarefeet) => squarefeet,
		sqin: (inches) => inches / 12,
		sqm: (squareMeters) => squareMeters * 3.281,
		sqcm: (squareCentimeters) => squareCentimeters / 30.48,
		pal: (pallets) => pallets * sqft_per_pallet,
		pcs: (pieces) => pieces / pcs_per_sqft,
		jmd: (total) => {
			const sqft = removeGCT(total / config.skuPrice); // Divide total by sku price
			const roundedSqft = roundTo(sqft, round_to_half_pallet, 'down'); // Round Down to nearest half pallet

			return roundedSqft;
		}
	};

	return convertToSqft[unit](value);
};

const convertFromSqft = (value: number, unit: Unit, config: ConvertConfig) => {
	// Define constants for the conversion factors and rounding rules
	const { sqft_per_pallet, pcs_per_sqft } = config.productDetails;
	const round_to_piece = 1 / pcs_per_sqft;

	const convertFromSqft: TransformerRecord<Unit> = {
		sqft: (sqft) => roundTo(sqft, 0.01),
		sqin: (sqft) => roundTo(sqft * 12, 1),
		sqm: (sqft) => roundTo(sqft / 3.281, 0.01),
		sqcm: (sqft) => roundTo(sqft * 30.48, 1),
		pal: (sqft) => roundTo(sqft / sqft_per_pallet, 0.5),
		pcs: (sqft) => roundTo(sqft * pcs_per_sqft, 1),
		jmd: (sqft) => roundTo(sqft, round_to_piece, 'down')
	};

	// Ensure value has a maximum of 2 fraction digits
	return parseFloat(convertFromSqft[unit](value).toFixed(2));
};

function convert(value: number, config: ConvertConfig) {
	return {
		toSqftFrom: (unit: Unit) => {
			const unroundedArea = convertToSqft(value, unit, config);
			const roundedArea = roundArea(unroundedArea, unit, config);

			return roundedArea;
		},
		fromSqftTo: (unit: Unit) => convertFromSqft(value, unit, config)
	};
}

const quickCalcPlaceholder: Record<Unit, string> = {
	pcs: 'Quantity',
	pal: 'Quantity',
	sqft: 'Area',
	sqin: 'Area',
	sqm: 'Area',
	sqcm: 'Area',
	jmd: 'Amount'
};

type QuickCalcProps = {
	control: Control<QuoteInputItem>;
	header: React.FC<React.PropsWithChildren<{ title: string }>>;
	convertConfig: ConvertConfig;
	skuId: string;
};

function QuickCalc({ convertConfig, header, skuId }: QuickCalcProps) {
	const SectionHeader = header;

	const { setValue } = useFormContext<QuoteInputItem>();

	const [showWork, setShowWork] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [rawArea, setRawArea] = useState(0);
	const [unit, setUnit] = useState<Unit>('sqft');

	const roundedArea = convert(rawArea, convertConfig).toSqftFrom(unit);

	const quickCalc = calculateDetails({
		area: roundedArea,
		skuPrice: convertConfig.skuPrice,
		productDetails: convertConfig.productDetails
	});

	// Recalculate quantity when sku changes (find a better way to do this)
	useEffect(() => {
		const quantity = convert(roundedArea, convertConfig).fromSqftTo('pcs');

		setValue('quantity', quantity);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [skuId]);

	return (
		<section className="space-y-4">
			<SectionHeader title="Quick Calculator" />

			{/* Input */}
			<div className="flex space-x-2">
				<label
					htmlFor="quickcalc-value"
					className="flex flex-1 space-x-2 rounded-md p-4 inner-border inner-border-gray-300 focus-within:inner-border-2 focus-within:inner-border-bubblegum-700"
				>
					<MathInput
						value={inputValue}
						result={rawArea}
						onChange={(newValue) => setInputValue(newValue)}
						onResultChange={(newResult) => {
							setRawArea(newResult);

							const roundedArea = convert(newResult, convertConfig).toSqftFrom(
								unit
							);
							const quantity = convert(roundedArea, convertConfig).fromSqftTo(
								'pcs'
							);

							setValue('quantity', quantity);
						}}
						canDecrement={rawArea >= 1}
						className="w-[100%] placeholder-gray-500 outline-none"
						placeholder={quickCalcPlaceholder[unit]}
					/>
				</label>

				<Select.Root
					value={unit}
					onValueChange={(newUnit: Unit) => {
						const convertedValue = convert(rawArea, convertConfig).fromSqftTo(
							newUnit
						);

						setInputValue(convertedValue.toString());
						setUnit(newUnit);
					}}
				>
					<Select.Trigger />
					<Select.Content>
						<Select.ScrollUpButton />
						<Select.Viewport>
							<Select.Item value="pcs">pcs</Select.Item>
							<Select.Item value="pal">pal</Select.Item>
							<Select.Item value="sqft">sqft</Select.Item>
							<Select.Item value="sqin">sqin</Select.Item>
							<Select.Item value="sqm">sqm</Select.Item>
							<Select.Item value="sqcm">sqcm</Select.Item>
							<Select.Item value="jmd">JMD</Select.Item>
						</Select.Viewport>
						<Select.ScrollDownButton />
					</Select.Content>
				</Select.Root>
			</div>

			{/* Delivery Location */}
			<div className="flex flex-wrap justify-between">
				<Select.Root
					value={convertConfig.pickupLocationId}
					onValueChange={(newLocation) => {
						setValue('pickupLocationId', newLocation);

						const newConvertConfig = {
							...convertConfig,
							pickupLocationId: newLocation
						};

						const roundedArea = convert(rawArea, newConvertConfig).toSqftFrom(
							unit
						);
						const quantity = convert(roundedArea, newConvertConfig).fromSqftTo(
							'pcs'
						);

						setValue('quantity', quantity);
					}}
				>
					<Select.Trigger basic />
					<Select.Content>
						<Select.Viewport>
							<Select.Item value="FACTORY">Factory Pickup</Select.Item>
							<Select.Item value="SHOWROOM">Showroom Pickup</Select.Item>
						</Select.Viewport>
					</Select.Content>
				</Select.Root>
				<Button
					variant="tertiary"
					type="button"
					className="text-gray-500"
					onClick={() => setShowWork(!showWork)}
				>
					<span>{showWork ? 'Hide Work' : 'Show Work'}</span>
				</Button>
			</div>

			{/* The total + how it was calculated */}
			<ul className="space-y-2 tabular-nums text-gray-500">
				{showWork && (
					<>
						<li className="flex flex-wrap justify-between">
							<label htmlFor="quickcalc-quantity">Calculated Quantity</label>
							<output id="quickcalc-quantity" htmlFor="quickcalc-value">
								{convert(quickCalc.area, convertConfig).fromSqftTo(
									convertConfig.pickupLocationId === 'FACTORY' ? 'pal' : 'pcs'
								)}{' '}
								{convertConfig.pickupLocationId === 'FACTORY' ? 'pal' : 'pcs'}
							</output>
						</li>
						<li className="flex flex-wrap justify-between">
							<label htmlFor="quickcalc-rounded-area">Area</label>
							<output id="quickcalc-rounded-area" htmlFor="quickcalc-value">
								{formatNumber(quickCalc.area)} sqft
							</output>
						</li>
						<li className="flex flex-wrap justify-between">
							<label htmlFor="quickcalc-subtotal">Subtotal</label>
							<output id="quickcalc-subtotal" htmlFor="quickcalc-value">
								{formatPrice(quickCalc.subtotal)}
							</output>
						</li>
						<li className="flex flex-wrap justify-between">
							<label htmlFor="quickcalc-tax">Tax</label>
							<output id="quickcalc-tax" htmlFor="quickcalc-value">
								{formatPrice(quickCalc.tax)}
							</output>
						</li>
					</>
				)}
				<li className="flex flex-wrap justify-between font-semibold text-bubblegum-700">
					<label htmlFor="quickcalc-total">Total</label>
					<output id="quickcalc-total" htmlFor="quickcalc-value">
						{formatPrice(quickCalc.total)}
					</output>
				</li>
			</ul>
		</section>
	);
}

export default QuickCalc;
