import { Control, Controller, useFormContext } from 'react-hook-form';
import { ProductDetails } from '../types/product';
import { useEffect, useState } from 'react';
import { Button } from './button';
import { formatNumber, formatPrice } from '../utils/format';
import { PickupLocation } from '@prisma/client';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectTrigger,
	SelectViewport
} from './select';
import { QuoteInputItem, Unit } from '../types/quote';
import { EvaluatableInput } from './evaluatable-input';

function round(value: number, multpile: number, direction?: 'up' | 'down') {
	let roundingFunction: (num: number) => number;

	if (direction === 'up') roundingFunction = Math.ceil;
	else if (direction === 'down') roundingFunction = Math.floor;
	else roundingFunction = Math.round;

	return roundingFunction(value / multpile) * multpile;
}

const getGCT = (subtotal: number) => subtotal * 0.15;
const removeGCT = (total: number) => total / 1.15;

function calculateTotal(area: number, skuPrice: number) {
	const subtotal = round(area * skuPrice, 0.01);
	const tax = round(getGCT(subtotal), 0.01);
	const total = round(subtotal + tax, 0.01);

	return { total, tax, subtotal };
}

type TransformerRecord<TKey extends string> = Record<
	TKey,
	(num: number) => number
>;

type RoundAreaConfig = {
	pickupLocation: PickupLocation;
	productDetails: ProductDetails;
	unit: Unit;
};

function roundArea(
	area: number,
	{ productDetails, pickupLocation, unit }: RoundAreaConfig
) {
	const { sqft_per_pallet, pcs_per_sqft } = productDetails;

	const roundingFunction: TransformerRecord<PickupLocation> = {
		FACTORY: (sqft) => {
			if (unit === 'jmd') return sqft; // Already rounded, pass value onward

			return round(sqft, sqft_per_pallet / 2, 'up'); // Round up to the nearest half pallet
		},
		SHOWROOM: (sqft) => {
			if (unit === 'jmd') return sqft; // Already rounded, pass value onward

			return round(sqft, 1 / pcs_per_sqft, 'up'); // Round up to the nearest piece
		}
	};

	return roundingFunction[pickupLocation](area);
}

type ConvertConfig = {
	pickupLocation: PickupLocation;
	productDetails: ProductDetails;
	skuPrice: number;
};

function convert(
	value: number,
	{ skuPrice, productDetails, pickupLocation }: ConvertConfig
) {
	const { sqft_per_pallet, pcs_per_sqft } = productDetails;

	return {
		toSqftFrom(unit: Unit) {
			// For JMD to sqft conversion

			const convertToSqftFrom: TransformerRecord<Unit> = {
				sqft: (squarefeet) => squarefeet,
				sqin: (inches) => inches / 12,
				sqm: (squareMeters) => squareMeters * 3.281,
				sqcm: (squareCentimeters) => squareCentimeters / 30.48,
				pal: (pallets) => pallets * sqft_per_pallet,
				pcs: (pieces) => pieces / pcs_per_sqft,
				jmd: (total) => {
					if (pickupLocation === 'FACTORY') {
						const sqft = removeGCT(total / skuPrice); // Divide total by sku price
						const roundedSqft = round(sqft, sqft_per_pallet / 2, 'down'); // Round Down to nearest half pallet

						return roundedSqft;
					} else {
						const sqft = removeGCT(total / skuPrice); // Divide total by showroom sku price
						const roundedSqft = round(sqft, 1 / pcs_per_sqft, 'down'); // Round Down to nearest piece

						return roundedSqft;
					}
				}
			};

			const unroundedArea = convertToSqftFrom[unit](value);
			const roundedArea = roundArea(unroundedArea, {
				productDetails,
				pickupLocation,
				unit
			});

			return { unroundedArea, roundedArea };
		},
		fromSqftTo(unit: Unit) {
			const convertFromSqftTo: TransformerRecord<Unit> = {
				sqft: (sqft) => round(sqft, 0.01),
				sqin: (sqft) => round(sqft * 12, 1),
				sqm: (sqft) => round(sqft / 3.281, 0.01),
				sqcm: (sqft) => round(sqft * 30.48, 1),
				pal: (sqft) => round(sqft / sqft_per_pallet, 0.5),
				pcs: (sqft) => round(sqft * pcs_per_sqft, 1),
				jmd: (sqft) => {
					const roundedArea = roundArea(sqft, {
						productDetails,
						pickupLocation,
						unit
					});
					return calculateTotal(roundedArea, skuPrice).total;
				}
			};

			// Ensure value has a maximum of 2 fraction digits
			return parseFloat(convertFromSqftTo[unit](value).toFixed(2));
		}
	};
}

