import { Control, Controller, useFormContext } from 'react-hook-form';
import { evaluate, number } from 'mathjs';
import { PickupLocation, ProductDetails } from '../types/product';
import { useEffect, useState } from 'react';
import Button from './button';
import { formatNumber, formatPrice } from '../utils/format';

type Unit = 'sqft' | 'sqin' | 'sqm' | 'sqcm' | 'pcs' | 'pal' | 'jmd';

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
		factory: (sqft) => {
			if (unit === 'jmd') return sqft; // Already rounded, pass value onward

			return round(sqft, sqft_per_pallet / 2, 'up'); // Round up to the nearest half pallet
		},
		showroom: (sqft) => {
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
			const sqftFromTotal: TransformerRecord<PickupLocation> = {
				factory: (total) => {
					const sqft = removeGCT(total / skuPrice); // Divide total by sku price
					const roundedSqft = round(sqft, sqft_per_pallet / 2, 'down'); // Round Down to nearest half pallet

					return roundedSqft;
				},
				showroom: (total) => {
					const sqft = removeGCT(total / skuPrice); // Divide total by showroom sku price
					const roundedSqft = round(sqft, 1 / pcs_per_sqft, 'down'); // Round Down to nearest piece

					return roundedSqft;
				}
			};

			const convertToSqftFrom: TransformerRecord<Unit> = {
				sqft: (squarefeet) => squarefeet,
				sqin: (inches) => inches / 12,
				sqm: (squareMeters) => squareMeters * 3.281,
				sqcm: (squareCentimeters) => squareCentimeters / 30.48,
				pal: (pallets) => pallets * sqft_per_pallet,
				pcs: (pieces) => pieces / pcs_per_sqft,
				jmd: (price) => sqftFromTotal[pickupLocation](price)
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
					const roundedSqft = roundArea(sqft, {
						productDetails,
						pickupLocation,
						unit
					});
					return calculateTotal(roundedSqft, skuPrice).total;
				}
			};

			// Ensure value has a maximum of 2 fraction digits
			return parseFloat(convertFromSqftTo[unit](value).toFixed(2));
		}
	};
}

function isNumeric(value: string | number) {
	try {
		number(value);

		if (isNaN(parseFloat(value as string))) return false;

		return true;
	} catch {
		return false;
	}
}

function noEmptyStrings(str: string) {
	return str === '' ? '0' : str;
}

const quicKCalcPlaceholder: Record<Unit, string> = {
	pcs: 'Quantity',
	pal: 'Quantity',
	sqft: 'Area',
	sqin: 'Area',
	sqm: 'Area',
	sqcm: 'Area',
	jmd: 'Amount'
};

type FormValues = {
	skuId: string;
	area: number;
	pickupLocation: PickupLocation;
};

type QuickCalcProps = {
	control: Control<FormValues>;
	header: React.FC<React.PropsWithChildren<{ title: string }>>;
	convertConfig: {
		skuPrice: number;
		productDetails: ProductDetails;
		pickupLocation: PickupLocation;
	};
};

