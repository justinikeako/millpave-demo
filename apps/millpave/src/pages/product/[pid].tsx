import type { NextPage } from 'next';
import Head from 'next/head';
import { FC, PropsWithChildren, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Button from '../../components/button';
import { differenceInCalendarDays, format } from 'date-fns';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { evaluate, number } from 'mathjs';
import { trpc } from '../../utils/trpc';
import NextError from 'next/error';
import {
	PickupLocation,
	ProductDetails,
	RestockQueueElement,
	SKU,
	Stock
} from '../../types/product';
import Link from 'next/link';

type Unit = 'sqft' | 'sqin' | 'sqm' | 'sqcm' | 'pcs' | 'pal' | 'jmd';

function formatRestockDate(date: number) {
	const difference = differenceInCalendarDays(date, new Date());

	if (date === -1) return 'Out of Stock';
	else if (difference === 0) return format(date, "'Restocks at' h:mm bbb");
	else if (difference === 1) return 'Restocks Tomorrow';

	return format(date, "'Restocks' EEE, LLL d");
}

function formatPrice(price: number) {
	const priceFormatter = new Intl.NumberFormat('en', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});

	return '$' + priceFormatter.format(price);
}

function formatNumber(number: number) {
	const numberFormatter = new Intl.NumberFormat('en', {
		maximumFractionDigits: 2
	});

	return numberFormatter.format(number);
}

type FormValues = {
	skuId: string;
	value: number;
	unit: Unit;
	pickupLocation: PickupLocation;
};

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

function findSKU(searchId: string, skuList?: SKU[]) {
	if (!skuList) return;

	const found = skuList.find((currentSKU) => currentSKU.id === searchId);

	return found;
}

type SectionHeaderProps = {
	title: string;
};

const SectionHeader: FC<PropsWithChildren<SectionHeaderProps>> = ({
	title,
	children
}) => {
	return (
		<div className="flex items-center justify-between">
			<h2 className="font-display text-lg font-semibold">{title}</h2>
			{children}
		</div>
	);
};

const ProductGallery = dynamic(
	() => import('../../components/product-page-gallery'),
	{ ssr: false, loading: () => <p>Loading...</p> }
);

const quicKCalcPlaceholder: Record<Unit, string> = {
	pcs: 'Quantity',
	pal: 'Quantity',
	sqft: 'Area',
	sqin: 'Area',
	sqm: 'Area',
	sqcm: 'Area',
	jmd: 'Amount'
};

type StockProps = {
	fulfillment: { stock: Stock[]; queue: RestockQueueElement[] };
	pickupLocation: PickupLocation;
	skuId: string;
};

const Stock = ({ fulfillment, skuId, pickupLocation }: StockProps) => {
	// get stock
	const currentStock =
		fulfillment.stock.find((item) => {
			const matchesSkuId = item.sku_id === skuId;
			const matchesPickupLocation = item.location === pickupLocation;

			return matchesSkuId && matchesPickupLocation;
		})?.quantity || 0;

	const matchedQueueElements = fulfillment.queue.filter(
		(queueElement) =>
			queueElement.sku_id === skuId && queueElement.location === pickupLocation
	);

	const closestRestock = matchedQueueElements.length
		? matchedQueueElements.reduce((prev, curr) => {
				return prev.date < curr.date ? prev : curr;
		  }).date
		: -1;

	return currentStock > 0 ? (
		<p>{formatNumber(currentStock)} sqft Available</p>
	) : (
		<p>{formatRestockDate(closestRestock)}</p>
	);
};

