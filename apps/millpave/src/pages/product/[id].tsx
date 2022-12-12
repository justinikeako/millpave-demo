import Head from 'next/head';
import SkuPicker from '../../components/sku-picker';
import { ProductCard } from '../../components/product-card';
import { Button } from '../../components/button';
import Link from 'next/link';
import NextError from 'next/error';
import { Sku } from '@prisma/client';
import { ExtendedPaverDetails } from '../../types/product';
import { trpc } from '../../utils/trpc';
import classNames from 'classnames';
import { PaverEstimator } from '../../components/estimator';
import { Suspense, useState } from 'react';
import { Icon } from '../../components/icon';
import { InspirationSection } from '../../sections/inspiration';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import superjson from 'superjson';
import {
	formatPrice,
	formatNumber,
	formatRestockDate
} from '../../utils/format';
import { createContextInner } from '../../server/trpc/context';
import { GetStaticPaths, GetStaticPropsContext } from 'next';
import { appRouter } from '../../server/trpc/router/_app';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const ProductViewer3D = dynamic(
	() => import('../../components/product-viewer-3d'),
	{
		suspense: true
	}
);

type GalleryProps = {
	sku: Sku;
};

function Gallery({ sku }: GalleryProps) {
	const images = [0, 0, 0, 0];

	const [selectedIndex, setSelectedIndex] = useState(0);
	return (
		<main className="flex flex-col items-center gap-2 md:sticky md:top-8 md:flex-[2] lg:flex-[3]">
			<div className="relative aspect-square w-full bg-gray-200">
				{selectedIndex === 3 && (
					<Suspense
						fallback={
							<div className="grid h-full w-full place-items-center">
								<p>Loading 3D Model</p>
							</div>
						}
					>
						<ProductViewer3D
							skuId={sku.id}
							displayName={sku.displayName}
							// description={'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas error optio, molestias assumenda recusandae dolorem corporis animi eius incidunt quibusdam.'}
						/>
					</Suspense>
				)}

				{selectedIndex !== 3 && (
					<Button
						variant="secondary"
						className="absolute bottom-4 right-4 px-2"
					>
						<Icon name="fullscreen" />
					</Button>
				)}
			</div>
			<div className="flex w-full justify-center gap-2">
				{images.map((_, index) => {
					const id = 'image-' + index;

					return (
						<div key={id} className="contents">
							<input
								type="radio"
								name="currentImage"
								id={id}
								className="peer hidden"
								checked={index === selectedIndex}
								onChange={() => setSelectedIndex(index)}
							/>

							<label
								htmlFor={id}
								className="flex aspect-square max-w-[80px] flex-1 shrink-0 items-center justify-center border border-gray-200 bg-gray-200 text-lg text-gray-400 inner-border-2 inner-border-white peer-checked:border-2 peer-checked:border-black"
							>
								{index === 3 && '3D'}
							</label>
						</div>
					);
				})}
			</div>
		</main>
	);
}

type ProductStockProps = {
	productId: string;
	skuId: string;
};

function ProductStock({ productId, skuId }: ProductStockProps) {
	const fulfillmentQuery = trpc.product.getFulfillmentData.useQuery(
		{ productId },
		{ refetchOnWindowFocus: false }
	);

	const fulfillment = fulfillmentQuery.data;

	if (!fulfillment) {
		return <p>Loading Stock Info...</p>;
	}

	const currentStock = fulfillment.stock.reduce((totalQuantity, item) => {
		if (item.skuId !== skuId) return totalQuantity;

		return totalQuantity + item.quantity;
	}, 0);

	const closestRestock = fulfillment.restock
		.filter((restock) => restock.skuId === skuId)
		.reduce<Date | undefined>((closestDate, curr) => {
			// If closestDate isn't defined or the current item's date is closer, return the current date.
			if (!closestDate || curr.date < closestDate) {
				return curr.date;
			}

			// Otherwise the
			return closestDate;
		}, undefined);

	return currentStock > 0 ? (
		<p>{formatNumber(currentStock)} units available</p>
	) : (
		<p>{formatRestockDate(closestRestock)}</p>
	);
}

type SectionProps = {
	heading: string;
} & React.HTMLAttributes<HTMLElement>;

function Section({
	heading,
	children,
	...props
}: React.PropsWithChildren<SectionProps>) {
	return (
		<section className={classNames('space-y-2', props.className)}>
			<h2 className="text-lg">{heading}</h2>
			{children}
		</section>
	);
}

const findDetails = (skuId?: string, details?: ExtendedPaverDetails[]) => {
	return details?.find((details) => skuId?.includes(details.matcher));
};

function findSKU(searchId?: string, skus?: Sku[]) {
	return skus?.find((currentSku) => currentSku.id === searchId);
}

