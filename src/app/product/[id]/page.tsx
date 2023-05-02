import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/button';
import Link from 'next/link';
import { PaverEstimator } from './estimator';
import { InspirationSection } from '@/components/inspiration-section';
import { createContextInner } from '@/server/trpc/context';
import { GetStaticPaths } from 'next';
import { RevealSection } from '@/components/reveal-section';
import { productRouter } from '@/server/trpc/router/product';
import {
	Gallery,
	ProductPricing,
	ProductSpecs,
	ProductStock,
	SkuPicker
} from './components';
import { OrchestratedReveal } from '@/components/orchestrated-reveal';
import { notFound } from 'next/navigation';
import { Section } from './section';
import { SkuProvider } from './sku-context';

type PageProps = {
	params: { id: string };
};

export async function generateMetadata({ params }: PageProps) {
	const caller = productRouter.createCaller(await createContextInner({}));
	const product = await caller.getById({ productId: params.id });

	return {
		title: `${product.displayName} — Millennium Paving Stones`
	};
}

async function getProduct(id: string) {
	const caller = productRouter.createCaller(await createContextInner({}));

	const product = await caller.getById({ productId: id });

	return product;
}

async function Page({ params }: PageProps) {
	const productId = params.id;

	const product = await getProduct(productId);

	if (!product) return notFound();

	return (
		<SkuProvider product={product} defaultSkuId={product.defaultSkuId}>
			<div className="space-y-32 px-8 md:px-24 lg:px-32">
				{/* Main Content */}
				<main className="flex flex-col gap-8 md:flex-row md:items-start md:gap-16 lg:gap-32">
					{/* Gallery */}
					<Gallery showModelViewer={product.hasModels} />

					{/* Supporting Details */}
					<OrchestratedReveal
						delay={0.2}
						className="space-y-8 md:flex-[3] lg:flex-[4] lg:space-y-12"
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
							<div className="flex flex-wrap justify-between text-lg">
								<ProductPricing />

								<ProductStock
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
						<SkuPicker skuIdTemplateFragments={product.skuIdFragments} />

						{/* Paver Estimator */}
						{product.estimator === 'paver' && <PaverEstimator />}

						{/* Specifications */}
						<ProductSpecs />
					</OrchestratedReveal>
				</main>

				{/* Similar Products */}
				<RevealSection className="flex flex-col space-y-8">
					<h2 className="max-w-[28ch] self-center text-center font-display text-2xl">
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
							<Link href="/products/all">View Product Catalogue</Link>
						</Button>
					</div>
				</RevealSection>

				{/* Inspiration */}
				<InspirationSection />
			</div>
		</SkuProvider>
	);
}

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
