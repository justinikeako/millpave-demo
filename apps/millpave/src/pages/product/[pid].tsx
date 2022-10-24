import type { NextPage } from 'next';
import Head from 'next/head';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from '../../components/button';
import { differenceInCalendarDays, format } from 'date-fns';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import NextError from 'next/error';
import { RestockQueueElement, SKU, Stock } from '../../types/product';
import Link from 'next/link';
import SkuPicker from '../../components/sku-picker';
import QuickCalc from '../../components/quick-calc';
import {
	formatNumber,
	formatPrice,
	formatRelativeUpdate
} from '../../utils/format';
import Icon from '../../components/icon';
import { PickupLocation } from '@prisma/client';
import { ErrorBoundary } from 'react-error-boundary';
import {
	Toast,
	ToastAction,
	ToastTitle,
	ToastViewport
} from '../../components/toast';
import { ToastProvider } from '@radix-ui/react-toast';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader
} from '../../components/dialog';

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

const ProductViewer = dynamic(
	() => import('../../components/product-model-viewer'),
	{
		ssr: false,
		loading: () => (
			<div className="flex w-full flex-1 items-center justify-center">
				<p>Loading 3D Model...</p>
			</div>
		)
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

type AddToProps = {
	onCreate: () => void;
	onAdd: (id: string) => void;
};

const AddTo = ({ onCreate, onAdd }: AddToProps) => {
	const recentQuotesRequest = trpc.useQuery(['quote.getAll'], {
		refetchOnWindowFocus: false
	});

	// const [maxShownQuotes, setMaxShownQuotes] = useState(2);

	return (
		<>
			<div className="space-y-8 pt-4">
				<Button
					variant="secondary"
					className="w-full text-bubblegum-700"
					onClick={onCreate}
				>
					<Icon name="add" />
					<span className="font-semibold">Create New Order</span>
				</Button>

				<div className="space-y-2">
					<div className="flex justify-between">
						<h3 className="font-bold">Recent Orders</h3>
						<Button
							variant="tertiary"
							onClick={() => recentQuotesRequest.refetch()}
						>
							<Icon name="refresh" opticalSize={20} className="text-lg" />
						</Button>
					</div>

					{recentQuotesRequest.isLoading && <p>Loading...</p>}
					{recentQuotesRequest.data && (
						<>
							<ul className="-mx-4 space-y-1">
								{recentQuotesRequest.data.map((quote) => (
									<li
										key={quote.id}
										className="flex space-x-2 px-4 py-2"
										onClick={() => onAdd(quote.id)}
									>
										<Icon name="request_quote" weight={300} />

										<div className="w-[calc(100%-32px)]">
											<div className="flex items-center justify-between">
												<h4>{quote.title}</h4>
												<time className="text-sm">
													{formatRelativeUpdate(quote.updatedAt)}
												</time>
											</div>

											<p className="overflow-hidden text-ellipsis whitespace-nowrap text-gray-500">
												{quote.items.length > 0
													? quote.items
															.map((item) => item.displayName)
															.toString()
															.replace(/,/, ', ')
													: 'No items yet.'}
											</p>
										</div>
									</li>
								))}
							</ul>

							{recentQuotesRequest.data.length > 2 && (
								<div className="flex w-full justify-center">
									<DialogClose asChild>
										<Button variant="tertiary" className=" text-bubblegum-700">
											<Icon name="expand_more" />
											See more
										</Button>
									</DialogClose>
								</div>
							)}
							{recentQuotesRequest.data.length === 0 && (
								<p className="text-slate-500">No recent quotes.</p>
							)}
						</>
					)}
				</div>
			</div>
		</>
	);
};

const Page: NextPage = () => {
	const router = useRouter();

	const productId = router.query.pid as string;

	const skuIdFragment = (router.query.sku as string).replace(/ /gs, ':');
	const skuId = `${productId}:${skuIdFragment}`;

	const product = trpc.useQuery(['product.get', { productId }], {
		refetchOnWindowFocus: false
	});

	const createQuote = trpc.useMutation(['quote.create']);
	const addItemToQuote = trpc.useMutation(['quote.addItemTo']);

	const formMethods = useForm<FormValues>({
		defaultValues: {
			skuId: skuId,
			area: 0,
			pickupLocation: 'FACTORY'
		}
	});

	const [dialogOpen, setDialogOpen] = useState(false);
	const [toastState, setToastState] = useState({
		open: false,
		type: 'new',
		quoteId: ''
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
		const productNotFound = product.error?.data?.code === 'NOT_FOUND';
		const skuNotFound = product.isSuccess && !currentSKU;

		if (productNotFound || skuNotFound) return <NextError statusCode={404} />;

		return null;
	}

	const skuPrice = currentSKU.price + (pickupLocation === 'SHOWROOM' ? 20 : 0);

	return (
		<>
			<Head>
				<title>{`${currentSKU.display_name} — Millennium Paving Stones`}</title>
			</Head>

			<ToastProvider duration={5000} swipeDirection="left">
				<Toast
					open={toastState.open}
					onOpenChange={(isOpen) =>
						setToastState((toastState) => ({ ...toastState, open: isOpen }))
					}
				>
					<ToastTitle>Added to quote</ToastTitle>
					<ToastAction altText="View Quote" asChild>
						<Link
							className="font-semibold"
							href={`/quote/${toastState.quoteId}`}
						>
							View
						</Link>
					</ToastAction>
				</Toast>

				<ToastViewport />
			</ToastProvider>

			{/* Canvas */}
			<main className="-z-10 flex h-[75vh] flex-col bg-gray-100 pb-16">
				<div className="inset-x-0 flex justify-between px-8 pt-8">
					<Button variant="tertiary" asChild>
						<Link href="/products">
							<Icon name="category" />
						</Link>
					</Button>
					<Button variant="tertiary" asChild>
						<Link href="/quotes">
							<Icon name="garden_cart" />
						</Link>
					</Button>
				</div>
				<ErrorBoundary
					fallbackRender={() => (
						<div className="flex w-full flex-1 items-center justify-center">
							<p>Model failed to load. Refresh page to try again.</p>
						</div>
					)}
				>
					<ProductViewer sku={currentSKU} />
				</ErrorBoundary>
			</main>

			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent open={dialogOpen}>
					<DialogHeader title="Add item to quote" />
					<AddTo
						onCreate={() => {
							createQuote.mutate(formMethods.watch(), {
								onSuccess(quoteId) {
									setToastState({
										type: 'new',
										quoteId: quoteId,
										open: true
									});

									setDialogOpen(false);
								}
							});
						}}
						onAdd={(id) => {
							addItemToQuote.mutate(
								{ id, item: formMethods.watch() },
								{
									onSuccess(quoteId) {
										setToastState({
											type: 'existing',
											quoteId: quoteId,
											open: true
										});

										setDialogOpen(false);
									}
								}
							);
						}}
					/>
				</DialogContent>

				{/* Bottom Sheet */}
				<aside className="relative -mt-8 space-y-12 rounded-2xl bg-white px-8 pb-16 pt-12">
					{/* Header */}
					<section className="space-y-2">
						<p>{product.data.category.display_name}</p>
						<h1 className="font-display text-xl font-semibold leading-tight">
							{currentSKU.display_name}
						</h1>
						<div className="flex flex-wrap justify-between text-gray-500">
							<p>{formatPrice(skuPrice)}/sqft</p>

							<div className="flex space-x-1">
								<Stock
									fulfillment={product.data}
									pickupLocation={pickupLocation}
									skuId={skuId}
								/>

								<div>
									<Button variant="tertiary">
										<Icon name="info" weight={300} />
									</Button>
								</div>
							</div>
						</div>
					</section>

					<FormProvider {...formMethods}>
						<form
							key={productId}
							className="space-y-4"
							onSubmit={formMethods.handleSubmit(() => {
								setDialogOpen(true);
							})}
						>
							<div className="space-y-12">
								{/* Color Picker */}
								<SkuPicker
									control={formMethods.control}
									value={skuId}
									product={product.data}
									header={SectionHeader}
									onChange={(newSkuFragments) => {
										const newSkuQuery = newSkuFragments.join('+');
										router.replace(
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
							</div>

							<div className="flex flex-col space-y-2">
								<Button
									type="submit"
									variant="primary"
									disabled={formMethods.watch().area <= 0}
								>
									<span className="font-semibold">Add to Quote</span>
								</Button>
							</div>
						</form>
					</FormProvider>

					{/* Product Details */}
					<section className="space-y-4">
						<SectionHeader title="Product Details" />

						<ul className="-mx-4">
							<li className="flex justify-between rounded-md px-4 py-3 odd:bg-white even:bg-gray-100">
								<p>Dimensions</p>
								<p>
									{productDetails.dimensions[0]} in x{' '}
									{productDetails.dimensions[1]} in x{' '}
									{productDetails.dimensions[2]} in
								</p>
							</li>
							<li className="flex justify-between rounded-md px-4 py-3 odd:bg-white even:bg-gray-100">
								<p>Weight per unit</p>
								<p>{productDetails.lbs_per_unit} lbs</p>
							</li>
							<li className="flex justify-between rounded-md px-4 py-3 odd:bg-white even:bg-gray-100">
								<p>Area per pallet</p>
								<p>{productDetails.sqft_per_pallet} sqft</p>
							</li>
							<li className="flex justify-between rounded-md px-4 py-3 odd:bg-white even:bg-gray-100">
								<p>Units per pallet</p>
								<p>{productDetails.units_per_pallet}</p>
							</li>
							<li className="flex justify-between rounded-md px-4 py-3 odd:bg-white even:bg-gray-100">
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
									className="relative h-64 shrink-0 basis-full snap-center overflow-hidden rounded-lg bg-gray-100"
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
										className="absolute left-4 bottom-4 text-white drop-shadow-lg"
									>
										<Icon name="info" />
									</Button>
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
											<div className="aspect-w-1 aspect-h-1 w-full rounded-lg bg-gray-100" />

											<div>
												<h3 className="text-center font-semibold">
													{product.display_name}
												</h3>
												<p className="text-center text-gray-500">
													from {formatPrice(product.price)}
												</p>
											</div>
										</Link>
									</li>
								))}
							</ul>

							<Button variant="tertiary" className="text-bubblegum-700" asChild>
								<Link href="/products">
									<Icon name="expand_more" />
									<span>Show more products</span>
								</Link>
							</Button>
						</div>
					</section>
				</aside>
			</Dialog>
		</>
	);
};

export default Page;
