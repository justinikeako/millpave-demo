import Head from 'next/head';
import { Footer } from '../../components/footer';
import { Header } from '../../components/header';
import { ColorPicker } from '../../components/sku-picker';
import * as Select from '../../components/select';
import { ProductCard } from '../../components/product-card';
import { Button } from '../../components/button';
import Link from 'next/link';

const colorList = [
	{ id: 'grey', displayName: 'Grey', css: '#D9D9D9' },
	{ id: 'ash', displayName: 'Ash', css: '#B1B1B1' },
	{ id: 'charcoal', displayName: 'Charcoal', css: '#696969' },
	{
		id: 'slate',
		displayName: 'Slate',
		css: 'linear-gradient(45deg, #696969 50%, #D9D9D9 50%)'
	},
	{ id: 'spanish_brown', displayName: 'Spanish Brown', css: '#95816D' },
	{ id: 'sunset_taupe', displayName: 'Sunset Taupe', css: '#C9B098' },
	{ id: 'tan', displayName: 'Tan', css: '#DDCCBB' },
	{ id: 'shale_brown', displayName: 'Shale Brown', css: '#907A7A' },
	{ id: 'sunset_clay', displayName: 'Sunset Clay', css: '#E7A597' },
	{ id: 'red', displayName: 'Red', css: '#EF847A' },
	{
		id: 'charcoal_red',
		displayName: 'Charcoal Red',
		css: 'linear-gradient(45deg, #696969 50%, #EF847A 50%)'
	},
	{
		id: 'red_yellow',
		displayName: 'Red Yellow',
		css: 'linear-gradient(45deg, #EF847A 50%, #E7DD69 50%)'
	},
	{ id: 'terracotta', displayName: 'Terracotta', css: '#EFA17A' },
	{ id: 'orange', displayName: 'Orange', css: '#EBB075' },
	{ id: 'sunset_tangerine', displayName: 'Sunset Tangerine', css: '#E7C769' },
	{ id: 'yellow', displayName: 'Yellow', css: '#E7DD69' },
	{ id: 'green', displayName: 'Green', css: '#A9D786' }
];

