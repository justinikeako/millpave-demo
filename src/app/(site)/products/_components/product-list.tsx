'use client';

import type { InfiniteData } from '@tanstack/react-query';
import type { products } from '~/server/db/schema';
import type { StartingSku } from '~/types/product';
import { Button } from '~/components/button';
import { ProductCard } from '~/components/product-card';
import { api } from '~/trpc/react';

type Page = {
	products: (typeof products.$inferSelect & {
		startingSku: StartingSku;
	})[];
	nextCursor: string | undefined;
};

// I don't know why `string` is necessary here, but it is.
type InitialData = InfiniteData<Page, string>;

export function ProductList({ initialData }: { initialData: InitialData }) {
	const productsQuery = api.product.getByCategory.useInfiniteQuery(
		{ categoryId: 'all' },
		{
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			initialData
		}
	);

	const products = productsQuery.data;

	return (
		<>
			<ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 min-[880px]:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
				{products.pages.map((page) =>
					page.products.map((product) => (
						<ProductCard
							key={product.id}
							name={product.displayName}
							startingSku={product.startingSku}
							productId={product.id}
							className="xl:[&:nth-child(10n+1)]:col-span-2 xl:[&:nth-child(10n+7)]:col-span-2"
						/>
					))
				)}
			</ul>

			{productsQuery.hasNextPage && (
				<Button
					intent="secondary"
					onClick={() => productsQuery.fetchNextPage()}
					disabled={productsQuery.isFetchingNextPage}
					className="mx-auto"
				>
					See More
				</Button>
			)}
		</>
	);
}
