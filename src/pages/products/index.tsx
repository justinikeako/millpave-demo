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
import { cn } from '~/lib/utils';
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

type CheckboxProps = React.ComponentProps<'input'> & {
	name: string;
	value: string;
};

function Checkbox({ name, value, className, ...props }: CheckboxProps) {
	const inputId = name + ':' + value;

	return (
		<label htmlFor={inputId}>
			<input
				{...props}
				type="checkbox"
				name={name}
				value={value}
				id={inputId}
				className="peer sr-only"
			/>

			<div
				className={cn(
					'group relative h-5 w-5 rounded-sm border border-gray-400 bg-gray-100 from-white/50 text-gray-100 outline-2 outline-gray-900 hover:border-gray-500 active:border-gray-600 peer-checked:!border-pink-700 peer-checked:bg-pink-600 peer-checked:bg-gradient-to-b peer-checked:hover:from-white/60 peer-checked:active:bg-gradient-to-t peer-checked:active:from-white/25 peer-focus-visible:outline',
					className
				)}
			>
				<Icon name="check" className="relative -left-px -top-px" />
			</div>
		</label>
	);
}

type FilterProps = Omit<CheckboxProps, 'slot'> & {
	slot?: React.ReactNode;
};

function Filter({ name, value, children, slot, ...props }: FilterProps) {
	return (
		<li className="flex justify-between gap-2">
			<div className="flex gap-2">
				<Checkbox {...props} name={name} value={value} />
				<label htmlFor={name + ':' + value}>{children}</label>
			</div>

			{slot}
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
					className="h-4 w-4 rounded-full border border-gray-400"
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
			className="group space-y-3 data-[state=open]:pb-2"
			defaultOpen
			disabled={collapsible === undefined}
		>
			<Collapsible.Trigger className="-mx-4 -my-2 flex w-[calc(100%+32px)] items-end justify-between rounded-md px-4 py-2 hover:bg-gray-900/10 active:bg-gray-900/20 disabled:!bg-transparent">
				<span className="font-semibold">{name}</span>

				<Icon
					name="expand_more"
					className="hidden group-data-[state=closed]:block group-data-[disabled]:!hidden"
				/>
				<Icon
					name="expand_less"
					className="hidden group-data-[state=open]:block group-data-[disabled]:!hidden"
				/>
			</Collapsible.Trigger>
			<Collapsible.Content>{children}</Collapsible.Content>
		</Collapsible.Root>
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
					<h1 className="py-16 text-center font-display text-4xl">
						Product Catalogue
					</h1>
				</OrchestratedReveal>

				<div className="flex items-start gap-12">
					<OrchestratedReveal asChild delay={0.2}>
						<section className="w-72 space-y-4 rounded-xl border border-gray-300 bg-gray-200 p-6">
							<h2 className="font-display text-lg">Filters</h2>

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
								<div className="flex gap-2">
									<div className="flex flex-1 items-center gap-2">
										<label htmlFor="min-price">Min:</label>
										<label
											htmlFor="min-price"
											className=" flex gap-0.5 rounded-sm border border-gray-400 bg-gray-100 py-2 pl-3 pr-1 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-pink-700"
										>
											<span className="inline-block font-semibold">$</span>
											<input
												id="min-price"
												type="number"
												placeholder="0"
												className="w-full flex-1 bg-transparent outline-none"
											/>
										</label>
									</div>
									<div className="flex flex-1 items-center gap-2">
										<label htmlFor="max-price">Max:</label>
										<label
											htmlFor="max-price"
											className="flex gap-0.5 rounded-sm border border-gray-400 bg-gray-100 py-2 pl-3 pr-1 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-pink-700"
										>
											<span className="inline-block font-semibold">$</span>

											<input
												id="max-price"
												type="number"
												placeholder="Infinity"
												className="w-full flex-1 bg-transparent outline-none"
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
									<Filter
										name="weight_rating"
										value="commercial"
										defaultChecked
									>
										Commercial Grade
									</Filter>
									<Filter
										name="weight_rating"
										value="residential"
										defaultChecked
									>
										Residential Grade
									</Filter>
									<Filter
										name="weight_rating"
										value="lightweight"
										defaultChecked
									>
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
										Has
									</Filter>
								</ul>
							</FilterGroup>
						</section>
					</OrchestratedReveal>
					{/* Products */}
					<OrchestratedReveal asChild delay={0.3}>
						<section className="flex-1 space-y-4">
							<div className="flex items-center justify-between">
								<h2 className="font-display text-lg">All Items</h2>
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

											<SelectItem value="quantity">Unit Quantity</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
							<div className="space-y-8">
								<ul className="grid grid-cols-3 gap-4">
									{products.pages.map((page) =>
										page.products.map((product) => (
											<ProductCard
												key={product.id}
												name={product.displayName}
												startingSku={product.startingSku}
												link={`/product/${product.id}`}
												className="first:col-span-2 [&:nth-child(7n)]:col-span-2"
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
						</section>
					</OrchestratedReveal>
				</div>

				<LearnSection />
				<AugmentedRealityGallerySection />
			</Main>

			<Footer />
		</>
	);
}

export const getServerSideProps = async () =>
	// context: GetServerSidePropsContext
	{
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
		await ssr.category.getAll.prefetch();

		return {
			props: {
				trpcState: ssr.dehydrate(),
				category: categoryId
			}
		};
	};

export default Page;
