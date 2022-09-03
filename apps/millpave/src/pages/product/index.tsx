import type { NextPage } from 'next';
import Head from 'next/head';
import { FC, PropsWithChildren, Suspense, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../components/button';
import { addDays, differenceInCalendarDays, format } from 'date-fns';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

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

type Price = { value: number; currency: 'JMD'; type: 'base' | 'standalone' };

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
	closest_restock_date: Date;
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
			unit: 'in'
		},
		{
			type: 'basic',
			id: 'weight_per_unit',
			display_name: 'Weight per unit',
			value: 5,
			unit: 'lbs'
		},
		{
			type: 'basic',
			id: 'area_per_pallet',
			display_name: 'Area per pallet',
			value: 128.755,
			unit: 'sqft'
		},
		{
			type: 'basic',
			id: 'units_per_pallet',
			display_name: 'Units per pallet',
			value: 600,
			unit: null
		},
		{
			type: 'basic',
			id: 'pcs_per_sqft',
			display_name: 'Pieces per sqft',
			value: 4.66,
			unit: null
		}
	],
	gallery: [
		{
			id: '32kjrl',
			img_url:
				'http://mobileimages.lowes.com/productimages/e17627ec-4502-40ad-8f2c-21d1f7e53c11/43213000.jpg'
		},
		{
			id: '08reif',
			img_url:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZbfAPwMpsFKxnnD3Q-Zq4NS_jOcdiDROoqjHBUrGcN10K_VlZPPzsRxh4fwYxT2Ec0lU&usqp=CAU'
		},
		{
			id: 'ca09u3',
			img_url:
				'https://i.pinimg.com/originals/b0/65/13/b06513eb47b0917940f8930b98c0021e.jpg'
		}
	],
	similar: [
		{
			id: 'banjo',
			display_name: 'Banjo',
			price: { value: 228, currency: 'JMD', type: 'base' }
		},
		{
			id: 'heritage_regular',
			display_name: 'Heritage Regular',
			price: { value: 228, currency: 'JMD', type: 'base' }
		}
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
					hex: 'E7C769'
				},
				{ id: 'yellow', display_name: 'Yellow', hex: 'E7DD69' },
				{ id: 'green', display_name: 'Green', hex: 'A9D786' }
			]
		}
	]
};

// Mock SKUs
const skus: SKU[] = [
	{
		id: 'colonial_classic:grey',
		display_name_modifier: 'Grey',
		price: { value: 203, currency: 'JMD', type: 'standalone' } as Price,
		current_stock: { value: 175, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 3)
	},
	{
		id: 'colonial_classic:ash',
		display_name_modifier: 'Ash',
		price: { value: 228, currency: 'JMD', type: 'standalone' } as Price,
		current_stock: { value: 0, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 3)
	},
	{
		id: 'colonial_classic:charcoal',
		display_name_modifier: 'Charcoal',
		price: { value: 228, currency: 'JMD', type: 'standalone' } as Price,
		current_stock: { value: 0, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 3)
	},
	{
		id: 'colonial_classic:spanish_brown',
		display_name_modifier: 'Spanish Brown',
		price: { value: 228, currency: 'JMD', type: 'standalone' } as Price,
		current_stock: { value: 0, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 3)
	},
	{
		id: 'colonial_classic:sunset_taupe',
		display_name_modifier: 'Sunset Taupe',
		price: { value: 228, currency: 'JMD', type: 'standalone' } as Price,
		current_stock: { value: 0, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 3)
	},
	{
		id: 'colonial_classic:tan',
		display_name_modifier: 'Tan',
		price: { value: 228, currency: 'JMD', type: 'standalone' } as Price,
		current_stock: { value: 0, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 3)
	},
	{
		id: 'colonial_classic:shale_brown',
		display_name_modifier: 'Shale Brown',
		price: { value: 228, currency: 'JMD', type: 'standalone' } as Price,
		current_stock: { value: 0, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 3)
	},
	{
		id: 'colonial_classic:sunset_clay',
		display_name_modifier: 'Sunset Clay',
		price: { value: 228, currency: 'JMD', type: 'standalone' } as Price,
		current_stock: { value: 0, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 3)
	},
	{
		id: 'colonial_classic:red',
		display_name_modifier: 'Red',
		price: { value: 228, currency: 'JMD', type: 'standalone' } as Price,
		current_stock: { value: 0, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 3)
	},
	{
		id: 'colonial_classic:terracotta',
		display_name_modifier: 'Terracotta',
		price: { value: 228, currency: 'JMD', type: 'standalone' } as Price,
		current_stock: { value: 0, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 3)
	},
	{
		id: 'colonial_classic:orange',
		display_name_modifier: 'Orange',
		price: { value: 228, currency: 'JMD', type: 'standalone' } as Price,
		current_stock: { value: 0, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 3)
	},
	{
		id: 'colonial_classic:sunset_tangerine',
		display_name_modifier: 'Sunset Tangerine',
		price: { value: 228, currency: 'JMD', type: 'standalone' } as Price,
		current_stock: { value: 0, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 3)
	},
	{
		id: 'colonial_classic:yellow',
		display_name_modifier: 'Yellow',
		price: { value: 233, currency: 'JMD', type: 'standalone' } as Price,
		current_stock: { value: 0, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 3)
	},
	{
		id: 'colonial_classic:green',
		display_name_modifier: 'Green',
		price: { value: 363, currency: 'JMD', type: 'standalone' } as Price,
		current_stock: { value: 0, unit: 'sqft' },
		closest_restock_date: addDays(new Date(), 3)
	}
];