const Page: NextPage = () => {
	const router = useRouter();

	const productId = router.query.pid as string;

	const skuIdFragment = (router.query.sku as string).replace(/ /s, ':');
	const skuId = `${productId}:${skuIdFragment}`;

	const product = trpc.useQuery(['product.get', { productId }], {
		refetchOnWindowFocus: false
	});

	const [showWork, setShowWork] = useState(false);
	const [qcInputValue, setQcInputValue] = useState('');

	const { watch, register, setValue, handleSubmit, control } =
		useForm<FormValues>({
			defaultValues: {
				value: 0,
				unit: 'sqft',
				pickupLocation: 'factory',
				skuId: skuIdFragment
			}
		});

	const { value, unit, pickupLocation } = watch();

	const currentSKU = findSKU(skuId, product.data?.skuList);

	const findDetails = (skuIdFragment: string) => {
		const sku_id_fragment = skuIdFragment.split(':');

		return product.data?.details.find((details) => {
			return details.supports.reduce((matches, { values, index }) => {
				return matches && values === 'all'
					? true
					: values.includes(sku_id_fragment[index] || '');
			}, true);
		});
	};

	const productDetails = findDetails(skuIdFragment);

	if (!product.data || !currentSKU || !productDetails) {
		if (product.error?.data?.code === 'NOT_FOUND')
			return <NextError statusCode={404} />;

		return null;
	}

	const skuPrice = currentSKU.price + (pickupLocation === 'showroom' ? 20 : 0);

	const convertConfig: ConvertConfig = {
		skuPrice: skuPrice,
		productDetails: productDetails,
		pickupLocation: pickupLocation
	};

	const { unroundedArea, roundedArea } = convert(
		value,
		convertConfig
	).toSqftFrom(unit);

	const quickCalc = {
		unroundedArea,
		roundedArea,
		...calculateTotal(roundedArea, skuPrice)
	};

	return (
		<>
			<Head>
				<title>{`${currentSKU.display_name} — Millennium Paving Stones`}</title>
			</Head>

			{/* Canvas */}
			<main className="flex h-[75vh] flex-col bg-zinc-100 pb-16">
				<ProductGallery sku={currentSKU} />
			</main>

			{/* Bottom Sheet */}
			<aside className="relative z-10 -mt-8 space-y-12 rounded-2xl bg-white px-8 pb-16 pt-12">
				{/* Header */}
				<section className="space-y-2">
					<p>{product.data.category.display_name}</p>
					<h1 className="font-display text-xl font-semibold leading-tight">
						{currentSKU.display_name}
					</h1>
					<div className="flex flex-wrap justify-between text-zinc-500">
						<p>{formatPrice(skuPrice)}/sqft</p>

						<div className="flex space-x-1">
							<Stock
								fulfillment={product.data}
								pickupLocation={pickupLocation}
								skuId={skuId}
							/>

							<div>
								<Button variant="tertiary" iconLeft="info" weight="normal" />
							</div>
						</div>
					</div>
				</section>

				<form className="space-y-12" onSubmit={handleSubmit(console.log)}>
					{/* Color Picker */}
					<Controller
						name="skuId"
						control={control}
						render={({ field }) => {
							const skuFragments = field.value.split(':');

							const handleChange = (
								newFragment: string,
								changeIndex: number
							) => {
								const newSkuFragments = skuFragments.map(
									(oldFragment, index) => {
										return index === changeIndex ? newFragment : oldFragment;
									}
								);

								const newSku = newSkuFragments.join(':');
								const newSkuQuery = newSkuFragments.join('+');

								field.onChange(newSku);

								router.push(
									`/product/${productId}?sku=${newSkuQuery}`,
									undefined,
									{
										shallow: true,
										scroll: false
									}
								);
							};

							return (
								<>
									{product.data.sku_id_fragments.map(
										({ type, fragments, display_name, index }) => (
											<section key={index} className="space-y-4">
												<SectionHeader title={display_name}>
													{type === 'color' && (
														<p className="text-sm text-rose-600">Color Guide</p>
													)}
												</SectionHeader>

												{type === 'variant' && (
													<ul className="grid grid-cols-3 gap-2">
														{fragments.map(({ id, display_name }) => (
															<li key={id} className="contents">
																<label
																	htmlFor={id}
																	className="aspect-w-1 aspect-h-1"
																>
																	<input
																		className="peer hidden"
																		type="radio"
																		name={type}
																		value={id}
																		id={id}
																		checked={skuFragments[index] === id}
																		onChange={(e) =>
																			handleChange(e.target.value, index)
																		}
																	/>
																	<div className="rounded-full border border-zinc-300 shadow-[inset_0_0_0_2px_white] peer-checked:border-2 peer-checked:border-rose-900">
																		{display_name}
																	</div>
																</label>
															</li>
														))}
													</ul>
												)}
												{type === 'color' && (
													<ul className="grid grid-cols-8 gap-2 [@media(max-width:320px)]:grid-cols-7">
														{fragments.map(({ id, hex }) => (
															<li key={id} className="contents">
																<label
																	htmlFor={id}
																	className="aspect-w-1 aspect-h-1"
																>
																	<input
																		className="peer hidden"
																		type="radio"
																		name={type}
																		value={id}
																		id={id}
																		checked={skuFragments[index] === id}
																		onChange={(e) =>
																			handleChange(e.target.value, index)
																		}
																	/>
																	<div
																		className="rounded-full border border-zinc-300 shadow-[inset_0_0_0_2px_white] peer-checked:border-2 peer-checked:border-rose-900"
																		style={{ background: `#${hex}` }}
																	/>
																</label>
															</li>
														))}
													</ul>
												)}
											</section>
										)
									)}
								</>
							);
						}}
					/>

					{/* QuickCalc */}
					<section className="space-y-4">
						<SectionHeader title="Quick Calculator" />

						{/* Input */}
						<div className="flex space-x-2">
							<label
								htmlFor="quickcalc-value"
								className="flex flex-1 space-x-2 rounded-md border border-zinc-300 p-4 focus-within:border-rose-900"
							>
								<Controller
									control={control}
									name="value"
									render={({ field }) => {
										function hijackInputValue(newValue: string) {
											setQcInputValue(newValue);
										}

										function setQcValue(number: number) {
											setValue('value', number);
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

										function commitChange(
											value: number,
											shouldRound?: boolean
										) {
											let valueToCommit = value;

											if (shouldRound) valueToCommit = round(value, 0.01);

											// Committed value is always rounded to nearest hundredth
											valueToCommit = parseFloat(valueToCommit.toFixed(2));

											hijackInputValue(valueToCommit.toString());

											if (valueToCommit > 0) setQcValue(valueToCommit);
											else setQcValue(0);
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
															const evaluatedValue =
																evaluateInputValue(inputValue);

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
																const evaluatedValue =
																	evaluateInputValue(inputValue);

																// Set calculated value as qcValue
																commitChange(round(evaluatedValue, 0.01));
															} catch {
																// Evaluation failed, restore the last valid value
																commitChange(value);
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

														if (e.key === 'ArrowUp') {
															// Nudge up 1 step
															commitChange(value + 1);
														} else if (e.key === 'ArrowDown' && value >= 1) {
															// Nudge down 1 step if current value is greater than 1
															commitChange(value - 1);
														}
													} else if (
														!inputValueIsNumeric &&
														e.key === 'Enter'
													) {
														e.preventDefault();

														// If input is empty, avoid NaN by setting qcValue to 0
														if (inputValue === '') setQcValue(0);
														else {
															try {
																// Otherwise evalutate input as an expression
																const evaluatedValue =
																	evaluateInputValue(inputValue);

																// Set calculated value as qcValue
																commitChange(round(evaluatedValue, 0.01));
															} catch {
																// Evaluation failed, restore the last valid qcValue
																commitChange(value);
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
								className="flex space-x-2 rounded-md border border-zinc-300 p-4 focus-within:border-rose-900"
							>
								<select
									{...register('unit', {
										onChange: (e) => {
											const convertedValue = convert(
												quickCalc.unroundedArea,
												convertConfig
											).fromSqftTo(e.target.value);

											setValue('value', convertedValue);
											setQcInputValue(convertedValue.toString());
										}
									})}
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
							<select
								className="bg-transparent"
								{...register('pickupLocation')}
							>
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
										<label htmlFor="quickcalc-quantity">
											Calculated Quantity
										</label>
										<output id="quickcalc-quantity" htmlFor="quickcalc-value">
											{convert(quickCalc.roundedArea, convertConfig).fromSqftTo(
												pickupLocation === 'factory' ? 'pal' : 'pcs'
											)}{' '}
											{pickupLocation === 'factory' ? 'pal' : 'pcs'}
										</output>
									</li>
									<li className="flex flex-wrap justify-between">
										<label htmlFor="quickcalc-rounded-area">Area</label>
										<output
											id="quickcalc-rounded-area"
											htmlFor="quickcalc-value"
										>
											{formatNumber(roundedArea)} sqft
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
							<li className="flex flex-wrap justify-between font-semibold text-rose-900">
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
				</form>

				{/* Product Details */}
				<section className="space-y-4">
					<SectionHeader title="Product Details" />

					<ul className="-mx-4">
						<li className="flex justify-between rounded-md px-4 py-3 odd:bg-white even:bg-zinc-100">
							<p>Dimensions</p>
							<p>
								{productDetails.dimensions[0]} in x{' '}
								{productDetails.dimensions[1]} in x{' '}
								{productDetails.dimensions[2]} in
							</p>
						</li>
						<li className="flex justify-between rounded-md px-4 py-3 odd:bg-white even:bg-zinc-100">
							<p>Weight per unit</p>
							<p>{productDetails.lbs_per_unit} lbs</p>
						</li>
						<li className="flex justify-between rounded-md px-4 py-3 odd:bg-white even:bg-zinc-100">
							<p>Area per pallet</p>
							<p>{productDetails.sqft_per_pallet} sqft</p>
						</li>
						<li className="flex justify-between rounded-md px-4 py-3 odd:bg-white even:bg-zinc-100">
							<p>Units per pallet</p>
							<p>{productDetails.units_per_pallet}</p>
						</li>
						<li className="flex justify-between rounded-md px-4 py-3 odd:bg-white even:bg-zinc-100">
							<p>Pieces per sqft</p>
							<p>{productDetails.pcs_per_sqft}</p>
						</li>
					</ul>
				</section>

				{/* Product Gallery */}
				<section className="space-y-4">
					<SectionHeader title="Product Gallery" />

					<ul className="no-scrollbar -mx-8 flex snap-x snap-mandatory space-x-2 overflow-x-scroll px-4">
						<li className="shrink-0 basis-2"></li>

						{product.data.gallery.map(({ id, img_url }) => (
							<li
								key={id}
								className="relative h-64 shrink-0 basis-full snap-center overflow-hidden rounded-lg bg-zinc-100"
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									className="min-h-full min-w-full"
									src={img_url}
									loading="lazy"
									alt="Paving Stones"
								/>

								<Button
									variant="tertiary"
									iconLeft="info"
									className="absolute left-4 bottom-4 text-white drop-shadow-lg"
								/>
							</li>
						))}

						<li className="shrink-0 basis-2"></li>
					</ul>
				</section>

				{/* Recommendations */}
				<section className="space-y-4">
					<SectionHeader title={`Similar to ${product.data.display_name}`} />

					<div className="-mx-4 flex flex-col items-center space-y-8">
						<ul className="grid w-full grid-cols-2 gap-2">
							{product.data.similar_products.map((product) => (
								<li key={product.id} className="items-center space-y-2">
									<Link
										href={`/product/${product.id}?sku=${(() => {
											const colorId = skuIdFragment.split(':').at(-1);

											const defaultSkuIdFragmentList =
												product.default_sku_id_fragment.map((val) => {
													return val === '[color]' ? colorId : val;
												});

											const skuIdFragmentResult =
												defaultSkuIdFragmentList.join('+');

											return skuIdFragmentResult;
										})()}`}
									>
										<a>
											<div className="aspect-w-1 aspect-h-1 w-full rounded-lg bg-zinc-100" />

											<div>
												<h3 className="text-center font-semibold">
													{product.display_name}
												</h3>
												<p className="text-center text-zinc-500">
													from {formatPrice(product.price)}
												</p>
											</div>
										</a>
									</Link>
								</li>
							))}
						</ul>

						<Button
							variant="tertiary"
							iconRight="expand_more"
							className="text-rose-600"
						>
							Show more products
						</Button>
					</div>
				</section>
			</aside>
		</>
	);
};

export default Page;
