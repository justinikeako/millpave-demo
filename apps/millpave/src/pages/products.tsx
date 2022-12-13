import Head from 'next/head';
import { ProductCard } from '../components/product-card';
import { w } from 'windstitch';
import { Icon } from '../components/icon';
import { appRouter } from '../server/trpc/router/_app';
import { createContextInner } from '../server/trpc/context';
import superjson from 'superjson';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { trpc } from '../utils/trpc';
import NextError from 'next/error';
import { Button } from '../components/button';

const StyledProductCard = w(ProductCard, {
	className: 'md:col-span-3 xl:col-span-2'
});

type ChipProps = React.PropsWithChildren<{
	value: string;
	defaultChecked?: boolean;
}>;

function Chip({ value, children, ...props }: ChipProps) {
	return (
		<li>
			<label
				htmlFor={value}
				className="relative flex gap-1 whitespace-nowrap  px-4 py-2 font-semibold [&>*]:select-none"
			>
				<input
					type="radio"
					name="category"
					id={value}
					value={value}
					className="peer hidden"
					{...props}
				/>
				<div className="absolute inset-0 -z-10 rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400 peer-checked:bg-gray-900 peer-checked:hover:bg-gray-800 peer-checked:active:bg-gray-700" />
				<span className="peer-checked:text-white">{children}</span>
				<Icon name="check" className="hidden text-white peer-checked:inline" />
			</label>
		</li>
	);
}

function Page() {
	const productsQuery = trpc.product.getByCategory.useInfiniteQuery(
		{},
		{
			refetchOnWindowFocus: false,
			getNextPageParam: (lastPage) => lastPage.nextCursor
		}
	);

	const products = productsQuery.data;

	if (!products) {
		const productsNotFound = productsQuery.error?.data?.code === 'NOT_FOUND';

		if (productsNotFound) return <NextError statusCode={404} />;

		return <NextError statusCode={500} />;
	}

	return (
		<>
			<Head>
				<title>Product Catalogue — Millennium Paving Stones</title>
			</Head>

			<main className="space-y-8 px-8 md:px-24 lg:space-y-16 lg:px-32">
				<h1 className="text-center font-display text-4xl">Product Catalogue</h1>

				<div className="flex flex-col items-center gap-8 lg:gap-12">
					<div className="no-scrollbar -mx-8 self-stretch overflow-x-scroll">
						<ul className="m-auto flex w-fit space-x-2  px-8">
							<Chip value="all">All Products</Chip>
							<Chip value="pavers">Pavers</Chip>
							<Chip value="slabs_blocks">Slabs and Blocks</Chip>
							<Chip value="maintenance">Maintenance</Chip>
						</ul>
					</div>

					{/* Categories */}
					<ul className="flex-[4] space-y-16">
						<li className="space-y-8">
							<ul className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-8">
								{products.pages.map((page) =>
									page.products.map((product) => (
										<StyledProductCard
											key={product.id}
											name={product.displayName}
											startingSku={product.startingSku}
											link={`/product/${product.id}`}
										/>
									))
								)}
							</ul>
						</li>
						{productsQuery.hasNextPage && (
							<Button
								variant="secondary"
								onClick={() => productsQuery.fetchNextPage()}
								disabled={productsQuery.isFetchingNextPage}
							>
								See More
							</Button>
						)}
					</ul>
				</div>
			</main>
		</>
	);
}

export const getStaticProps = async () => {
	const { prisma } = await createContextInner({});

	const ssr = await createProxySSGHelpers({
		router: appRouter,
		ctx: { prisma },
		transformer: superjson // optional - adds superjson serialization
	});

	// const productId = context.params?.id as string;

	// prefetch `product.getByCategory`
	await ssr.product.getByCategory.prefetchInfinite({});

	return {
		props: {
			trpcState: ssr.dehydrate()
		},
		revalidate: 10
	};
};

export default Page;