function formatRestockDate(date: Date) {
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

const numberFormatter = new Intl.NumberFormat('en', {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});

function formatPrice({ type, value }: Price) {
	const price = numberFormatter.format(value);

	if (type === 'base') return `from $` + price;

	return '$' + price;
}

function formatStock(stock: Stock) {
	return `${stock.value} ${stock.unit} available`;
}

type FormValues = {
	color: string;
	quantity: number;
	unit: Unit;
	deliveryLocation: DeliveryLocation;
};

function roundToNearest(value: number, multpile: number) {
	return Math.ceil(value / multpile) * multpile;
}

function calculateTotal(
	{ quantity, unit, deliveryLocation }: FormValues,
	detailArr: Detail[],
	sku: SKU
) {
	const sqft_per_pallet = extractBasicProductDetailValue(
		detailArr,
		'area_per_pallet'
	);
	const pcs_per_sqft = extractBasicProductDetailValue(
		detailArr,
		'pcs_per_sqft'
	);

	const sku_price = sku.price.value;

	const calculateSubtotal: {
		[key in DeliveryLocation]: (sqft: number) => number;
	} = {
		factory: (sqft) => sqft * sku_price * 0.985,
		showroom: (sqft) => sqft * (sku_price + 20)
	};

	const getGCT = (subtotal: number) => subtotal * 0.15;
	const removeGCT = (total: number) => total / 1.15;

	const calculateTotalInverse: {
		[key in DeliveryLocation]: (price: number, sku: SKU) => number;
	} = {
		factory: (price, sku) => removeGCT(price / sku.price.value / 0.985),
		showroom: (price, sku) => removeGCT(price) / (sku.price.value + 20)
	};

	const convertToSqftFrom: {
		[key in Unit]: (num: number, sku: SKU) => number;
	} = {
		sqft: (num) => num,
		sqin: (num) => num / 12,
		sqm: (num) => num * 3.281,
		sqcm: (num) => num / 30.48,
		pal: (num) => num * sqft_per_pallet,
		pcs: (num) => num / pcs_per_sqft,
		jmd: (num, sku) => calculateTotalInverse[deliveryLocation](num, sku)
	};

	const rawArea = convertToSqftFrom[unit](quantity, sku) || 0;

	const roundingFunction: {
		[key in DeliveryLocation]: (num: number) => number;
	} = {
		factory: (num) => roundToNearest(num, sqft_per_pallet / 2),
		showroom: (num) => roundToNearest(num, 1 / pcs_per_sqft)
	};

	const minimumViableArea = roundingFunction[deliveryLocation](rawArea);

	const quantityInSqft = minimumViableArea || 0;

	let subtotal = calculateSubtotal[deliveryLocation](quantityInSqft);

	const total = subtotal + getGCT(subtotal);

	return {
		rawArea,
		minimumViableArea,
		total: {
			value: total,
			currency: 'JMD',
			type: 'standalone'
		} as Price
	};
}

function convertFromSqft(
	unit: Unit,
	{ quantity, deliveryLocation, color }: FormValues,
	detailArr: Detail[],
	sku: SKU
) {
	const sqft_per_pallet = extractBasicProductDetailValue(
		detailArr,
		'area_per_pallet'
	);
	const pcs_per_sqft = extractBasicProductDetailValue(
		detailArr,
		'pcs_per_sqft'
	);

	const convertFromSqftTo: {
		[key in Unit]: (num: number) => number;
	} = {
		sqft: (num) => num,
		sqin: (num) => num * 12,
		sqm: (num) => num / 3.281,
		sqcm: (num) => num * 30.48,
		pal: (num) => num / sqft_per_pallet,
		pcs: (num) => num * pcs_per_sqft,
		jmd: (num) => {
			return calculateTotal(
				{ quantity: num, unit: 'sqft', deliveryLocation, color },
				detailArr,
				sku
			).total.value;
		}
	};

	return convertFromSqftTo[unit](quantity);
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

const LazyProductGallery = dynamic(
	() => import('../../components/product-page-gallery'),
	{ ssr: false, suspense: true }
);

const Page: NextPage = () => {
	const router = useRouter();

	const [sku, setSKU] = useState<SKU>();

	useEffect(() => {
		try {
			const foundSKU = skus.find((sku) => {
				return sku.id === `${product.id}:${router.query.sku || 'grey'}`;
			});

			if (!foundSKU)
				throw new Error(`SKU '${router.query.sku}' does not exist.`);

			setSKU(foundSKU);
		} catch (err) {
			throw err;
		}
	}, [router]);

	const { watch, register, setValue, handleSubmit } = useForm<FormValues>({
		defaultValues: {
			unit: 'sqft',
			deliveryLocation: 'showroom',
			color: 'grey'
		}
	});

	if (!sku) return null;

	// TODO: Find a better name for the constant and the function
	const d = calculateTotal(watch(), product.details, sku);

	return (
		<>
			<Head>
				<title>
					{`${product.display_name} ${sku.display_name_modifier}  — Millennium Paving Stones`}
				</title>
			</Head>

			{/* Canvas */}
			<main className="flex h-[75vh] flex-col bg-neutral-100 pb-16">
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
					<div className="flex justify-between">
						<p>{formatPrice(sku.price)}/sqft</p>

						<div className="flex space-x-1">
							{sku.current_stock.value > 0 ? (
								<p>{formatStock(sku.current_stock)}</p>
							) : (
								<p>Restocks {formatRestockDate(sku.closest_restock_date)}</p>
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
							<p className="text-sm">Color Guide</p>
						</SectionHeader>

						<ul className="grid grid-cols-8 gap-2">
							{product.sku_modifier_list[0]?.modifiers.map(({ id, hex }) => (
								<li key={id} className="contents">
									<label htmlFor={id} className="aspect-w-1 aspect-h-1">
										<input
											{...register('color', {
												onChange: (e) =>
													router.push(`?sku=${e.target.value}`, undefined, {
														scroll: false
													})
											})}
											className="peer hidden"
											type="radio"
											value={id}
											id={id}
										/>
										<div
											className=" rounded-full border border-neutral-300 shadow-[inset_0_0_0_2px_white] peer-checked:border-black"
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
								className="flex flex-1 space-x-2 rounded-md border border-neutral-300 p-4 focus-within:border-black"
							>
								<input
									{...register('quantity')}
									id="quickcalc-value"
									type="number"
									step="any"
									min={0}
									placeholder="Quantity"
									className="w-[100%] placeholder-neutral-500 outline-none"
								/>
							</label>

							<label
								htmlFor="quickcalc-unit"
								className="flex space-x-2 rounded-md border border-neutral-300 p-4 focus-within:border-black"
							>
								<select
									{...register('unit', {
										onChange: (e) => {
											setValue(
												'quantity',
												convertFromSqft(
													e.target.value,
													{ ...watch(), quantity: d.rawArea },
													product.details,
													sku
												)
											);
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

						{/* Total Preview */}
						<div className="flex flex-wrap justify-between">
							<select
								className="bg-transparent"
								{...register('deliveryLocation')}
							>
								<option value="factory">Factory Pickup</option>
								<option value="showroom">Showroom Pickup</option>
							</select>
							<p className="whitespace-nowrap">
								<output htmlFor="quickcalc-value">
									Total: {formatPrice(d.total)}
								</output>
							</p>
						</div>

						<p className="whitespace-nowrap">
							<output htmlFor="quickcalc-value">
								Minimum Viable Area:{' '}
								{numberFormatter.format(d.minimumViableArea)} sqft
							</output>
						</p>

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
								className="flex justify-between rounded-md px-4 py-3 odd:bg-white even:bg-neutral-100"
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
								className="relative h-64 shrink-0 basis-full snap-center overflow-hidden rounded-lg bg-neutral-100"
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
									<div className="aspect-w-1 aspect-h-1 w-full rounded-lg bg-neutral-100" />

									<div>
										<h3 className="text-center font-semibold">
											{display_name}
										</h3>
										<p className="text-center">{formatPrice(price)}</p>
									</div>
								</li>
							))}
						</ul>

						<Button variant="tertiary" iconRight="expand_more">
							Show more products
						</Button>
					</div>
				</section>
			</aside>
		</>
	);
};

export default Page;
