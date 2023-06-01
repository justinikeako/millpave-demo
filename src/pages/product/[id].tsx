import Head from 'next/head';
import { VariantPicker, SkuPickerProvider } from '@/components/sku-picker';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/button';
import Link from 'next/link';
import NextError from 'next/error';
import { Sku } from '@/types/product';
import { api } from '@/utils/api';
import classNames from 'classnames';
import { PaverEstimator } from '@/components/estimator';
import { Suspense, useState } from 'react';
import { InspirationSection } from '@/components/inspiration-section';
import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';
import { formatPrice } from '@/utils/format';
import { createInnerTRPCContext } from '@/server/api/trpc';
import {
	GetStaticPaths,
	GetStaticPropsContext,
	InferGetStaticPropsType
} from 'next';
import { appRouter } from '@/server/api/routers/root';
import dynamic from 'next/dynamic';
import { ViewportReveal } from '@/components/reveal';
import { motion } from 'framer-motion';
import { ProductStock } from '@/components/product-stock';
import { findSku, unitDisplayNameDictionary } from '@/lib/utils';
import { Main } from '@/components/main';
import { db } from '@/server/db';

const ProductViewer3D = dynamic(
	() => import('@/components/product-viewer-3d'),
	{ suspense: true }
);

const slowTransition = {
	type: 'spring',
	stiffness: 100,
	damping: 20
};

type GalleryProps = {
	sku: Sku;
	showModelViewer: boolean;
};

function Gallery({ sku, showModelViewer }: GalleryProps) {
	const images = [0, 0, 0, 0];

	const [selectedIndex, setSelectedIndex] = useState(0);

	return (
		<motion.div
			initial={{ y: 100, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ delay: 0.1, ...slowTransition }}
			className="flex flex-col items-center gap-2 md:sticky md:top-16 md:flex-[2] lg:flex-[3]"
		>
			<div className="relative aspect-square w-full bg-gray-200">
				{showModelViewer && selectedIndex === 3 && (
					<Suspense
						fallback={
							<div className="grid h-full w-full place-items-center">
								<p>Loading 3D Model</p>
							</div>
						}
					>
						<ProductViewer3D skuId={sku.id} displayName={sku.displayName} />
					</Suspense>
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
								className="flex aspect-square max-w-[80px] flex-1 shrink-0 items-center justify-center bg-gray-200 bg-clip-content p-1 text-lg text-gray-400 ring-1 ring-inset ring-gray-200 peer-checked:ring-2 peer-checked:ring-black"
							>
								{showModelViewer && index === 3 && '3D'}
							</label>
						</div>
					);
				})}
			</div>
		</motion.div>
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