function noEmptyStrings(str: string) {
	return str === '' ? '0' : str;
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
	convertConfig: {
		skuPrice: number;
		productDetails: ProductDetails;
		pickupLocation: PickupLocation;
	};
};

function QuickCalc({ control, convertConfig, header }: QuickCalcProps) {
	const SectionHeader = header;

	const { watch, setValue } = useFormContext<QuoteInputItem>();

	const { skuId, area, pickupLocation, input } = watch();
	const [showWork, setShowWork] = useState(false);

	const quickCalc = {
		area,
		...calculateTotal(area, convertConfig.skuPrice)
	};

	// Sync derived area with new convertConfigs only when skus change
	useEffect(() => {
		const { roundedArea } = convert(
			parseFloat(noEmptyStrings(input.value)),
			convertConfig
		).toSqftFrom(input.unit);

		setValue('area', roundedArea);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [skuId, pickupLocation]);

	return (
		<section className="space-y-4">
			<SectionHeader title="Quick Calculator" />

			{/* Input */}
			<div className="flex space-x-2">
				<label
					htmlFor="quickcalc-value"
					className="flex flex-1 space-x-2 rounded-md p-4 inner-border inner-border-gray-300 focus-within:inner-border-2 focus-within:inner-border-bubblegum-700"
				>
					<Controller
						control={control}
						name="area"
						render={({ field }) => {
							return (
								<EvaluatableInput
									inputValue={input.value}
									placeholder={quickCalcPlaceholder[input.unit]}
									onBlur={field.onBlur}
									onChange={(number) => {
										const { roundedArea } = convert(
											number,
											convertConfig
										).toSqftFrom(input.unit);
										const quantity = convert(
											roundedArea,
											convertConfig
										).fromSqftTo('pcs');

										setValue('area', roundedArea);
										setValue('quantity', quantity);
									}}
									onInputChange={(newValue) => {
										setValue('input.value', newValue);
									}}
									onRestoreLastValidValue={() => {
										const convertedValue = convert(
											quickCalc.area,
											convertConfig
										).fromSqftTo(input.unit);

										return convertedValue;
									}}
								/>
							);
						}}
					/>
				</label>

				<Select
					value={input.unit}
					onValueChange={(newUnit: Unit) => {
						const oldUnit = input.unit;

						const parsedInputValue = parseFloat(noEmptyStrings(input.value));

						const inputValueAsSqft = convert(
							parsedInputValue,
							convertConfig
						).toSqftFrom(oldUnit).unroundedArea;

						const convertedValue = convert(
							inputValueAsSqft,
							convertConfig
						).fromSqftTo(newUnit);

						setValue('input.value', convertedValue.toString());
						setValue('input.unit', newUnit);
					}}
				>
					<SelectTrigger />
					<SelectContent>
						<SelectScrollUpButton />
						<SelectViewport>
							<SelectItem value="pcs">pcs</SelectItem>
							<SelectItem value="pal">pal</SelectItem>
							<SelectItem value="sqft">sqft</SelectItem>
							<SelectItem value="sqin">sqin</SelectItem>
							<SelectItem value="sqm">sqm</SelectItem>
							<SelectItem value="sqcm">sqcm</SelectItem>
							<SelectItem value="jmd">JMD</SelectItem>
						</SelectViewport>
						<SelectScrollDownButton />
					</SelectContent>
				</Select>
			</div>

			{/* Delivery Location */}
			<div className="flex flex-wrap justify-between">
				<Select
					value={pickupLocation}
					onValueChange={(newValue) =>
						setValue('pickupLocation', newValue as PickupLocation)
					}
				>
					<SelectTrigger basic />
					<SelectContent>
						<SelectViewport>
							<SelectItem value="FACTORY">Factory Pickup</SelectItem>
							<SelectItem value="SHOWROOM">Showroom Pickup</SelectItem>
						</SelectViewport>
					</SelectContent>
				</Select>
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
									convertConfig.pickupLocation === 'FACTORY' ? 'pal' : 'pcs'
								)}{' '}
								{convertConfig.pickupLocation === 'FACTORY' ? 'pal' : 'pcs'}
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
