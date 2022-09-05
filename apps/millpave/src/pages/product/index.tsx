import type { GetServerSideProps, NextPage, Redirect } from 'next';
import Head from 'next/head';
import {
	FC,
	PropsWithChildren,
	startTransition,
	Suspense,
	useEffect,
	useState,
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import Button from '../../components/button';
import { addDays, addHours, differenceInCalendarDays, format } from 'date-fns';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { evaluate, number } from 'mathjs';

type Detail = {
	id: string;
	display_name: string;
	unit: string | null;
} & (
	| {
			type: 'basic';
			value: number;
	  }
	| {
			type: 'dimensions';
			value: number[];
	  }
);

type Unit = 'sqft' | 'sqin' | 'sqm' | 'sqcm' | 'pcs' | 'pal' | 'jmd';

type Price = number;

type DeliveryLocation = 'factory' | 'showroom';

type Stock = { value: number; unit: string };

type Product = {
	id: string;
	display_name: string;
	details: Detail[];
	gallery: {
		id: string;
		img_url: string;
	}[];
	similar: {
		id: string;
		display_name: string;
		price: Price;
	}[];
	sku_modifier_list: {
		index: number;
		type: 'color';
		display_name: string;
		modifiers: {
			id: string;
			display_name: string;
			hex: string;
		}[];
	}[];
};

type SKU = {
	id: string;
	display_name_modifier: string;
	price: Price;
	current_stock: { value: number; unit: 'sqft' };
	closest_restock_date?: number;
};

// Mock Product
const product: Product = {
	id: 'colonial_classic',
	display_name: 'Colonial Classic',
	details: [
		{
			type: 'dimensions',
			id: 'dimensions',
			display_name: 'Dimensions',
			value: [4, 8, 2.375],
			unit: 'in',
		},
		{
			type: 'basic',
			id: 'weight_per_unit',
			display_name: 'Weight per unit',
			value: 5,
			unit: 'lbs',
		},
		{
			type: 'basic',
			id: 'area_per_pallet',
			display_name: 'Area per pallet',
			value: 128.75,
			unit: 'sqft',
		},
		{
			type: 'basic',
			id: 'units_per_pallet',
			display_name: 'Units per pallet',
			value: 600,
			unit: null,
		},
		{
			type: 'basic',
			id: 'pcs_per_sqft',
			display_name: 'Pieces per sqft',
			value: 4.66,
			unit: null,
		},
	],
	gallery: [
		{
			id: '32kjrl',
			img_url:
				'http://mobileimages.lowes.com/productimages/e17627ec-4502-40ad-8f2c-21d1f7e53c11/43213000.jpg',
		},
		{
			id: '08reif',
			img_url:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZbfAPwMpsFKxnnD3Q-Zq4NS_jOcdiDROoqjHBUrGcN10K_VlZPPzsRxh4fwYxT2Ec0lU&usqp=CAU',
		},
		{
			id: 'ca09u3',
			img_url:
				'https://i.pinimg.com/originals/b0/65/13/b06513eb47b0917940f8930b98c0021e.jpg',
		},
	],
	similar: [
		{
			id: 'banjo',
			display_name: 'Banjo',
			price: 228,
		},
		{
			id: 'heritage_regular',
			display_name: 'Heritage Regular',
			price: 228,
		},
	],
	sku_modifier_list: [
		{
			index: 0,
			type: 'color',
			display_name: 'Color',
			modifiers: [
				{ id: 'grey', display_name: 'Grey', hex: 'D9D9D9' },
				{ id: 'ash', display_name: 'Ash', hex: 'B1B1B1' },
				{ id: 'charcoal', display_name: 'Charcoal', hex: '696969' },
				{ id: 'spanish_brown', display_name: 'Spanish Brown', hex: '95816D' },
				{ id: 'sunset_taupe', display_name: 'Sunset Taupe', hex: 'C9B098' },
				{ id: 'tan', display_name: 'Tan', hex: 'DDCCBB' },
				{ id: 'shale_brown', display_name: 'Shale Brown', hex: '907A7A' },
				{ id: 'sunset_clay', display_name: 'Sunset Clay', hex: 'E7A597' },
				{ id: 'red', display_name: 'Red', hex: 'EF847A' },
				{ id: 'terracotta', display_name: 'Terracotta', hex: 'EFA17A' },
				{ id: 'orange', display_name: 'Orange', hex: 'EBB075' },
				{
					id: 'sunset_tangerine',
					display_name: 'Sunset Tangerine',
					hex: 'E7C769',
				},
				{ id: 'yellow', display_name: 'Yellow', hex: 'E7DD69' },
				{ id: 'green', display_name: 'Green', hex: 'A9D786' },
			],
		},
	],
};

// Mock SKUs
const skuList: SKU[] = [
	{
		id: 'colonial_classic:grey',
		display_name_modifier: 'Grey',
		price: 203,
		current_stock: { value: 3605, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 2).getTime(),
	},
	{
		id: 'colonial_classic:ash',
		display_name_modifier: 'Ash',
		price: 228,
		current_stock: { value: 0, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 7).getTime(),
	},
	{
		id: 'colonial_classic:charcoal',
		display_name_modifier: 'Charcoal',
		price: 228,
		current_stock: { value: 0, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 1).getTime(),
	},
	{
		id: 'colonial_classic:spanish_brown',
		display_name_modifier: 'Spanish Brown',
		price: 228,
		current_stock: { value: 0, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 3).getTime(),
	},
	{
		id: 'colonial_classic:sunset_taupe',
		display_name_modifier: 'Sunset Taupe',
		price: 228,
		current_stock: { value: 0, unit: 'sqft' },
	},
	{
		id: 'colonial_classic:tan',
		display_name_modifier: 'Tan',
		price: 228,
		current_stock: { value: 0, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 3).getTime(),
	},
	{
		id: 'colonial_classic:shale_brown',
		display_name_modifier: 'Shale Brown',
		price: 228,
		current_stock: { value: 0, unit: 'sqft' },
		closest_restock_date: addHours(new Date(), 1).getTime(),
	},
	{
		id: 'colonial_classic:sunset_clay',
		display_name_modifier: 'Sunset Clay',
		price: 228,
		current_stock: { value: 0, unit: 'sqft' },
	},
	{
		id: 'colonial_classic:red',
		display_name_modifier: 'Red',
		price: 228,
		current_stock: { value: 1545, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 3).getTime(),
	},
	{
		id: 'colonial_classic:terracotta',
		display_name_modifier: 'Terracotta',
		price: 228,
		current_stock: { value: 515, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 3).getTime(),
	},
	{
		id: 'colonial_classic:orange',
		display_name_modifier: 'Orange',
		price: 228,
		current_stock: { value: 257, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 3).getTime(),
	},
	{
		id: 'colonial_classic:sunset_tangerine',
		display_name_modifier: 'Sunset Tangerine',
		price: 228,
		current_stock: { value: 0, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 10).getTime(),
	},
	{
		id: 'colonial_classic:yellow',
		display_name_modifier: 'Yellow',
		price: 233,
		current_stock: { value: 450, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 3).getTime(),
	},
	{
		id: 'colonial_classic:green',
		display_name_modifier: 'Green',
		price: 363,
		current_stock: { value: 64.38, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 3).getTime(),
	},
];

function formatRestockDate(date: number) {
	const difference = differenceInCalendarDays(date, new Date());

	if (difference === 0) return format(date, "'at' h:mm bbb");
	else if (difference === 1) return 'Tomorrow';

	return format(date, 'EEE, LLL d');
}

function formatProductDetail({ type, value, unit }: Detail) {
	if (type === 'dimensions')
		return `${value[0]} ${unit} x ${value[1]} ${unit} x ${value[2]} ${unit}`;

	return value + (unit ? ` ${unit}` : '');
}

function extractBasicProductDetailValue(detailArr: Detail[], detailID: string) {
	try {
		const detail = detailArr.find((detail) => {
			if (detail.id === detailID && detail.type !== 'basic')
				throw new Error(`Detail '${detailID}' is not basic.`);

			return detail.id === detailID;
		});
		if (!detail) throw new Error(`Detail '${detailID}' does not exist.`);

		return detail.value as number;
	} catch (err) {
		throw err;
	}
}

const priceFormatter = new Intl.NumberFormat('en', {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('en', {
	maximumFractionDigits: 2,
});

function formatPrice(price: number) {
	return '$' + priceFormatter.format(price);
}

function formatStock(stock: Stock) {
	return `${numberFormatter.format(stock.value)} ${stock.unit} available`;
}

type FormValues = {
	color: string;
	_quickCalcValue: string;
	value: number;
	unit: Unit;
	deliveryLocation: DeliveryLocation;
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

type TransformerRecord<TKey extends string> = Record<
	TKey,
	(num: number) => number
>;

function calculateTotal(
	{ value, unit, deliveryLocation }: FormValues,
	detailArr: Detail[],
	sku: SKU,
) {
	const sqft_per_pallet = extractBasicProductDetailValue(
		detailArr,
		'area_per_pallet',
	);
	const pcs_per_sqft = extractBasicProductDetailValue(
		detailArr,
		'pcs_per_sqft',
	);
	const sku_price = sku.price;

	// For JMD to sqft conversion
	const sqftFromTotal: TransformerRecord<DeliveryLocation> = {
		factory: (total) => {
			const sqft = removeGCT(total / sku.price); // Divide total by sku price
			const roundedSqft = round(sqft, sqft_per_pallet / 2, 'down'); // Round Down to nearest half pallet

			return roundedSqft;
		},
		showroom: (total) => {
			const sqft = removeGCT(total) / (sku.price + 20); // Divide total by showroom sku price
			const roundedSqft = round(sqft, 1 / pcs_per_sqft, 'down'); // Round Down to nearest piece

			return roundedSqft;
		},
	};

	// Convert a given unit to square feet
	const convertToSqftFrom: TransformerRecord<Unit> = {
		sqft: (squarefeet) => squarefeet,
		sqin: (inches) => inches / 12,
		sqm: (squareMeters) => squareMeters * 3.281,
		sqcm: (squareCentimeters) => squareCentimeters / 30.48,
		pal: (pallets) => pallets * sqft_per_pallet,
		pcs: (pieces) => pieces / pcs_per_sqft,
		jmd: (price) => {
			return sqftFromTotal[deliveryLocation](price);
		},
	};

	const unroundedArea = convertToSqftFrom[unit](value);

	const roundingFunction: TransformerRecord<DeliveryLocation> = {
		factory: (num) => round(num, sqft_per_pallet / 2, 'up'), // Round to the nearest half pallet
		showroom: (num) => round(num, 1 / pcs_per_sqft, 'up'), // Round to the nearest piece
	};

	const roundedArea = roundingFunction[deliveryLocation](unroundedArea);

	const calculateSubtotal: TransformerRecord<DeliveryLocation> = {
		factory: (sqft) => sqft * sku_price, // Multiply area by the sku price
		showroom: (sqft) => sqft * (sku_price + 20), // Multiply area by the premium sku price
	};

	let subtotal = calculateSubtotal[deliveryLocation](roundedArea);

	const tax = getGCT(subtotal);
	const total = subtotal + tax;

	return {
		unroundedArea,
		roundedArea: roundedArea,
		subtotal: subtotal,
		tax: tax,
		total: total,
	};
}

function convertFromSqft(
	unit: Unit,
	{ value, ...formValues }: FormValues,
	detailArr: Detail[],
	sku: SKU,
) {
	const sqft_per_pallet = extractBasicProductDetailValue(
		detailArr,
		'area_per_pallet',
	);
	const pcs_per_sqft = extractBasicProductDetailValue(
		detailArr,
		'pcs_per_sqft',
	);

	const convertFromSqftTo: TransformerRecord<Unit> = {
		sqft: (sqft) => round(sqft, 0.01),
		sqin: (sqft) => round(sqft * 12, 1),
		sqm: (sqft) => round(sqft / 3.281, 0.01),
		sqcm: (sqft) => round(sqft * 30.48, 1),
		pal: (sqft) => round(sqft / sqft_per_pallet, 0.5),
		pcs: (sqft) => round(sqft * pcs_per_sqft, 1),
		jmd: (sqft) =>
			round(
				calculateTotal(
					{ ...formValues, value: sqft, unit: 'sqft' },
					detailArr,
					sku,
				).total,
				0.01,
			),
	};

	// Ensure value has a maximum of 2 fraction digits
	return parseFloat(convertFromSqftTo[unit](value).toFixed(2));
}

// Understand how this function works later

function isNumeric(value: string | number) {
	try {
		number(value);

		if (value.toString().split('').at(-1) === '.') return false;

		if (isNaN(parseFloat(value as string))) return false;

		return true;
	} catch {
		return false;
	}
}

type SectionHeaderProps = {
	title: string;
};

const SectionHeader: FC<PropsWithChildren<SectionHeaderProps>> = ({
	title,
	children,
}) => {
	return (
		<div className="flex items-center justify-between">
			<h2 className="font-display text-lg font-semibold">{title}</h2>
			{children}
		</div>
	);
};

const LazyProductGallery = dynamic(
	() => import('../../components/product-page-gallery'),
	{ ssr: false, suspense: true },
);

const quicKCalcPlaceholder: Record<Unit, string> = {
	pcs: 'Quantity',
	pal: 'Quantity',
	sqft: 'Area',
	sqin: 'Area',
	sqm: 'Area',
	sqcm: 'Area',
	jmd: 'Amount',
};

const Page: NextPage<{ product: Product; initialSKU: SKU }> = ({
	product,
	initialSKU,
}) => {
	const router = useRouter();

	const [sku, setSKU] = useState<SKU>(initialSKU);
	const [showWork, setShowWork] = useState(false);

	useEffect(() => {
		try {
			// Compose SKU ID
			const skuID = `${product.id}:${router.query.sku}`;

			// Find SKU
			const sku = skuList.find((sku) => sku.id === skuID);

			if (sku) startTransition(() => setSKU(sku)); // return sku if found
			else throw new Error(`SKU not found`); // This should never occur, but just in case
		} catch (err) {
			throw err;
		}
	}, [router]);

	const { watch, register, setValue, handleSubmit, control } =
		useForm<FormValues>({
			defaultValues: {
				_quickCalcValue: '',
				value: 0,
				unit: 'sqft',
				deliveryLocation: 'factory',
				color: initialSKU.id.split(':')[1],
			},
		});

	const currentValues = watch();

	const quickCalc = calculateTotal(currentValues, product.details, sku);

	return (
		<>
			<Head>
				<title>
					{product.display_name} {sku.display_name_modifier} — Millennium Paving
					Stones
				</title>
			</Head>

			{/* Canvas */}
			<main className="flex h-[75vh] flex-col bg-zinc-100 pb-16">
				<div className="flex-1">
					<Suspense fallback="Loading...">
						<LazyProductGallery colorID={sku.id} />
					</Suspense>
				</div>

				<div className="flex flex-col items-center">
					<Button variant="secondary" iconLeft="view_in_ar_new">
						View in Your Space
					</Button>
				</div>
			</main>

			{/* Bottom Sheet */}
			<aside className="relative z-10 -mt-8 space-y-12 rounded-2xl bg-white px-8 py-16">
				{/* Header */}
				<section className="space-y-2">
					<p>Concrete Paver</p>
					<h1 className="font-display text-xl font-semibold leading-tight">
						{product.display_name} {sku.display_name_modifier}
					</h1>
					<div className="flex flex-wrap justify-between text-zinc-500">
						<p>{formatPrice(sku.price)}/sqft</p>

						<div className="flex space-x-1">
							{sku.current_stock.value > 0 ? (
								<p>{formatStock(sku.current_stock)}</p>
							) : sku.closest_restock_date ? (
								<p>Restocks {formatRestockDate(sku.closest_restock_date)}</p>
							) : (
								<p>Done to Order</p>
							)}
							<div>
								<Button variant="tertiary" iconLeft="info" weight="normal" />
							</div>
						</div>
					</div>
				</section>

				<form className="space-y-12" onSubmit={handleSubmit(console.log)}>
					{/* Color Picker */}
					<section className="space-y-4">
						<SectionHeader title="Colors">
							<p className="text-sm text-rose-600">Color Guide</p>
						</SectionHeader>

						<ul className="grid grid-cols-8 gap-2 [@media(max-width:320px)]:grid-cols-7">
							{product.sku_modifier_list[0]?.modifiers.map(({ id, hex }) => (
								<li key={id} className="contents">
									<label htmlFor={id} className="aspect-w-1 aspect-h-1">
										<input
											{...register('color', {
												onChange: (e) =>
													router.push(`?sku=${e.target.value}`, undefined, {
														shallow: true,
														scroll: false,
													}),
											})}
											className="peer hidden"
											type="radio"
											value={id}
											id={id}
										/>
										<div
											className=" rounded-full border border-zinc-300 shadow-[inset_0_0_0_2px_white] peer-checked:border-2 peer-checked:border-rose-900"
											style={{ background: `#${hex}` }}
										/>
									</label>
								</li>
							))}
						</ul>
					</section>

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
									name="_quickCalcValue"
									render={({ field: { value, ...field } }) => {
										const setFieldValue = field.onChange;

										function commitChange(
											value: number,
											shouldRound?: boolean,
										) {
											let valueToCommit = value;

											if (shouldRound) valueToCommit = round(value, 0.01);
											setFieldValue(valueToCommit);

											if (valueToCommit > 0) setValue('value', valueToCommit);
											else setValue('value', 0);
										}

										return (
											<input
												{...field}
												id="quickcalc-value"
												type="text"
												autoComplete="off"
												placeholder={quicKCalcPlaceholder[currentValues.unit]}
												className="w-[100%] placeholder-zinc-500 outline-none"
												value={value === undefined ? '' : value.toString()}
												onChange={(e) => {
													const inputValue = e.currentTarget.value;
													const inputValueIsNumeric = isNumeric(inputValue);

													//
													if (inputValueIsNumeric) {
														const inputValueAsNumber = parseFloat(inputValue);

														commitChange(inputValueAsNumber);
													} else {
														// If the input is empty...
														if (inputValue === '') {
															setValue('value', 0); // ...set value to 0
															setFieldValue(e); //
														} else {
															try {
																let calculatedValue = evaluate(inputValue);

																// ^ `evaluate` may return an object
																if (isNaN(calculatedValue)) {
																	// Got an object! Restore the last valid value
																	setFieldValue(e);
																} else {
																	// Commit evaluated value...
																	setValue(
																		'value',
																		round(calculatedValue, 0.01),
																	);

																	// ...without hijacking the input
																	setFieldValue(e);
																}
															} catch {
																setFieldValue(e);
															}
														}
													}
												}}
												onBlur={(e) => {
													field.onBlur(); // Let the form know when this input was touched

													const inputValue = e.currentTarget.value;
													const inputValueIsNumeric = isNumeric(inputValue);

													// Numbers don't need to be evaluated
													if (inputValueIsNumeric === false) {
														// If the input is empty, avoid NaN by setting value to 0
														if (inputValue === '') setValue('value', 0);
														else {
															try {
																// Otherwise evalutate input as an expression
																const calculatedValue = evaluate(inputValue);

																// ^ `evaluate` may return an object
																if (isNaN(calculatedValue)) {
																	// Got an object! Restore the last valid value
																	commitChange(currentValues.value);
																} else {
																	// Commit calculated value
																	commitChange(round(calculatedValue, 0.01));
																}
															} catch {
																// Evaluation failed, restore the last valid value
																commitChange(currentValues.value);
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
															commitChange(currentValues.value + 1); // add 1 to inputValue
														} else if (e.key === 'ArrowDown') {
															commitChange(currentValues.value - 1); // subtract 1 to inputValue
														}
													} else if (
														!inputValueIsNumeric &&
														e.key === 'Enter'
													) {
														e.preventDefault();

														// If input is empty, avoid NaN by setting value to 0
														if (inputValue === '') setValue('value', 0);
														else {
															try {
																// Otherwise evalutate input as an expression
																const calculatedValue = evaluate(inputValue);

																// ^ `evaluate` may return an object
																if (isNaN(calculatedValue)) {
																	// Got an object! Restore the last valid value
																	commitChange(currentValues.value);
																} else {
																	// Commit calculated value
																	commitChange(round(calculatedValue, 0.01));
																}
															} catch {
																// Evaluation failed, restore the last valid value
																commitChange(currentValues.value);
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
											const convertedValue = convertFromSqft(
												e.target.value,
												{ ...currentValues, value: quickCalc.unroundedArea },
												product.details,
												sku,
											);

											setValue('value', convertedValue);
											setValue('_quickCalcValue', convertedValue.toString());
										},
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

						{/* Total Preview */}
						<div className="flex flex-wrap justify-between">
							<select
								className="bg-transparent"
								{...register('deliveryLocation')}
							>
								<option value="factory">Factory Pickup</option>
								<option value="showroom">Showroom Pickup</option>
							</select>
							{!showWork && (
								<p
									className="whitespace-nowrap"
									onClick={() => setShowWork(true)}
								>
									<label htmlFor="quickcalc-total">Total: </label>
									<output id="quickcalc-total" htmlFor="quickcalc-value">
										{formatPrice(quickCalc.total)}
									</output>
								</p>
							)}
						</div>

						{/* Show on toggle click with total*/}
						{showWork && (
							<ul
								onClick={() => setShowWork(false)}
								className="space-y-2 tabular-nums text-zinc-500"
							>
								<li className="flex flex-wrap justify-between">
									<label htmlFor="quickcalc-rounded-area">
										Calculated Area:
									</label>
									<output id="quickcalc-rounded-area" htmlFor="quickcalc-value">
										{numberFormatter.format(quickCalc.unroundedArea)} sqft
									</output>
								</li>
								<li className="flex flex-wrap justify-between">
									<label htmlFor="quickcalc-rounded-area">
										Minimum Viable Area:
									</label>
									<output id="quickcalc-rounded-area" htmlFor="quickcalc-value">
										{numberFormatter.format(quickCalc.roundedArea)} sqft
									</output>
								</li>
								<li className="flex flex-wrap justify-between">
									<label htmlFor="quickcalc-rounded-area">Subtotal</label>
									<output id="quickcalc-rounded-area" htmlFor="quickcalc-value">
										${priceFormatter.format(quickCalc.subtotal)}
									</output>
								</li>
								<li className="flex flex-wrap justify-between">
									<label htmlFor="quickcalc-rounded-area">Tax</label>
									<output id="quickcalc-rounded-area" htmlFor="quickcalc-value">
										${priceFormatter.format(quickCalc.tax)}
									</output>
								</li>
								<li className="flex flex-wrap justify-between text-rose-600">
									<label htmlFor="quickcalc-rounded-area">Total</label>
									<output id="quickcalc-rounded-area" htmlFor="quickcalc-value">
										${priceFormatter.format(quickCalc.total)}
									</output>
								</li>
							</ul>
						)}

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
						{product.details.map((detail) => (
							<li
								key={detail.id}
								className="flex justify-between rounded-md px-4 py-3 odd:bg-white even:bg-zinc-100"
							>
								<p>{detail.display_name}</p>
								<p>{formatProductDetail(detail)}</p>
							</li>
						))}
					</ul>
				</section>

				{/* Product Gallery */}
				<section className="space-y-4">
					<SectionHeader title="Product Gallery" />

					<ul className="no-scrollbar -mx-8 flex snap-x snap-mandatory space-x-2 overflow-x-scroll px-4">
						<li className="shrink-0 basis-2"></li>

						{product.gallery.map(({ id, img_url }) => (
							<li
								key={id}
								className="relative h-64 shrink-0 basis-full snap-center overflow-hidden rounded-lg bg-zinc-100"
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									className="min-h-full min-w-full"
									src={img_url}
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
					<SectionHeader title={`Similar to ${product.display_name}`} />

					<div className="-mx-4 flex flex-col items-center space-y-8">
						<ul className="grid w-full grid-cols-2 gap-2">
							{product.similar.map(({ id, display_name, price }) => (
								<li key={id} className="items-center space-y-2">
									<div className="aspect-w-1 aspect-h-1 w-full rounded-lg bg-zinc-100" />

									<div>
										<h3 className="text-center font-semibold">
											{display_name}
										</h3>
										<p className="text-center text-zinc-500">
											from {formatPrice(price)}
										</p>
									</div>
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

export const getServerSideProps: GetServerSideProps<
	{},
	{ sku: string }
> = async ({ query }) => {
	let redirect: Redirect | undefined = undefined;

	const skuID = `${product.id}:${query.sku}`;

	const sku = skuList.find((sku) => {
		return sku.id === skuID;
	});

	if (!sku) redirect = { destination: '?sku=grey', permanent: false };

	return {
		redirect,
		props: { initialSKU: sku, product: product },
	};
};

export default Page;
