import type { NextPage } from 'next';
import Head from 'next/head';
import { FC, PropsWithChildren, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Button from '../../components/button';
import { differenceInCalendarDays, format } from 'date-fns';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import NextError from 'next/error';
import {
	PickupLocation,
	RestockQueueElement,
	SKU,
	Stock
} from '../../types/product';
import Link from 'next/link';
import SkuPicker from '../../components/sku-picker';
import QuickCalc from '../../components/quick-calc';
import { formatNumber, formatPrice } from '../../utils/format';

function formatRestockDate(date: number) {
	const difference = differenceInCalendarDays(date, new Date());

	if (date === -1) return 'Out of Stock';
	else if (difference === 0) return format(date, "'Restocks at' h:mm bbb");
	else if (difference === 1) return 'Restocks Tomorrow';

	return format(date, "'Restocks' EEE, LLL d");
}

type FormValues = {
	skuId: string;
	area: number;
	pickupLocation: PickupLocation;
};

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

const ProductModelViewer = dynamic(
	() => import('../../components/product-model-viewer'),
	{
		ssr: false,
		loading: () => <p>Loading...</p>
	}
);

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

	const formMethods = useForm<FormValues>({
		defaultValues: {
			skuId: skuId,
			area: 0,
			pickupLocation: 'factory'
		}
	});

	useEffect(() => {
		formMethods.reset();
	}, [formMethods, productId]);

	const { pickupLocation } = formMethods.watch();

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

	return (
		<>
			<Head>
				<title>{`${currentSKU.display_name} — Millennium Paving Stones`}</title>
			</Head>

			{/* Canvas */}
			<main className="flex h-[75vh] flex-col bg-zinc-100 pb-16">
				<ProductModelViewer sku={currentSKU} />
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

				<FormProvider {...formMethods}>
					<form
						key={productId}
						className="space-y-12"
						onSubmit={formMethods.handleSubmit(console.log)}
					>
						{/* Color Picker */}
						<SkuPicker
							control={formMethods.control}
							value={skuId}
							product={product.data}
							header={SectionHeader}
							onChange={(newSkuFragments) => {
								const newSkuQuery = newSkuFragments.join('+');
								router.push(
									`/product/${productId}?sku=${newSkuQuery}`,
									undefined,
									{
										shallow: true,
										scroll: false
									}
								);
							}}
						/>

						{/* QuickCalc */}
						<QuickCalc
							control={formMethods.control}
							convertConfig={{
								skuPrice,
								productDetails,
								pickupLocation
							}}
							header={SectionHeader}
						/>
					</form>
				</FormProvider>

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
							className="text-pink-600"
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
