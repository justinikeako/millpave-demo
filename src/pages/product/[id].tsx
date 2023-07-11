import Head from 'next/head';
import { Footer } from '~/components/footer';
import { VariantPicker, SkuPickerProvider } from '~/components/sku-picker';
import { ProductCard } from '~/components/product-card';
import { Button } from '~/components/button';
import Link from 'next/link';
import NextError from 'next/error';
import { Sku } from '~/types/product';
import { cn } from '~/lib/utils';
import { PaverEstimator } from '~/components/estimator';
import { Icon } from '~/components/icon';
import { Suspense } from 'react';
import { formatPrice } from '~/utils/format';
import { createInnerTRPCContext } from '~/server/api/trpc';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import { OrchestratedReveal, ViewportReveal } from '~/components/reveal';
import { ProductStock } from '~/components/product-stock';
import { findSku, unitDisplayNameDictionary } from '~/lib/utils';
import { LocationsSection } from '~/components/sections/locations';
import { InspirationSection } from '~/components/sections/inspiration';
import { LearnSection } from '~/components/sections/learn';
import { AugmentedRealityGallerySection } from '~/components/sections/ar-gallery';
import { Main } from '~/components/main';
import { HorizontalScroller } from '~/components/horizontal-scroller';
import { GetAQuoteSection } from '~/components/sections/get-a-quote';
import { useRouter } from 'next/router';
import { productRouter } from '~/server/api/routers/product';

export const runtime = 'experimental-edge';

export const getServerSideProps = async ({
	res,
	params,
	query
}: GetServerSidePropsContext) => {
	res.setHeader(
		'Cache-Control',
		`public, s-maxage=${60 * 60 * 24 * 31}, stale-while-revalidate=59`
	);

	const productId = params?.id as string;
	const variantId =
		typeof query?.sku === 'string' ? decodeURIComponent(query.sku) : undefined;
	const skuId = productId ? productId + ':' + variantId : undefined;

	const callerContext = await createInnerTRPCContext({});
	const productCaller = productRouter.createCaller(callerContext);

	const product = await productCaller.getById({ productId });

	const [, ...defaultVariantFragments] = product.defaultSkuId.split(':');
	const defaultVariantId = defaultVariantFragments.join(':');

	const skuExists = product.skus.some((currentSku) => currentSku.id === skuId);

	if (!skuExists)
		return {
			redirect: {
				destination: `/product/${product.id}?sku=${encodeURIComponent(
					defaultVariantId
				)}`,
				permanent: true
			}
		};

	return {
		props: { product }
	};
};

function Page({
	product
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();
	const { pathname, query } = router;

	const variantId =
		typeof query.sku === 'string' ? decodeURIComponent(query.sku) : undefined;
	const skuId = product?.id ? product?.id + ':' + variantId : undefined;

	const currentSku = findSku(skuId, product?.skus, product?.details);

	if (!product || !currentSku || !skuId) return <NextError statusCode={404} />;

	return (
		<>
			<Head>
				<title>{`${product.displayName} — Millennium Paving Stones`}</title>
			</Head>

			<Main>
				{/* Main Content */}
				<section className="flex flex-col gap-8 py-8 sm:flex-row lg:gap-16 lg:py-16">
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
								<p className="font-display text-lg lg:text-xl">
									<Link href={`/products/${product.category.id}`}>
										{product.category.displayName}
									</Link>
								</p>
								<h1 className="font-display text-4xl leading-tight md:text-5xl lg:text-6xl xl:text-7xl/tight">
									{product.displayName}
								</h1>
							</div>
							<div className="flex flex-wrap justify-between gap-x-4 font-display text-lg lg:text-xl">
								<div className="flex flex-wrap items-center gap-x-4">
									<p className="whitespace-nowrap">
										{formatPrice(currentSku.price)} per&nbsp;
										{currentSku.unit === 'sqft'
											? unitDisplayNameDictionary['sqft'][0]
											: currentSku.unit}
									</p>
									{currentSku.details.rawData?.pcs_per_sqft && (
										<>
											<div className="h-[1.15em] w-px bg-current" />
											<p className="whitespace-nowrap">
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
									productId={product.id}
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
							onChange={({ newVariantId }) =>
								router.replace(
									{
										pathname,
										query: { ...query, sku: encodeURIComponent(newVariantId) }
									},
									undefined,
									{ shallow: true }
								)
							}
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
					<h2 className="max-w-[28ch] self-center text-center font-display text-3xl lg:text-4xl xl:text-5xl">
						Similar to {product.displayName}
					</h2>

					<div className="flex flex-col space-y-8">
						<HorizontalScroller className="gap-4 py-1" snap>
							{product.similar.map((similarProduct) => (
								<ProductCard
									key={similarProduct.id}
									name={similarProduct.displayName}
									startingSku={similarProduct.startingSku}
									link={`/product/${similarProduct.id}`}
									className="shrink-0 basis-80 snap-center lg:w-auto lg:flex-1"
								/>
							))}
							<li className="min-w-[16rem] shrink-0 basis-80 snap-center lg:w-auto lg:flex-1">
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
						</HorizontalScroller>
					</div>
				</ViewportReveal>

				<GetAQuoteSection />

				<InspirationSection />

				<LocationsSection />

				<LearnSection />

				<AugmentedRealityGallerySection />
			</Main>

			<Footer />
		</>
	);
}

const ProductViewer3D = dynamic(
	() => import('~/components/product-viewer-3d'),
	{ suspense: true, ssr: false }
);

type GalleryProps = {
	sku: Sku;
	showModelViewer: boolean;
};

function Gallery({ sku, showModelViewer }: GalleryProps) {
	const images = [0, 0, 0, 0];

	const router = useRouter();
	const { pathname, query } = router;

	const selectedIndex =
		typeof query.image === 'string' ? parseInt(query.image) : 0;

	return (
		<div className="sticky top-24 mx-auto flex w-full max-w-sm flex-col-reverse items-center gap-2 sm:max-w-none lg:flex-row">
			<div className="flex items-center justify-center gap-2 lg:flex-col">
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
								onChange={() =>
									router.replace(
										{ pathname, query: { ...query, image: index } },
										undefined,
										{ shallow: true }
									)
								}
							/>

							<label
								htmlFor={id}
								className="flex aspect-square w-16 flex-1 shrink-0 items-center justify-center bg-gray-200 bg-clip-content p-1 text-lg text-gray-400 ring-1 ring-inset ring-gray-400 peer-checked:ring-2 peer-checked:ring-pink-700 lg:w-20"
							>
								{showModelViewer && index === 3 && (
									<Icon name="3d_rotation-opsz_40" size={40} />
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
								<p>Loading 3D Model...</p>
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
			<h2 className="font-display text-lg lg:text-xl">{heading}</h2>
			{children}
		</section>
	);
}

export default Page;
