import Head from 'next/head';
import Link from 'next/link';
import { Footer } from '../components/footer';
import { Header } from '../components/header';
import { Button } from '../components/button';
import { ProductCard } from '../components/product-card';

function Page() {
	return (
		<>
			<Head>
				<title>Millennium Paving Stones</title>
			</Head>

			<Header />

			<main className="space-y-48 px-8 pt-16 md:px-24 lg:px-32">
				{/* Hero */}
				<section className="space-y-20">
					<div className="flex flex-col items-center space-y-12">
						<h1 className="text-center text-4xl font-bold">
							<span className="block">Transform Your</span>
							<span>
								<span className="block">Driveway.</span>
							</span>
						</h1>

						<div className="flex space-x-2">
							<Button variant="primary" asChild>
								<Link href="/contact">
									<span>Get a Quote</span>
								</Link>
							</Button>
							<Button variant="secondary" asChild>
								<Link href="/gallery">
									<span>Get Inspired</span>
								</Link>
							</Button>
						</div>
					</div>

					<div className="-mx-8 flex h-[55vmin] items-center justify-center space-x-4 overflow-hidden md:-mx-24 lg:-mx-32 lg:space-x-8">
						<div className="aspect-square h-[75%] bg-gray-200" />
						<div className="aspect-square h-[87.5%] bg-gray-200" />
						<div className="aspect-square h-full bg-gray-200" />
						<div className="aspect-square h-[87.5%] bg-gray-200" />
						<div className="aspect-square h-[75%] bg-gray-200" />
					</div>
				</section>

				{/* Products */}
				<section className="flex flex-col space-y-32">
					<p className="max-w-[28ch] self-center text-center font-display text-2xl text-gray-500">
						<span className="text-gray-900">Our concrete pavers</span> can turn
						your outdoor walkway, deck, patio, or plaza into a functional work
						of art.
					</p>

					<div className="flex flex-col space-y-8">
						<ul className="grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-8">
							<ProductCard
								displayVersion
								name="Colonial Classic"
								startingPrice={203}
								className="md:col-span-3"
							/>
							<ProductCard
								displayVersion
								name="Banjo"
								startingPrice={219}
								className="md:col-span-3"
							/>
							<ProductCard
								displayVersion
								name="Heritage Series"
								startingPrice={219}
								className="md:col-span-6 lg:col-span-2"
							/>
							<ProductCard
								displayVersion
								name="Cobble Mix"
								startingPrice={219}
								className="md:col-span-3 lg:col-span-2"
							/>
							<ProductCard
								displayVersion
								name="Old World Cobble"
								startingPrice={203}
								className="md:col-span-3 lg:col-span-2"
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

					<div className="-mx-8 flex flex-col space-y-4 md:-mx-32 md:space-y-8">
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

				{/* Locations */}
				<section
					id="where-to-buy"
					className="flex scroll-m-16 flex-col gap-8 lg:flex-row lg:items-center lg:gap-32"
				>
					<div className="flex-1">
						<p className="font-display text-lg">Our Locations</p>
						<h2 className="max-w-[20ch] font-display text-3xl">
							Where to buy.
						</h2>
						<br />
						<p className="font-display text-lg">
							We operate from two locations, namely, our manufacturing plant in
							Yallahs, St Thomas and our main office and showroom at 27 Mannings
							Hill Road, Kingston.
						</p>
						<br />
						<Button variant="primary">Get a Quote</Button>
					</div>

					<div className="aspect-square bg-gray-200 lg:h-[60vmin]" />
				</section>

				{/* Process */}
				<section className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-32">
					<div className="flex-1 lg:order-2">
						<p className="font-display text-lg">Our Process</p>
						<h2 className="max-w-[20ch] font-display text-3xl">
							Starting from zero.
						</h2>

						<br />

						<p className="font-display text-lg">
							Integer a velit in sapien aliquam consectetur et vitae ligula.
							Integer ornare egestas enim a malesuada. Suspendisse arcu lectus,
							blandit nec gravida at, maximus ut lorem. Nulla malesuada vehicula
							neque at laoreet. Nullam efficitur mauris sit amet accumsan
							pulvinar.
						</p>

						<br />

						<Button variant="primary">Find an Installer</Button>
					</div>

					<div className="aspect-video w-full bg-gray-200 lg:w-[70vmin]"></div>
				</section>

				{/* About */}
				<section className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-32">
					<div className="flex-1 space-y-8">
						<div>
							<p className="font-display text-lg">About Us</p>
							<h2 className="max-w-[20ch] font-display text-3xl">
								Millennium Paving Stones LTD.
							</h2>
							<br />
							<p className="font-display text-lg">
								Millennium Paving Stones Limited is the largest manufacturer of
								paving stones in Jamaica, and has been in operation since 2000.
								We also manufacture stepping stones, grasscrete, curb wall and
								distribute such complementary products as sealers, cleaners and
								polymeric sand.
							</p>
						</div>
						<div className="flex gap-4">
							<Button variant="primary">
								<Link href="/products">Explore Products</Link>
							</Button>
							<Button variant="secondary">
								<Link href="/contact">Get a Quote</Link>
							</Button>
						</div>
					</div>

					<div className="aspect-square bg-gray-200 lg:h-[60vmin]" />
				</section>
			</main>

			<Footer />
		</>
	);
}

export default Page;
