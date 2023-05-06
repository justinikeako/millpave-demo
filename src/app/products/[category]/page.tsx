import { ProductCard } from '@/components/product-card';
import { w } from 'windstitch';
import { createContextInner } from '@/server/trpc/context';
// import { Button } from '@/components/button';
import { PrismaClient } from '@prisma/client';
import { productRouter } from '@/server/trpc/router/product';
import { notFound } from 'next/navigation';

export const metadata = {
	title: 'Product Catalogue — Millennium Paving Stones'
};

const prisma = new PrismaClient({});

export async function generateStaticParams() {
	const categories = await prisma.category.findMany({
		select: { id: true }
	});

	return [
		{ category: 'all' },
		...categories.map((category) => ({
			category: category.id
		}))
	];
}

async function getProducts(categoryId: string) {
	const context = await createContextInner({});

	const caller = productRouter.createCaller(context);

	const products = await caller.getByCategory({ categoryId });

	return products;
}

const StyledProductCard = w(ProductCard, {
	className: 'md:col-span-6 lg:col-span-4 xl:col-span-3'
});

type PageProps = {
	params: {
		category: string;
	};
};

async function Page({ params }: PageProps) {
	const categoryId = params.category;

	const products = await getProducts(categoryId);

	if (!products) return notFound();

	return (
		<div className="space-y-8">
			<ul className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8">
				{products.map((product) => (
					<StyledProductCard
						key={product.id}
						name={product.displayName}
						startingSku={product.startingSku}
						link={`/product/${product.id}`}
					/>
				))}
			</ul>

			{/* {productsQuery.hasNextPage && (
								<Button
									variant="secondary"
									onClick={() => productsQuery.fetchNextPage()}
									disabled={productsQuery.isFetchingNextPage}
									className="mx-auto"
								>
									See More
								</Button>
							)} */}
		</div>
	);
}

export default Page;
