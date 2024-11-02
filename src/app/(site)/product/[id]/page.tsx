import { Footer } from '~/components/footer';
import { ProductCard } from '~/components/product-card';
import { Button } from '~/components/button';
import Link from 'next/link';
import { cn } from '~/lib/utils';
import { PaverEstimator } from './_components/paver-estimator';
import { Icon } from '~/components/icon';
import { formatPrice } from '~/utils/format';
import { Reveal, RevealContainer } from '~/components/reveal';
import { ProductStock } from '~/components/product-stock';
import { findSku, unitDisplayNameDictionary } from '~/lib/utils';
import { LocationsSection } from '~/components/sections/locations';
import { InspirationSection } from '~/components/sections/inspiration';
import { LearnSection } from '~/components/sections/learn';
import { AugmentedRealityGallerySection } from '~/components/sections/ar-gallery';
import { Main } from '~/components/main';
import { HorizontalScroller } from '~/components/horizontal-scroller';
import { GetAQuoteSection } from '~/components/sections/get-a-quote';
import { notFound, redirect } from 'next/navigation';
import { api } from '~/trpc/server';
import { SkuPicker } from './_components/sku-picker';
import { Gallery } from './_components/gallery';
import type { Metadata } from 'next';
import { cache } from 'react';

export const runtime = "edge";

const getProduct = cache(async function (id: string) {
	return await api.product.getById({ productId: id });
});

type PageProps = {
	params: Promise<{ id: string }>;
	searchParams: Record<string, string | string[] | undefined>;
};

export async function generateMetadata(props: PageProps) {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const productId = params.id;
    const variantId =
		typeof searchParams.sku === 'string'
			? decodeURIComponent(searchParams.sku)
			: undefined;
    const skuId = productId + ':' + variantId;

    const product = await getProduct(params.id);

    return {
		title: `${product.displayName} — Millennium Paving Stones LTD.`,
		description: product.description,
		...(product.hasModels
			? {
					openGraph: {
						images: {
							url: `https://raw.githubusercontent.com/justinikeako/cornerstone-models/main/renders/${skuId.replaceAll(
								':',
								'-'
							)}.png`
						}
					}
				}
			: {})
	} as Metadata;
}

export default async function Page(props: PageProps) {
    const searchParams = await props.searchParams;
    const params = await props.params;
    const productId = params.id;
    const variantId =
		typeof searchParams.sku === 'string'
			? decodeURIComponent(searchParams.sku)
			: undefined;
    const skuId = productId ? productId + ':' + variantId : undefined;

    const product = await getProduct(productId);

    const [, ...defaultVariantFragments] = product.defaultSkuId.split(':');
    const defaultVariantId = defaultVariantFragments.join(':');

    const skuExists = product.skus.some((currentSku) => currentSku.id === skuId);

    if (!skuExists)
		return redirect(
			`/product/${product.id}?sku=${encodeURIComponent(defaultVariantId)}`
		);

    const currentSku = findSku(skuId, product?.skus, product?.details);

    if (!product || !currentSku || !skuId) return notFound();

    return (
		<>
			<Main>
				{/* Main Content */}
				<RevealContainer asChild>
					<section className="flex flex-col gap-8 py-8 sm:flex-row lg:gap-16 lg:py-16">
						{/* Gallery */}

						<Reveal delay={0.1} className="flex-1">
							<Gallery sku={currentSku} showModelViewer={product.hasModels} />
						</Reveal>

						{/* Supporting Details */}
						<Reveal
							delay={0.2}
							className="flex flex-1 flex-col space-y-8 lg:space-y-12"
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
												? unitDisplayNameDictionary.sqft[0]
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

							{/* Description (desktop) */}
							<Section heading="Description" className="max-lg:hidden">
								<p>{product.description}</p>
							</Section>

							{/* Sku Picker */}
							<SkuPicker
								skuId={skuId}
								variantIdTemplate={product.variantIdTemplate}
							/>

							{/* Paver Estimator */}
							{product.estimator === 'paver' && currentSku.details?.rawData && (
								<PaverEstimator
									paverDetails={currentSku.details.rawData}
									sku={currentSku}
								/>
							)}

							{/* Description (Mobile) */}
							<Section heading="Description" className="lg:hidden">
								<p>{product.description}</p>
							</Section>

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
						</Reveal>
					</section>
				</RevealContainer>

				{/* Similar Products */}
				<Reveal standalone className="flex flex-col space-y-16 py-16">
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
									productId={similarProduct.id}
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
				</Reveal>

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