function Page() {
	const productId = useRouter().query.id as string;

	const productQuery = trpc.product.getById.useQuery(
		{ productId },
		{ refetchOnWindowFocus: false }
	);

	const product = productQuery.data;

	const [skuId, setSkuId] = useState(product?.defaultSkuId);
	const currentSku = findSKU(skuId, product?.skus);
	const productDetails = findDetails(skuId, product?.details);

	if (!product || !currentSku || !productDetails || !skuId) {
		const productNotFound = productQuery.error?.data?.code === 'NOT_FOUND';

		if (productNotFound) return <NextError statusCode={404} />;

		return null;
	}

	return (
		<>
			<Head>
				<title>{`${product.displayName} — Millennium Paving Stones`}</title>
			</Head>

			<div className="space-y-32 px-8 md:px-24 lg:px-32">
				{/* Main Content */}
				<div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-16 lg:gap-32">
					{/* Gallery */}
					<Gallery sku={currentSku} />

					{/* Supporting Details */}
					<aside className="space-y-8 md:flex-[3] lg:flex-[4] lg:space-y-12">
						{/* Basic Info */}
						<section className="space-y-2">
							<h1 className="font-display text-4xl">{product.displayName}</h1>
							<div className="flex flex-wrap justify-between text-lg">
								<div className="flex items-center gap-4">
									<p>
										{formatPrice(currentSku.price)} per {currentSku.unit}
									</p>
									<div className="h-8 w-[2px] bg-current" />
									<p>
										{formatPrice(
											currentSku.price / productDetails.data.pcs_per_sqft
										)}
										&nbsp;per unit
									</p>
								</div>

								<ProductStock productId={productId} skuId={skuId} />
							</div>
						</section>

						{/* Description */}
						<Section heading="Description">
							<p>{product.description}</p>
						</Section>

						{/* Sku Picker */}
						<SkuPicker
							value={skuId}
							skuIdTemplateFragments={product.skuIdFragments}
							section={Section}
							onChange={(newSkuId) => {
								setSkuId(newSkuId);
							}}
						/>

						{/* Paver Estimator */}
						<PaverEstimator
							paverDetails={productDetails.data}
							sku={currentSku}
						/>

						{/* Specifications */}
						<Section heading="Specifications">
							<ul>
								<li className="flex justify-between rounded-sm px-4 py-3 odd:bg-white even:bg-gray-100">
									<p>Dimensions</p>
									<p>
										{productDetails.data.dimensions[0]} in x&nbsp;
										{productDetails.data.dimensions[1]} in x&nbsp;
										{productDetails.data.dimensions[2]} in
									</p>
								</li>
								<li className="flex justify-between rounded-sm px-4 py-3 odd:bg-white even:bg-gray-100">
									<p>Weight per unit</p>
									<p>{productDetails.data.lbs_per_unit} lbs</p>
								</li>
								<li className="flex justify-between rounded-sm px-4 py-3 odd:bg-white even:bg-gray-100">
									<p>Area per pallet</p>
									<p>{productDetails.data.sqft_per_pallet} sqft</p>
								</li>
								<li className="flex justify-between rounded-sm px-4 py-3 odd:bg-white even:bg-gray-100">
									<p>Units per pallet</p>
									<p>{productDetails.data.units_per_pallet}</p>
								</li>
								<li className="flex justify-between rounded-sm px-4 py-3 odd:bg-white even:bg-gray-100">
									<p>Pieces per sqft</p>
									<p>{productDetails.data.pcs_per_sqft}</p>
								</li>
							</ul>
						</Section>
					</aside>
				</div>

				{/* Similar Products */}
				<section className="flex flex-col space-y-8">
					<h2 className="max-w-[28ch] self-center text-center font-display text-2xl">
						Similar to {product.displayName}
					</h2>

					<div className="flex flex-col space-y-8">
						<ul className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-8">
							{product.similar.map((similarProduct) => (
								<ProductCard
									key={similarProduct.id}
									name={similarProduct.displayName}
									startingPrice={similarProduct.startingSku.price}
									link={`/product/${similarProduct.id}`}
									className="md:col-span-3 lg:col-span-2"
									variant="display"
								/>
							))}
						</ul>
						<Button variant="secondary" className="self-center" asChild>
							<Link href="/products">View Product Catalogue</Link>
						</Button>
					</div>
				</section>

				{/* Inspiration */}
				<InspirationSection />
			</div>
		</>
	);
}

export const getStaticProps = async (
	context: GetStaticPropsContext<{ id: string }>
) => {
	const { prisma } = await createContextInner({});

	const ssr = await createProxySSGHelpers({
		router: appRouter,
		ctx: { prisma },
		transformer: superjson // optional - adds superjson serialization
	});

	const productId = context.params?.id as string;

	// prefetch `product.getById`
	await ssr.product.getById.prefetch({ productId });

	return {
		props: {
			trpcState: ssr.dehydrate()
		},
		revalidate: 10
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const { prisma } = await createContextInner({});

	const products = await prisma.product.findMany({
		select: { id: true }
	});

	return {
		paths: products.map((product) => ({
			params: { id: product.id }
		})),

		// https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#fallback-blocking
		fallback: 'blocking'
	};
};

export default Page;
