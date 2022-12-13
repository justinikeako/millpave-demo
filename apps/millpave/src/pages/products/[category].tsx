import Head from 'next/head';
import { ProductCard } from '../../components/product-card';
import { w } from 'windstitch';
import { Icon } from '../../components/icon';
import { appRouter } from '../../server/trpc/router/_app';
import { createContextInner } from '../../server/trpc/context';
import superjson from 'superjson';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { trpc } from '../../utils/trpc';
import NextError from 'next/error';
import { Button } from '../../components/button';
import { GetStaticPaths, GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import { Category } from '@prisma/client';

const StyledProductCard = w(ProductCard, {
	className: 'md:col-span-6 lg:col-span-4 xl:col-span-3'
});

type ChipProps = React.PropsWithChildren<
	{
		value: string;
	} & React.HTMLProps<HTMLInputElement>
>;

function Chip({ value, children, ...props }: ChipProps) {
	return (
		<li className="relative flex gap-1  whitespace-nowrap px-4 py-2 font-semibold">
			<input
				type="radio"
				name="category"
				id={value}
				value={value}
				className="peer hidden"
				{...props}
			/>
			<label
				htmlFor={value}
				className="absolute inset-0 rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400 peer-checked:bg-gray-900 peer-checked:hover:bg-gray-800 peer-checked:active:bg-gray-700"
			/>
			<span className="pointer-events-none z-[1] peer-checked:text-white">
				{children}
			</span>
			<Icon
				name="check"
				className="pointer-events-none z-[1] hidden text-white peer-checked:inline"
			/>
		</li>
	);
}

function Page() {
	const router = useRouter();
	const categoryId = router.query.category as string | undefined;

	const categoriesQuery = trpc.category.getAll.useQuery(undefined, {
		refetchOnWindowFocus: false
	});

	const productsQuery = trpc.product.getByCategory.useInfiniteQuery(
		{ categoryId },
		{
			refetchOnWindowFocus: false,
			getNextPageParam: (lastPage) => lastPage.nextCursor
		}
	);

	const products = productsQuery.data;
	const categories: Category[] = [
		{ id: 'all', displayName: 'All Categories' },
		...(categoriesQuery.data || [])
	];

	if (!categories || !products) {
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
						<ul className="mx-auto flex w-fit space-x-2  px-8">
							{categories?.map((category) => (
								<Chip
									key={category.id}
									value={category.id}
									checked={categoryId === category.id}
									onChange={() => {
										router.replace(`/products/${category.id}`);
									}}
								>
									{category.displayName}
								</Chip>
							))}
						</ul>
					</div>

					{/* Products */}
					<section className="space-y-16 self-stretch">
						<div className="space-y-8">
							<ul className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8">
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

							{productsQuery.hasNextPage && (
								<Button
									variant="secondary"
									onClick={() => productsQuery.fetchNextPage()}
									disabled={productsQuery.isFetchingNextPage}
									className="mx-auto"
								>
									See More
								</Button>
							)}
						</div>
					</section>
				</div>
			</main>
		</>
	);
}

export const getStaticProps = async (
	context: GetStaticPropsContext<{ category: string }>
) => {
	const { prisma } = await createContextInner({});

	const ssg = await createProxySSGHelpers({
		router: appRouter,
		ctx: { prisma },
		transformer: superjson // optional - adds superjson serialization
	});

	const categoryId = context.params?.category;

	// prefetch `product.getByCategory`
	await ssg.product.getByCategory.prefetchInfinite({ categoryId });
	await ssg.category.getAll.prefetch();

	const ONE_MONTH_IN_SECONDS = 60 * 60 * 24 * 31;

	return {
		props: {
			trpcState: ssg.dehydrate()
		},
		revalidate: ONE_MONTH_IN_SECONDS
	};
};

export const getStaticPaths: GetStaticPaths = async () => {
	const { prisma } = await createContextInner({});

	const categories = await prisma.category.findMany({
		select: { id: true }
	});

	return {
		paths: [
			{ params: { category: 'all' } },
			...categories.map((category) => ({
				params: { category: category.id }
			}))
		],

		// https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#fallback-blocking
		fallback: 'blocking'
	};
};

export default Page;