const QuickCalc = ({ control, convertConfig, header }: QuickCalcProps) => {
	const { watch, register, setValue } = useFormContext<FormValues>();

	const { skuId, area, pickupLocation } = watch();
	const [showWork, setShowWork] = useState(false);
	const [qcInputValue, setQcInputValue] = useState('');
	const [unit, setUnit] = useState<Unit>('sqft');

	const quickCalc = {
		area,
		...calculateTotal(area, convertConfig.skuPrice)
	};

	// Sync derived area with new convertConfigs only when skus change
	useEffect(() => {
		const { roundedArea } = convert(
			parseFloat(noEmptyStrings(qcInputValue)),
			convertConfig
		).toSqftFrom(unit);

		setValue('area', roundedArea);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [skuId, pickupLocation]);

	const SectionHeader = header;

	return (
		<section className="space-y-4">
			<SectionHeader title="Quick Calculator" />

			{/* Input */}
			<div className="flex space-x-2">
				<label
					htmlFor="quickcalc-value"
					className="flex flex-1 space-x-2 rounded-md border border-zinc-300 p-4 focus-within:outline focus-within:outline-2 focus-within:outline-pink-800"
				>
					<Controller
						control={control}
						name="area"
						render={({ field }) => {
							function hijackInputValue(newValue: string) {
								setQcInputValue(newValue);
							}

							function setQcValue(number: number) {
								const { roundedArea } = convert(
									number,
									convertConfig
								).toSqftFrom(unit);

								setValue('area', roundedArea);
							}

							function commitChange(value: number, shouldRound?: boolean) {
								let valueToCommit = value;

								if (shouldRound) valueToCommit = round(value, 0.01);

								// Committed value is always rounded to nearest hundredth
								valueToCommit = parseFloat(valueToCommit.toFixed(2));

								hijackInputValue(valueToCommit.toString());

								if (valueToCommit > 0) setQcValue(valueToCommit);
								else setQcValue(0);
							}

							function evaluateInputValue(inputValue: string): number {
								// Replace invalid math symbols with valid ones
								const parsedInputValue = inputValue
									.replace(/(×|x)/g, '*')
									.replace(/÷/g, '/');

								// Evaluate parsed input value
								const transpiledInputValue = evaluate(parsedInputValue);

								// Throw if `evaluate` returns an object
								if (isNaN(transpiledInputValue)) {
									throw new Error(
										'Got an object. Restoring last valid qcValue'
									);
								}

								// Return transpiled value otherwise
								return transpiledInputValue;
							}

							function restoreLastValid() {
								const convertedValue = convert(
									quickCalc.area,
									convertConfig
								).fromSqftTo(unit);

								setQcInputValue(convertedValue.toString());
							}

							return (
								<input
									{...field}
									id="quickcalc-value"
									type="text"
									autoComplete="off"
									placeholder={quicKCalcPlaceholder[unit]}
									className="w-[100%] placeholder-zinc-500 outline-none"
									value={qcInputValue}
									onChange={(e) => {
										const inputValue = e.currentTarget.value;
										const inputValueIsNumeric = isNumeric(inputValue);

										// Don't hijack the input
										setQcInputValue(e.currentTarget.value);

										if (inputValueIsNumeric === true) {
											// Turn inputValue into a number
											const inputValueAsNumber = parseFloat(inputValue);

											// Commit that number as qcValue
											setQcValue(inputValueAsNumber);
										} else if (inputValue === '') {
											// If the input is empty, set qcValue to 0
											setQcValue(0);
										} else {
											try {
												// Otherwise, try to evaluate the inputValue as an expression
												const evaluatedValue = evaluateInputValue(inputValue);

												// Set calculated value as qcValue
												setQcValue(round(evaluatedValue, 0.01));
											} catch {}
										}
									}}
									onBlur={(e) => {
										field.onBlur(); // Let the form know when this input was touched

										const inputValue = e.currentTarget.value;
										const inputValueIsNumeric = isNumeric(inputValue);

										// Numbers don't need to be evaluated
										if (inputValueIsNumeric === false) {
											// If the input is empty, avoid NaN by setting value to 0
											if (inputValue === '') setQcValue(0);
											else {
												try {
													// Otherwise evalutate input as an expression
													const evaluatedValue = evaluateInputValue(inputValue);

													// Set calculated value as qcValue
													commitChange(round(evaluatedValue, 0.01));
												} catch {
													// Evaluation failed, restore the last valid value
													restoreLastValid();
												}
											}
										}
									}}
									onKeyDown={(e) => {
										const inputValue = e.currentTarget.value;
										const inputValueIsNumeric = isNumeric(inputValue);

										// Allow nudge only if the input value is a number
										if (
											(inputValueIsNumeric || inputValue === '') &&
											(e.key === 'ArrowUp' || e.key === 'ArrowDown')
										) {
											e.preventDefault();

											const parsedInputValue = parseFloat(
												noEmptyStrings(e.currentTarget.value)
											);

											if (e.key === 'ArrowUp') {
												// Nudge up 1 step
												commitChange(parsedInputValue + 1);
											} else if (
												e.key === 'ArrowDown' &&
												parsedInputValue >= 1
											) {
												// Nudge down 1 step if current value is greater than 1
												commitChange(parsedInputValue - 1);
											}
										} else if (!inputValueIsNumeric && e.key === 'Enter') {
											e.preventDefault();

											// If input is empty, avoid NaN by setting qcValue to 0
											if (inputValue === '') setQcValue(0);
											else {
												try {
													// Otherwise evalutate input as an expression
													const evaluatedValue = evaluateInputValue(inputValue);

													// Set calculated value as qcValue
													commitChange(round(evaluatedValue, 0.01));
												} catch {
													// Evaluation failed, restore the last valid qcValue
													restoreLastValid();
												}
											}
										}
									}}
								/>
							);
						}}
					/>
				</label>

				<label
					htmlFor="quickcalc-unit"
					className="flex space-x-2 rounded-md border border-zinc-300 p-4 focus-within:outline focus-within:outline-2 focus-within:outline-pink-800"
				>
					<select
						value={unit}
						onChange={(e) => {
							const oldUnit = unit;
							const newUnit = e.target.value as Unit;

							const parsedInputValue = parseFloat(noEmptyStrings(qcInputValue));

							const inputValueAsSqft = convert(
								parsedInputValue,
								convertConfig
							).toSqftFrom(oldUnit).unroundedArea;

							const convertedValue = convert(
								inputValueAsSqft,
								convertConfig
							).fromSqftTo(newUnit);

							setQcInputValue(convertedValue.toString());
							setUnit(newUnit);
						}}
						id="quickcalc-unit"
						className="bg-transparent outline-none"
					>
						<option value="pcs">pcs</option>
						<option value="pal">pal</option>
						<option value="sqft">sqft</option>
						<option value="sqin">sqin</option>
						<option value="sqm">sqm</option>
						<option value="sqcm">sqcm</option>
						<option value="jmd">$</option>
					</select>
				</label>
			</div>

			{/* Delivery Location */}
			<div className="flex flex-wrap justify-between">
				<select className="bg-transparent" {...register('pickupLocation')}>
					<option value="factory">Factory Pickup</option>
					<option value="showroom">Showroom Pickup</option>
				</select>
				<Button
					variant="tertiary"
					type="button"
					weight="normal"
					className="text-zinc-500"
					onClick={() => setShowWork(!showWork)}
				>
					{showWork ? 'Hide Work' : 'Show Work'}
				</Button>
			</div>

			{/* The total + how it was calculated */}
			<ul className="space-y-2 tabular-nums text-zinc-500">
				{showWork && (
					<>
						<li className="flex flex-wrap justify-between">
							<label htmlFor="quickcalc-quantity">Calculated Quantity</label>
							<output id="quickcalc-quantity" htmlFor="quickcalc-value">
								{convert(quickCalc.area, convertConfig).fromSqftTo(
									convertConfig.pickupLocation === 'factory' ? 'pal' : 'pcs'
								)}{' '}
								{convertConfig.pickupLocation === 'factory' ? 'pal' : 'pcs'}
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
				<li className="flex flex-wrap justify-between font-semibold text-pink-800">
					<label htmlFor="quickcalc-total">Total</label>
					<output id="quickcalc-total" htmlFor="quickcalc-value">
						{formatPrice(quickCalc.total)}
					</output>
				</li>
			</ul>

			<div className="flex flex-col space-y-2">
				<Button type="submit" variant="primary">
					Add to...
				</Button>
			</div>
		</section>
	);
};

export default QuickCalc;
