import Head from 'next/head';
import { Footer } from '~/components/footer';
import { ProductCard } from '~/components/product-card';
import { appRouter } from '~/server/api/root';
import { createInnerTRPCContext } from '~/server/api/trpc';
import superjson from 'superjson';
import { createServerSideHelpers } from '@trpc/react-query/server';
import { api } from '~/utils/api';
import NextError from 'next/error';
import { Button } from '~/components/button';
import {
	// GetServerSidePropsContext,
	InferGetServerSidePropsType
} from 'next';
import { Category } from '~/types/product';
import { Main } from '~/components/main';
import { OrchestratedReveal } from '~/components/reveal';
import { Icon } from '~/components/icon';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '~/components/ui/select';
import * as Collapsible from '@radix-ui/react-collapsible';
import { LearnSection } from '~/components/sections/learn';
import { AugmentedRealityGallerySection } from '~/components/sections/ar-gallery';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useMediaQuery } from '~/utils/use-media-query';
import { CheckboxProps, Checkbox } from '~/components/checkbox';
import * as Dialog from '@radix-ui/react-dialog';
import { InspirationSection } from '~/components/sections/inspiration';
import { GetAQuoteSection } from '~/components/sections/get-a-quote';

type FilterProps = Omit<CheckboxProps, 'slot'> & {
	slot?: React.ReactNode;
};

function Filter({ name, value, children, slot, ...props }: FilterProps) {
	return (
		<li className="flex h-6 gap-2 md:h-5">
			<Checkbox {...props} name={name} value={value} />
			<label
				htmlFor={name + ':' + value}
				className="flex flex-1 select-none justify-between gap-2"
			>
				{children}
				{slot}
			</label>
		</li>
	);
}

type ColorFilterProps = FilterProps & {
	swatch: string;
};

function ColorFilter({ swatch: color, ...props }: ColorFilterProps) {
	return (
		<Filter
			{...props}
			slot={
				<div
					aria-hidden
					className="h-4 w-4 rounded-full shadow-sm shadow-gray-900/25 ring-1 ring-gray-900/20"
					style={{ background: color }}
				/>
			}
		/>
	);
}

type FilterGroupProps = React.PropsWithChildren<{
	displayName: string;
	collapsible?: boolean;
}>;

function FilterGroup({
	collapsible,
	displayName: name,
	children
}: FilterGroupProps) {
	return (
		<Collapsible.Root
			className="group space-y-3 data-[state=open]:pb-4"
			defaultOpen
			disabled={collapsible === undefined}
		>
			<Collapsible.Trigger className="sm:active:bg-gray pointer-events-none -mx-4 -my-2 flex w-[calc(100%+32px)] items-end justify-between rounded-md px-4 py-2 hover:bg-gray-300/50 active:bg-gray-500/25 disabled:!bg-transparent lg:pointer-events-auto">
				<span className="font-semibold">{name}</span>

				<div className="hidden lg:block">
					<Icon
						name="chevron_down"
						className="hidden group-data-[state=closed]:block group-data-[disabled]:!hidden"
					/>
					<Icon
						name="chevron_up"
						className="hidden group-data-[state=open]:block group-data-[disabled]:!hidden"
					/>
				</div>
			</Collapsible.Trigger>
			<Collapsible.Content>{children}</Collapsible.Content>
		</Collapsible.Root>
	);
}

