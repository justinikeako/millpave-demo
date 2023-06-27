import Head from 'next/head';
import { Footer } from '~/components/footer';
import { VariantPicker, SkuPickerProvider } from '~/components/sku-picker';
import { ProductCard } from '~/components/product-card';
import { Button } from '~/components/button';
import Link from 'next/link';
import NextError from 'next/error';
import { Sku } from '~/types/product';
import { api } from '~/utils/api';
import { cn } from '~/lib/utils';
import { PaverEstimator } from '~/components/estimator';
import { Icon } from '~/components/icon';
import { Suspense, useState } from 'react';
import { createServerSideHelpers } from '@trpc/react-query/server';
import superjson from 'superjson';
import { formatPrice } from '~/utils/format';
import { createInnerTRPCContext } from '~/server/api/trpc';
import {
	GetStaticPaths,
	GetStaticPropsContext,
	InferGetStaticPropsType
} from 'next';
import { appRouter } from '~/server/api/root';
import dynamic from 'next/dynamic';
import { OrchestratedReveal, ViewportReveal } from '~/components/reveal';
import { ProductStock } from '~/components/product-stock';
import { findSku, unitDisplayNameDictionary } from '~/lib/utils';
import { db } from '~/server/db';
import { LocationsSection } from '~/components/sections/locations';
import { InspirationSection } from '~/components/sections/inspiration';
import { LearnSection } from '~/components/sections/learn';
import { AugmentedRealityGallerySection } from '~/components/sections/ar-gallery';
import { Main } from '~/components/main';

const ProductViewer3D = dynamic(
	() => import('~/components/product-viewer-3d'),
	{ suspense: true }
);

type GalleryProps = {
	sku: Sku;
	showModelViewer: boolean;
};

function Gallery({ sku, showModelViewer }: GalleryProps) {
	const images = [0, 0, 0, 0];

	const [selectedIndex, setSelectedIndex] = useState(0);

	return (
		<div className="sticky top-24 flex w-full items-center gap-2">
			<div className="flex flex-col items-center justify-center gap-2">
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
								className="flex aspect-square w-20 flex-1 shrink-0 items-center justify-center bg-gray-200 bg-clip-content p-1 text-lg text-gray-400 ring-1 ring-inset ring-gray-400 peer-checked:ring-2 peer-checked:ring-pink-700"
							>
								{showModelViewer && index === 3 && (
									<Icon name="3d_rotation_opsz-40" size={40} />
								)}
							</label>
						</div>
					);
				})}
			</div>

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
		</div>
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
		<section className={cn('space-y-4', props.className)}>
			<h2 className="font-display text-lg">{heading}</h2>
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

			<Main>
				{/* Main Content */}
				<section className="flex gap-16 py-16">
					{/* Gallery */}

					<OrchestratedReveal delay={0.1} className="flex-1">
						<Gallery sku={currentSku} showModelViewer={product.hasModels} />
					</OrchestratedReveal>

					{/* Supporting Details */}
					<OrchestratedReveal
						delay={0.2}
						className="flex-1 space-y-8 lg:space-y-12"
					>
						{/* Basic Info */}
						<section className="space-y-2">
							<div>
								<p className="font-display text-lg">
									<Link href={`/products/${product.category.id}`}>
										{product.category.displayName}
									</Link>
								</p>
								<h1 className="font-display text-4xl">{product.displayName}</h1>
							</div>
							<div className="flex flex-wrap justify-between gap-x-4 font-display text-lg">
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
										className="flex justify-between rounded-sm border-b border-gray-300 py-3 last:border-none"
									>
										<p>{detail.displayName}</p>
										<p>{detail.value}</p>
									</li>
								))}
							</ul>
						</Section>
					</OrchestratedReveal>
				</section>

				{/* Similar Products */}
				<ViewportReveal className="flex flex-col space-y-16 py-16">
					<h2 className="max-w-[28ch] self-center text-center font-display text-2xl">
						Similar to {product.displayName}
					</h2>

					<div className="flex flex-col space-y-8">
						<ul className="flex gap-4">
							{product.similar.map((similarProduct) => (
								<ProductCard
									key={similarProduct.id}
									name={similarProduct.displayName}
									startingSku={similarProduct.startingSku}
									link={`/product/${similarProduct.id}`}
									className="flex-1"
								/>
							))}
							<li className="flex-1">
								<Button
									asChild
									intent="secondary"
									className="h-full flex-col !rounded-md font-display text-lg italic"
								>
									<Link href="/products">
										<span className="block w-[15ch]">Explore All Products</span>
										<Icon name="arrow_right_alt" size={24} />
									</Link>
								</Button>
							</li>
						</ul>
					</div>
				</ViewportReveal>

				<LocationsSection />

				<InspirationSection />

				<LearnSection />

				<AugmentedRealityGallerySection />
			</Main>

			<Footer />
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
