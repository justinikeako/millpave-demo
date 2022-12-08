import Head from 'next/head';
import SkuPicker from '../../components/sku-picker';
import { ProductCard } from '../../components/product-card';
import { Button } from '../../components/button';
import Link from 'next/link';
import NextError from 'next/error';
import { Sku } from '@prisma/client';
import { ExtendedPaverDetails } from '../../types/product';
import { trpc } from '../../utils/trpc';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { formatPrice } from '../../utils/format';
import { Stock } from '../../components/stock';
import { PaverEstimator } from '../../components/estimator';

function pathFromSkuId(skuId: string) {
	const [productId, ...skuIdFragments] = skuId.split(':');
	const skuQuery = skuIdFragments.join('+');

	return `/product/${productId}?sku=${skuQuery}`;
}

const findDetails = (skuId: string, details?: ExtendedPaverDetails[]) => {
	return details?.find((details) => {
		return skuId.includes(details.matcher);
	});
};

function findSKU(searchId: string, skus?: Sku[]) {
	return skus?.find((currentSku) => currentSku.id === searchId);
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

function Page() {
	const router = useRouter();

	const productId = router.query.id as string;

	const skuIdFragment = (router.query.sku as string | undefined)?.replace(
		/ /gs,
		':'
	);
	const skuId = `${productId}:${skuIdFragment}`;

	const product = trpc.product.getById.useQuery(
		{ productId },
		{ refetchOnWindowFocus: false }
	);

	const currentSku = findSKU(skuId, product.data?.skus);
	const productDetails = findDetails(skuId, product.data?.details);

	if (!product.data || !currentSku || !productDetails) {
		const productNotFound = product.error?.data?.code === 'NOT_FOUND';
		const skuNotFound = product.isSuccess && !currentSku;

		if (productNotFound || skuNotFound) return <NextError statusCode={404} />;

		return null;
	}

	return (
		<>
			<Head>
				<title>
					{`${product.data.displayName} — Millennium Paving Stones`}{' '}
				</title>
			</Head>

			<div className="space-y-32 px-8 md:px-24 lg:px-32">
				{/* Main Content */}
				<div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-32">
					{/* Gallery */}
					<main className="flex flex-col items-center gap-2 lg:sticky lg:top-8 lg:flex-[3]">
						<div className="aspect-square w-full bg-gray-200" />
						<div className="flex items-start gap-2">
							<div className="relative h-20 w-20 shrink-0 p-2 inner-border-2 inner-border-black">
								<div className="h-full w-full bg-gray-200" />
							</div>
							<div className="relative h-20 w-20 shrink-0 p-1 inner-border inner-border-gray-200">
								<div className="h-full w-full bg-gray-200" />
							</div>
							<div className="relative h-20 w-20 shrink-0 p-1 inner-border inner-border-gray-200">
								<div className="h-full w-full bg-gray-200" />
							</div>
							<div className="relative h-20 w-20 shrink-0 p-1 inner-border inner-border-gray-200">
								<div className="h-full w-full bg-gray-200" />
							</div>
						</div>
					</main>

					{/* Supporting Details */}
					<aside className="space-y-8 lg:flex-[4] lg:space-y-12">
						{/* Basic Info */}
						<section className="space-y-2">
							<h1 className="font-display text-4xl">
								{product.data.displayName}
							</h1>
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

								<Stock fulfillment={product.data} skuId={skuId} />
							</div>
						</section>

						{/* Description */}
						<Section heading="Description">
							<p>{product.data.description}</p>
						</Section>

						{/* Sku Picker */}
						<SkuPicker
							value={skuId}
							skuIdTemplateFragments={product.data.skuIdFragments}
							section={Section}
							onChange={(newSkuId) => {
								const path = pathFromSkuId(newSkuId);

								router.replace(path, undefined, {
									shallow: true,
									scroll: false
								});
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
						Similar to {product.data.displayName}
					</h2>

					<div className="flex flex-col space-y-8">
						<ul className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-8">
							{product.data.similar.map((similarProduct) => (
								<ProductCard
									key={similarProduct.id}
									name={similarProduct.displayName}
									startingPrice={similarProduct.startingSku.price}
									link={pathFromSkuId(similarProduct.defaultSkuId)}
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
				<section className="flex flex-col space-y-16">
					<div className="flex flex-col items-center">
						<p className="font-display text-lg">Inspiration</p>
						<h2 className="max-w-[20ch] text-center font-display text-3xl">
							Don&apos;t know where to start? Look at our best projects.
						</h2>

						<br />

						<Button variant="primary">
							<Link href="/gallery">Get Inspired</Link>
						</Button>
					</div>

					<div className="-mx-8 flex flex-col space-y-4 md:-mx-24 md:space-y-8 lg:-mx-32">
						<div className="flex h-[40vmin] justify-center space-x-4 overflow-hidden md:space-x-8">
							<div className="flex aspect-square shrink-0 bg-gray-200" />
							<div className="flex aspect-square shrink-0 bg-gray-200" />
							<div className="flex aspect-square shrink-0 bg-gray-200" />
							<div className="flex aspect-square shrink-0 bg-gray-200" />
							<div className="flex aspect-square shrink-0 bg-gray-200" />
							<div className="flex aspect-square shrink-0 bg-gray-200" />
						</div>
						<div className="flex h-[40vmin] justify-center space-x-4 overflow-hidden md:space-x-8">
							<div className="flex aspect-square shrink-0 bg-gray-200" />
							<div className="flex aspect-square shrink-0 bg-gray-200" />
							<div className="flex aspect-square shrink-0 bg-gray-200" />
							<div className="flex aspect-square shrink-0 bg-gray-200" />
							<div className="flex aspect-square shrink-0 bg-gray-200" />
							<div className="flex aspect-square shrink-0 bg-gray-200" />
							<div className="flex aspect-square shrink-0 bg-gray-200" />
						</div>
					</div>
				</section>
			</div>
		</>
	);
}

export default Page;