function Filters() {
	return (
		<>
			{/* Categories */}
			<FilterGroup displayName="Categories" collapsible>
				<ul className="space-y-2">
					<Filter name="categories" value="all" defaultChecked>
						All
					</Filter>
					<Filter name="categories" value="pavers" defaultChecked>
						Paving Stones
					</Filter>
					<Filter name="categories" value="slabs" defaultChecked>
						Slabs
					</Filter>
					<Filter name="categories" value="blocks" defaultChecked>
						Blocks
					</Filter>
					<Filter name="categories" value="maintenance" defaultChecked>
						Maintenance
					</Filter>
					<Filter name="categories" value="cleaning" defaultChecked>
						Cleaning
					</Filter>
				</ul>
			</FilterGroup>

			{/* Price per ft² */}
			<FilterGroup displayName="Price per ft²" collapsible>
				<div className="flex max-w-md gap-2">
					<div className="flex flex-1 items-center gap-2">
						<label htmlFor="min-price">Min:</label>
						<label
							htmlFor="min-price"
							className="flex h-10 flex-1 items-center gap-0.5 rounded-sm border border-gray-400 bg-gray-100 px-2 pr-1 placeholder:text-gray-500 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-pink-700"
						>
							<span className="inline-block text-gray-500">$</span>
							<input
								id="min-price"
								type="number"
								placeholder="0"
								className="no-arrows w-full flex-1 bg-transparent outline-none placeholder:text-gray-500"
							/>
						</label>
					</div>
					<div className="flex flex-1 items-center gap-2">
						<label htmlFor="max-price">Max:</label>
						<label
							htmlFor="max-price"
							className="flex h-10 flex-1 items-center gap-0.5 rounded-sm border border-gray-400 bg-gray-100 px-2 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-pink-700"
						>
							<span className="inline-block text-gray-500">$</span>

							<input
								id="max-price"
								type="number"
								placeholder="Infinity"
								className="no-arrows w-full flex-1 bg-transparent outline-none placeholder:text-gray-500"
							/>
						</label>
					</div>
				</div>
			</FilterGroup>

			{/* Strength */}
			<FilterGroup displayName="Rated Strength" collapsible>
				<ul className="space-y-2">
					<Filter name="weight_rating" value="any" defaultChecked>
						Any
					</Filter>
					<Filter name="weight_rating" value="commercial" defaultChecked>
						Commercial Grade
					</Filter>
					<Filter name="weight_rating" value="residential" defaultChecked>
						Residential Grade
					</Filter>
					<Filter name="weight_rating" value="lightweight" defaultChecked>
						Lightweight
					</Filter>
				</ul>
			</FilterGroup>

			{/* Colors 🌈 */}
			<FilterGroup displayName="Colors" collapsible>
				<ul className="space-y-2">
					<Filter name="colors" value="all" defaultChecked>
						All
					</Filter>
					<ColorFilter
						name="colors"
						value="grey"
						swatch="#D9D9D9"
						defaultChecked
					>
						Grey
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="ash"
						swatch="#B1B1B1"
						defaultChecked
					>
						Ash
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="charcoal"
						swatch="#696969"
						defaultChecked
					>
						Charcoal
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="spanish_brown"
						swatch="#95816D"
						defaultChecked
					>
						Spanish Brown
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="sunset_taupe"
						swatch="#C9B098"
						defaultChecked
					>
						Sunset Taupe
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="tan"
						swatch="#DDCCBB"
						defaultChecked
					>
						Tan
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="sunset_clay"
						swatch="#E7A597"
						defaultChecked
					>
						Sunset Clay
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="red"
						swatch="#EF847A"
						defaultChecked
					>
						Red
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="terracotta"
						swatch="#EFA17A"
						defaultChecked
					>
						Terracotta
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="orange"
						swatch="#EBB075"
						defaultChecked
					>
						Orange
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="sunset_tangerine"
						swatch="#E7C769"
						defaultChecked
					>
						Sunset Tangerine
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="yellow"
						swatch="#E7DD69"
						defaultChecked
					>
						Yellow
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="green"
						swatch="#A9D786"
						defaultChecked
					>
						Green
					</ColorFilter>
					<ColorFilter
						name="colors"
						value="custom_blend"
						swatch="conic-gradient(from 180deg at 50% 50.00%, #EF847A 0deg, #E7DD69 72.0000010728836deg, #A9D786 144.0000021457672deg, #959ECB 216.00000858306885deg, #EF7AA4 288.0000042915344deg, #EF847A 360deg)"
						defaultChecked
					>
						Custom Blend
					</ColorFilter>
				</ul>
			</FilterGroup>

			{/* Misc */}
			<FilterGroup displayName="Misc">
				<ul className="space-y-2">
					<Filter name="has_models" value="true">
						Has 3D Models
					</Filter>
				</ul>
			</FilterGroup>
		</>
	);
}