function Page() {
	return (
		<>
			<Head>
				<title>Product Catalogue</title>
			</Head>

			<Header />

			<main className="space-y-32 px-8 md:px-24 lg:px-32">
				{/* Main Content */}
				<section className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-32">
					{/* Gallery */}
					<div className="flex flex-col items-center gap-2 lg:sticky lg:top-8 lg:flex-[3]">
						<div className="aspect-square w-full bg-gray-200" />
						<div className="flex gap-2">
							<div className="relative aspect-square w-20 p-2 inner-border-2 inner-border-black">
								<div className="h-full w-full bg-gray-200" />
							</div>
							<div className="relative aspect-square w-20 p-1 inner-border inner-border-gray-200">
								<div className="h-full w-full bg-gray-200" />
							</div>
							<div className="relative aspect-square w-20 p-1 inner-border inner-border-gray-200">
								<div className="h-full w-full bg-gray-200" />
							</div>
							<div className="relative aspect-square w-20 p-1 inner-border inner-border-gray-200">
								<div className="h-full w-full bg-gray-200" />
							</div>
						</div>
					</div>

					<div className="space-y-8 lg:flex-[4] lg:space-y-12">
						{/* Basic Info */}
						<section className="space-y-2">
							<h1 className="font-display text-4xl">Colonial Classic</h1>
							<div className="flex flex-wrap justify-between text-lg">
								<div className="flex items-center gap-4">
									<p>
										$203.00 per ft<sup>2</sup>
									</p>
									<div className="h-8 w-[2px] bg-current" />
									<p>$58.54 per unit</p>
								</div>
								<p>In Stock</p>
							</div>
						</section>

						{/* Description */}
						<section className="space-y-2">
							<h2 className="text-lg">Description</h2>
							<p>
								Create a traditional feel to your garden with our Colonial
								Classic Paver. As one of the most sought after styles of stone
								paving, it displays a beautiful range of light tones which will
								brighten up any exterior to create an added sense of space!
								Using aggregates sourced from the St. Thomas River, Colonial
								Classic promises an outdoor area filled with character and is a
								household favourite providing a wealth of design opportunities.
							</p>
						</section>

						{/* Color Picker */}
						<section className="space-y-2">
							<h2 className="text-lg">Color</h2>
							<ColorPicker
								colors={colorList}
								currentColor="grey"
								onChange={(newColor) => console.log(newColor)}
							/>
						</section>

						{/* Estimator */}
						<section className="bg-gray-900 text-white">
							<div className="align-center flex justify-between p-8">
								<h2 className="text-lg">Cost Estimator</h2>

								<Select.Root defaultValue="AREA">
									<Select.Trigger basic />

									<Select.Content>
										<Select.ScrollUpButton />
										<Select.Viewport>
											<Select.Item value="AREA">By Area</Select.Item>
											<Select.Item value="UNIT">By Unit</Select.Item>
										</Select.Viewport>
										<Select.ScrollDownButton />
									</Select.Content>
								</Select.Root>
							</div>
							<div className="space-y-8 px-8 pb-8">
								<div className="flex items-center space-x-4">
									<p>
										Area (ft<sup>2</sup>)
									</p>

									<input
										type="number"
										placeholder="Area"
										className="w-32 rounded-sm p-4 font-semibold text-black outline-none placeholder:font-normal placeholder:text-gray-500"
									/>
								</div>

								<p>
									3.5 pallets (450.63ft²) & 11.03ft² ≈{' '}
									<b>
										461.66ft<sup>2</sup>
									</b>
								</p>
								<hr />

								<div>
									<p className="text-lg">$534,304.34</p>
									<p>Inc. GCT</p>
								</div>
							</div>
						</section>

						{/* Specifications */}
						<section className="space-y-2">
							<h2 className="text-lg">Specifications</h2>
							<ul>
								<li className="flex justify-between rounded-sm px-4 py-3 odd:bg-white even:bg-gray-100">
									<p>Dimensions</p>
									<p>4 in x 8 in x 2.875 in</p>
								</li>
								<li className="flex justify-between rounded-sm px-4 py-3 odd:bg-white even:bg-gray-100">
									<p>Weight per unit</p>
									<p>5 lbs</p>
								</li>
								<li className="flex justify-between rounded-sm px-4 py-3 odd:bg-white even:bg-gray-100">
									<p>Area per pallet</p>
									<p>128.75 sqft</p>
								</li>
								<li className="flex justify-between rounded-sm px-4 py-3 odd:bg-white even:bg-gray-100">
									<p>Units per pallet</p>
									<p>600</p>
								</li>
								<li className="flex justify-between rounded-sm px-4 py-3 odd:bg-white even:bg-gray-100">
									<p>Pieces per sqft</p>
									<p>4.66</p>
								</li>
							</ul>
						</section>
					</div>
				</section>

				{/* Similar Products */}
				<section className="flex flex-col space-y-8">
					<h2 className="max-w-[28ch] self-center text-center font-display text-2xl">
						Similar to Colonial Classic
					</h2>

					<div className="flex flex-col space-y-8">
						<ul className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-8">
							<ProductCard
								displayVersion
								name="Thin Classic"
								startingPrice={183}
								className="md:col-span-3 lg:col-span-2"
							/>
							<ProductCard
								displayVersion
								name="Banjo"
								startingPrice={219}
								className="md:col-span-3 lg:col-span-2"
							/>
							<ProductCard
								displayVersion
								name="Circle Bundle"
								startingPrice={203}
								className="md:col-span-6 lg:col-span-2"
							/>
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
							<div className="flex aspect-square bg-gray-200" />
							<div className="flex aspect-square bg-gray-200" />
							<div className="flex aspect-square bg-gray-200" />
							<div className="flex aspect-square bg-gray-200" />
							<div className="flex aspect-square bg-gray-200" />
							<div className="flex aspect-square bg-gray-200" />
						</div>
						<div className="flex h-[40vmin] justify-center space-x-4 overflow-hidden md:space-x-8">
							<div className="flex aspect-square bg-gray-200" />
							<div className="flex aspect-square bg-gray-200" />
							<div className="flex aspect-square bg-gray-200" />
							<div className="flex aspect-square bg-gray-200" />
							<div className="flex aspect-square bg-gray-200" />
							<div className="flex aspect-square bg-gray-200" />
							<div className="flex aspect-square bg-gray-200" />
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</>
	);
}

export default Page;
