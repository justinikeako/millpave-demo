import Head from 'next/head';
import { ProductCard } from '../components/product-card';
import * as Select from '../components/select';
import { w } from 'windstitch';
import { Icon } from '../components/icon';

type ProductCategoryProps = React.PropsWithChildren<{
	name: string;
}>;

function ProductCategory({ name, children }: ProductCategoryProps) {
	return (
		<li className="space-y-8">
			<h2 className="font-display text-xl">{name}</h2>

			<ul className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-8">
				{children}
			</ul>
		</li>
	);
}

function Chip({ children }: React.PropsWithChildren) {
	return (
		<li>
			<button className="flex gap-1 whitespace-nowrap rounded-full bg-gray-100 px-4 py-2 font-semibold active:bg-gray-300">
				{children}
				<Icon name="edit" opticalSize={20} />
			</button>
		</li>
	);
}

const StyledProductCard = w(ProductCard, {
	className: 'md:col-span-3 xl:col-span-2'
});

function Page() {
	return (
		<>
			<Head>
				<title>Product Catalogue — Millennium Paving Stones</title>
			</Head>

			<main className="space-y-8 px-8 md:px-24 lg:space-y-16 lg:px-32">
				<h1 className="text-center font-display text-4xl">Product Catalogue</h1>

				<div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
					{/* Filters */}
					<div className="top-8 hidden flex-[1] space-y-8 self-start lg:sticky lg:block">
						<h2 className="font-display text-xl">Filters</h2>

						<div className="space-y-4">
							<h3 className="font-display text-lg">Sort By</h3>

							<Select.Root defaultValue="RELEVANCE">
								<Select.Trigger className="w-full" />

								<Select.Content>
									<Select.ScrollUpButton />
									<Select.Viewport>
										<Select.Item value="RELEVANCE">Relevance</Select.Item>
										<Select.Item value="HIGH_TO_LOW">
											Price (High to Low)
										</Select.Item>
										<Select.Item value="LOW_TO_HIGH">
											Price (Low to High)
										</Select.Item>
									</Select.Viewport>
									<Select.ScrollDownButton />
								</Select.Content>
							</Select.Root>
						</div>

						<div className="space-y-4">
							<h3 className="font-display text-lg">Category</h3>

							<div className="flex space-x-2">
								<input type="checkbox" />
								<span>All Categories (16)</span>
							</div>
						</div>

						<div className="space-y-4">
							<h3 className="font-display text-lg">Colors</h3>

							<div className="flex space-x-2">
								<input type="checkbox" />
								<span>All Colors (10)</span>
							</div>
						</div>
					</div>

					<ul className="no-scrollbar -mx-8 flex items-center space-x-2 overflow-x-scroll px-8 lg:hidden">
						<li>
							<button className="flex rounded-full bg-gray-100 p-2.5 active:bg-gray-300">
								<Icon name="tune" weight={400} />
							</button>
						</li>

						<Chip>All Categories</Chip>
						<Chip>All Colors</Chip>
					</ul>

					{/* Categories */}
					<ul className="flex-[4] space-y-16">
						{/* Pavers */}
						<ProductCategory name="Pavers">
							<StyledProductCard name="Colonial Classic" startingPrice={203} />
							<StyledProductCard name="Thin Classic" startingPrice={203} />
							<StyledProductCard name="Banjo" startingPrice={219} />
							<StyledProductCard name="Heritage Series" startingPrice={203} />
							<StyledProductCard name="Cobble Mix" startingPrice={203} />
							<StyledProductCard name="Old World Cobble" startingPrice={203} />
							<StyledProductCard name="Circle Bundle" startingPrice={203} />
							<StyledProductCard name="Tropical Wave" startingPrice={203} />
						</ProductCategory>

						{/* Slabs */}
						<ProductCategory name="Slabs">
							<StyledProductCard name="Savannah" startingPrice={203} />
						</ProductCategory>

						{/* Installation */}
						<ProductCategory name="Materials for Installation">
							<StyledProductCard name="Polymeric Sand" startingPrice={203} />
							<StyledProductCard
								name="Dynamatrix Oil-Based Sealant"
								startingPrice={203}
							/>
							<StyledProductCard
								name="Dynamatrix Water-Based Sealant"
								startingPrice={203}
							/>
						</ProductCategory>

						{/* Cleaning */}
						<ProductCategory name="Concrete Cleaning">
							<StyledProductCard
								name="Dynamatrix Effloressence Cleaner"
								startingPrice={203}
							/>
							<StyledProductCard
								name="Dynamatrix Gum Paint & Tar Stripper"
								startingPrice={203}
							/>
							<StyledProductCard
								name="Dynamatrix Stone Soap"
								startingPrice={203}
							/>
						</ProductCategory>
					</ul>
				</div>
			</main>
		</>
	);
}

export default Page;