function Page(props: InferGetStaticPropsType<typeof getStaticProps>) {
	const productId = props.id;

	const productQuery = api.product.getById.useQuery(
		{ productId },
		{ refetchOnWindowFocus: false }
	);

	const product = productQuery.data;

	const [skuId, setSkuId] = useState(product?.defaultSkuId);
	const currentSku = findSku(skuId, product?.skus, product?.details);

	if (!product || !currentSku || !skuId) {
		const productNotFound = productQuery.error?.data?.code === 'NOT_FOUND';
		const skuNotFound = currentSku === undefined;

		if (!product) return null;
		if (productNotFound) return <NextError statusCode={404} />;
		if (skuNotFound && product.defaultSkuId) setSkuId(product.defaultSkuId);

		return <NextError statusCode={500} />;
	}

	return (
		<>
			<Head>
				<title>{`${product.displayName} — Millennium Paving Stones`}</title>
			</Head>

			<Main className="space-y-32">
				{/* Main Content */}
				<section className="flex flex-col gap-8 md:flex-row md:items-start md:gap-16 lg:gap-32">
					{/* Gallery */}
					<Gallery sku={currentSku} showModelViewer={product.hasModels} />

					{/* Supporting Details */}
					<motion.div
						initial={{ y: 100, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2, ...slowTransition }}
						className="space-y-8 md:flex-[3] lg:flex-[4] lg:space-y-12"
					>
						{/* Basic Info */}
						<section className="space-y-2">
							<div>
								<p className="text-lg">
									<Link
										scroll={false}
										href={`/products/${product.category.id}`}
									>
										{product.category.displayName}
									</Link>
								</p>
								<h1 className="text-4xl">{product.displayName}</h1>
							</div>
							<div className="flex flex-wrap justify-between gap-x-4 text-lg">
								<div className="flex items-center gap-4">
									<p>
										{formatPrice(currentSku.price)} per&nbsp;
										{currentSku.unit === 'sqft'
											? unitDisplayNameDictionary['sqft'][0]
											: currentSku.unit}
									</p>
									{currentSku.details.rawData?.pcs_per_sqft && (
										<>
											<div className="h-full w-[2px] bg-current" />
											<p>
												{formatPrice(
													currentSku.price /
														currentSku.details.rawData.pcs_per_sqft
												)}
												&nbsp;per unit
											</p>
										</>
									)}
								</div>

								<ProductStock
									productId={productId}
									skuId={skuId}
									outOfStockMessage={
										['concrete_pavers', 'slabs_blocks'].includes(
											product.category.id
										)
											? 'Done to order'
											: undefined
									}
								/>
							</div>
						</section>

						{/* Description */}
						<Section heading="Description">
							<p>{product.description}</p>
						</Section>

						{/* Sku Picker */}
						<SkuPickerProvider
							skuId={skuId}
							onChange={(newSkuId) => {
								setSkuId(newSkuId);
							}}
						>
							<VariantPicker
								variantIdTemplate={product.variantIdTemplate}
								section={Section}
							/>
						</SkuPickerProvider>

						{/* Paver Estimator */}
						{product.estimator === 'paver' && currentSku.details?.rawData && (
							<PaverEstimator
								paverDetails={currentSku.details.rawData}
								sku={currentSku}
							/>
						)}

						{/* Specifications */}
						<Section heading="Specifications">
							<ul>
								{currentSku.details.formattedData.map((detail, index) => (
									<li
										key={index}
										className="flex justify-between rounded-sm px-4 py-3 odd:bg-white even:bg-gray-100"
									>
										<p>{detail.displayName}</p>
										<p>{detail.value}</p>
									</li>
								))}
							</ul>
						</Section>
					</motion.div>
				</section>

				{/* Similar Products */}
				<ViewportReveal className="flex flex-col space-y-8">
					<h2 className="max-w-[28ch] self-center text-center text-2xl">
						Similar to {product.displayName}
					</h2>

					<div className="flex flex-col space-y-8">
						<ul className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-8">
							{product.similar.map((similarProduct) => (
								<ProductCard
									key={similarProduct.id}
									name={similarProduct.displayName}
									startingSku={similarProduct.startingSku}
									link={`/product/${similarProduct.id}`}
									className="md:col-span-3 lg:col-span-2"
									variant="display"
								/>
							))}
						</ul>
						<Button variant="secondary" className="self-center" asChild>
							<Link scroll={false} href="/products/all">
								View Product Catalogue
							</Link>
						</Button>
					</div>
				</ViewportReveal>

				{/* Inspiration */}
				<InspirationSection />
			</Main>
		</>
	);
}

export const getStaticProps = async (
	context: GetStaticPropsContext<{ id: string }>
) => {
	const ssgContext = await createInnerTRPCContext({});

	const ssg = await createServerSideHelpers({
		router: appRouter,
		ctx: ssgContext,
		transformer: superjson
	});

	const productId = context.params?.id as string;

	// prefetch `product.getById`
	await ssg.product.getById.prefetch({ productId });

	const ONE_MONTH_IN_SECONDS = 60 * 60 * 24 * 31;

	return {
		props: {
			trpcState: ssg.dehydrate(),
			id: productId
		},
		revalidate: ONE_MONTH_IN_SECONDS
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const products = await db.query.products.findMany({
		columns: { id: true }
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
