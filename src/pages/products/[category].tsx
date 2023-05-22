import Head from 'next/head';
import { ProductCard } from '@/components/product-card';
import { w } from 'windstitch';
import { appRouter } from '@/server/api/routers/root';
import { createContextInner } from '@/server/api/context';
import superjson from 'superjson';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { api } from '@/utils/api';
import NextError from 'next/error';
import { Button } from '@/components/button';
import { GetStaticPaths, GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';
import { Category } from '@/types/product';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

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
			<Check className="pointer-events-none z-[1] hidden h-5 w-5 text-white peer-checked:inline" />
		</li>
	);
}

const slowTransition = {
	type: 'spring',
	stiffness: 100,
	damping: 20
};

function Page() {
	const router = useRouter();
	const categoryId = router.query.category as string | undefined;

	const categoriesQuery = api.category.getAll.useQuery(undefined, {
		refetchOnWindowFocus: false
	});

	const productsQuery = api.product.getByCategory.useInfiniteQuery(
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
				<motion.h1
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.1, ...slowTransition }}
					className="text-center text-4xl"
				>
					Product Catalogue
				</motion.h1>

				<div className="flex flex-col items-center gap-8 lg:gap-12">
					<motion.div
						initial={{ y: 100, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2, ...slowTransition }}
						className="no-scrollbar -mx-8 self-stretch overflow-x-scroll"
					>
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
					</motion.div>

					{/* Products */}
					<motion.section
						initial={{ y: 100, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.3, ...slowTransition }}
						className="space-y-16 self-stretch"
					>
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
					</motion.section>
				</div>
			</main>
		</>
	);
}

export const getStaticProps = async (
	context: GetStaticPropsContext<{ category: string }>
) => {
	const ssgContext = await createContextInner({});

	const ssg = await createServerSideHelpers({
		router: appRouter,
		ctx: ssgContext,
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
	const { db } = await createContextInner({});

	const categories = await db.query.categories.findMany({
		columns: { id: true }
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