function Page(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const categoryId = props.category;

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

	const [filterMenuOpen, setFilterMenuOpen] = useState<boolean>(false);
	const screenLg = useMediaQuery('(min-width: 1024px)');

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

			<Main>
				<OrchestratedReveal asChild delay={0.1}>
					<h1 className="py-16 text-center font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl">
						Product Catalogue
					</h1>
				</OrchestratedReveal>

				<div className="flex flex-col gap-12 lg:flex-row lg:items-start">
					<OrchestratedReveal asChild delay={0.2}>
						{!filterMenuOpen && (
							<aside className="hidden w-72 space-y-4 rounded-xl border border-gray-300 bg-gray-200 p-6 focus-within:border-gray-400 lg:block">
								<h2 className="font-display text-lg lg:text-xl">Filters</h2>

								<Filters />
							</aside>
						)}
					</OrchestratedReveal>

					{/* Products */}
					<section className="flex-1 space-y-4">
						<OrchestratedReveal asChild delay={0.3}>
							<div className="flex flex-wrap items-center justify-between gap-2">
								<h2 className="flex items-center gap-2 font-display text-lg lg:text-xl">
									<span>All Items</span>
									<Dialog.Root
										open={filterMenuOpen}
										onOpenChange={setFilterMenuOpen}
									>
										<Dialog.Trigger asChild>
											<Button intent="tertiary" className="lg:hidden">
												<span className="sr-only">Filters</span>
												<Icon name="tune" />
											</Button>
										</Dialog.Trigger>

										<AnimatePresence>
											{!screenLg && filterMenuOpen && (
												<Dialog.Portal forceMount>
													<Dialog.Overlay asChild forceMount>
														<motion.div
															className="fixed inset-0 z-50 bg-gray-900/90"
															initial={{ opacity: 0 }}
															animate={{ opacity: 1 }}
															exit={{ opacity: 0 }}
															transition={{ duration: 0.3 }}
														/>
													</Dialog.Overlay>

													<Dialog.Content
														forceMount
														className="fixed top-full z-50 h-full w-full"
													>
														<motion.aside
															initial={{ y: 0 }}
															animate={{
																y: '-100%',
																transition: {
																	type: 'spring',
																	duration: 0.75,
																	bounce: 0.1
																}
															}}
															exit={{
																y: 0,
																transition: {
																	type: 'spring',
																	duration: 0.3,
																	bounce: 0
																}
															}}
															className="mx-auto flex h-5/6 max-w-md flex-col rounded-t-lg bg-gray-100"
														>
															<div className="flex h-12 items-center px-6">
																<Dialog.Title className="flex-1 font-display text-lg">
																	Filters
																</Dialog.Title>
																<Dialog.Close asChild>
																	<Button intent="tertiary">
																		<span className="sr-only">Close</span>
																		<Icon name="close" />
																	</Button>
																</Dialog.Close>
															</div>

															<div className="flex-1 space-y-4 overflow-y-auto px-6 pb-6 pt-2">
																<Filters />
															</div>
														</motion.aside>
													</Dialog.Content>
												</Dialog.Portal>
											)}
										</AnimatePresence>
									</Dialog.Root>
								</h2>
								<div className="flex items-center gap-2">
									<p>Sort</p>
									<Select defaultValue="alphabetical">
										<SelectTrigger className="px-3 py-2">
											<SelectValue />
										</SelectTrigger>

										<SelectContent>
											<SelectItem value="popular">
												Most Popular First
											</SelectItem>
											<SelectItem value="alphabetical">
												Alphabetical (A - Z)
											</SelectItem>

											<SelectItem value="quantity">
												Quantity In Stock
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						</OrchestratedReveal>
						<OrchestratedReveal asChild delay={0.4}>
							<div className="space-y-8">
								<ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 min-[880px]:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
									{products.pages.map((page) =>
										page.products.map((product) => (
											<ProductCard
												key={product.id}
												name={product.displayName}
												startingSku={product.startingSku}
												link={`/product/${product.id}`}
												className="xl:[&:nth-child(6n+1)]:col-span-2"
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
							</div>
						</OrchestratedReveal>
					</section>
				</div>

				<GetAQuoteSection />
				<InspirationSection />
				<LearnSection />
				<AugmentedRealityGallerySection />
			</Main>

			<Footer />
		</>
	);
}

export const getServerSideProps = async () => {
	const ssrContext = await createInnerTRPCContext({});

	const ssr = await createServerSideHelpers({
		router: appRouter,
		ctx: ssrContext,
		transformer: superjson // optional - adds superjson serialization
	});

	// const categoryId = context.query?.category as string;
	const categoryId = 'all';

	// prefetch `product.getByCategory`
	await ssr.product.getByCategory.prefetchInfinite({ categoryId });

	return {
		props: {
			trpcState: ssr.dehydrate(),
			category: categoryId
		}
	};
};

// export const runtime = 'experimental-edge';

export default Page;
